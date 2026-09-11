import {spawn} from 'node:child_process';
import {readFile,writeFile,mkdir,rename,rmdir} from 'node:fs/promises';
import path from 'node:path';
import {createHash,randomUUID} from 'node:crypto';
import PDFDocument from 'pdfkit';
import {canContact,metrics,type Contact} from './policy.js';

export interface Source {url:string; title:string; checkedAt:string; note:string;}
export interface Artefact {title:string; sections:{heading:string;text:string}[]; sources:Source[];}
export interface Email {id:string;kind:'cold'|'warm'|'follow_up'|'reply';company:string;person:string;email:string|null;addressEvidence?:string;variant:string;subject:string;body:string;artefact?:Artefact;holdReasons:string[];}
export interface Application {id:string;company:string;title:string;url:string;deadline:string|null;start:string;language:string;eligibility:string;points:string[];status:'review'|'held';holdReasons:string[];source:Source;exclusiveGroup?:string;}
export interface Batch {week:string;createdAt:string;emails:Email[];applications:Application[];notes:string[];reserveCount:number;}
export async function checkCopy(text:string,root:string):Promise<void>{
  if(text.includes(';'))throw new Error('Email/artefact semicolon is not permitted.');
  await new Promise<void>((resolve,reject)=>{
    const child=spawn(process.env.PYTHON_BIN||'python3',[path.join(root,'.claude/skills/humaniser/scripts/check.py')],{stdio:['pipe','pipe','pipe']});
    let output='';let error='';
    const timer=setTimeout(()=>{child.kill();reject(new Error('Humaniser timed out'));},10000);
    child.stdout.on('data',b=>output+=b);child.stderr.on('data',b=>error+=b);
    child.on('error',e=>{clearTimeout(timer);reject(e);});
    child.on('close',code=>{clearTimeout(timer);code===0&&output.trim()==='HUMANISER: clean'?resolve():reject(new Error(output||error||'Humaniser failed'));});
    child.stdin.end(text);
  });
}
export function validateBatch(input:unknown):asserts input is Batch{
  const batch=input as Batch;
  if(!batch||!Array.isArray(batch.emails)||!Array.isArray(batch.applications))throw new Error('Invalid batch shape.');
  if(batch.emails.length+batch.applications.length>100)throw new Error('Maximum 100 actions.');
  if(!/^\d{4}-week-\d{2}$/.test(batch.week))throw new Error('Invalid week id.');
  if(new Set(batch.emails.filter(x=>x.kind==='cold').map(x=>x.variant)).size>2)throw new Error('Maximum two cold variants.');
  const ids=new Set<string>(); const companies=new Set<string>();
  for(const item of [...batch.emails,...batch.applications]){
    if(!/^[a-z0-9][a-z0-9-]{0,79}$/.test(item.id)||ids.has(item.id))throw new Error('Invalid or duplicate item id.');
    ids.add(item.id);
    if('body' in item){
      if(/[\r\n]/.test(item.subject)||/[\r\n]/.test(item.email||''))throw new Error('Unsafe email header.');
      if(item.body.trim().split(/\s+/).length>=140)throw new Error('Email must be under 140 words.');
      if(item.kind==='cold'){
        const key=item.company.trim().toLowerCase();
        if(companies.has(key))throw new Error('Duplicate cold company in batch.'); companies.add(key);
        if(!item.artefact||item.artefact.sources.length===0)throw new Error('Cold email requires sourced artefact.');
      }
    }
  }
}
export async function makePdf(artefact:Artefact):Promise<Buffer>{
  return new Promise((resolve,reject)=>{
    const doc=new PDFDocument({size:'A4',margin:42,bufferPages:true,info:{Title:artefact.title,Author:'Adam Kanevsky'}});
    const chunks:Buffer[]=[];doc.on('data',b=>chunks.push(b));doc.on('error',reject);doc.on('end',()=>resolve(Buffer.concat(chunks)));
    doc.font('Helvetica-Bold').fontSize(9).fillColor('#536276').text('ADAM KANEVSKY | RESEARCH SAMPLE');
    doc.moveDown(.8).fontSize(19).fillColor('#172A3A').text(artefact.title);
    doc.moveDown(.6).font('Helvetica').fontSize(9).fillColor('#586371').text('Draft for review | Public sources only | Please check each stated fact before sending');
    for(const section of artefact.sections){
      doc.moveDown(.8).font('Helvetica-Bold').fontSize(10).fillColor('#172A3A').text(section.heading);
      doc.moveDown(.25).font('Helvetica').fontSize(10).fillColor('#222222').text(section.text,{lineGap:2});
    }
    doc.moveDown(.8).font('Helvetica-Bold').fontSize(9).text('Sources and scope');
    for(const [i,s] of artefact.sources.entries()){
      doc.moveDown(.3).font('Helvetica').fontSize(8).fillColor('#334C65').text(`[${i+1}] ${s.title}. Checked ${s.checkedAt}. ${s.note}`);
      doc.text(s.url,{link:s.url,lineGap:1});
    }
    if(doc.bufferedPageRange().count!==1){reject(new Error('Artefact must fit one page.'));doc.end();return;}
    doc.end();
  });
}
const base64=(data:Buffer)=>data.toString('base64').match(/.{1,76}/g)!.join('\r\n');
export function makeEml(email:Email,cv:Buffer,pdf?:Buffer):string{
  const boundary='hk-'+createHash('sha256').update(email.id).digest('hex').slice(0,24);
  const parts=[`X-Unsent: 1`,`MIME-Version: 1.0`,`Subject: =?UTF-8?B?${Buffer.from(email.subject).toString('base64')}?=`,`Content-Type: multipart/mixed; boundary="${boundary}"`];
  // Intentionally no sender or recipient: human must choose account and verify To before sending.
  parts.push('',`--${boundary}`,'Content-Type: text/plain; charset=UTF-8','Content-Transfer-Encoding: base64','',base64(Buffer.from(email.body)));
  for(const [name,bytes] of [['Adam_Kanevsky_CV.pdf',cv],...(pdf?[[`${email.id}.pdf`,pdf]]:[])] as [string,Buffer][]){
    parts.push(`--${boundary}`,'Content-Type: application/pdf',`Content-Disposition: attachment; filename="${name}"`,'Content-Transfer-Encoding: base64','',base64(bytes));
  }
  parts.push(`--${boundary}--`,''); return parts.join('\r\n');
}
export async function publishBatch(batch:Batch,root:string,rows:Contact[]=[]){
  validateBatch(batch);
  await mkdir(path.join(root,'outbox'),{recursive:true});
  const lock=path.join(root,'outbox','.'+batch.week+'.lock');
  await mkdir(lock);
  try{return await publishUnlocked(batch,root,rows);}finally{await rmdir(lock);}
}
async function publishUnlocked(batch:Batch,root:string,rows:Contact[]=[]){
  validateBatch(batch);
  const folder=path.join(root,'outbox',batch.week);
  const fingerprint=createHash('sha256').update(JSON.stringify(batch)).digest('hex');
  try{const old=JSON.parse(await readFile(path.join(folder,'manifest.json'),'utf8'));if(old.fingerprint===fingerprint){
    try{await readFile(path.join(root,'outbox',batch.week+'.md'));}catch(e:any){if(e.code!=='ENOENT')throw e;const internal=await readFile(path.join(folder,'review.md'),'utf8');await writeFile(path.join(root,'outbox',batch.week+'.md'),internal.replaceAll('](./',`](${batch.week}/`),{flag:'wx'});}
    return old;
  }throw new Error('Week already published with different content; preserve it and review a revision.');}catch(e:any){if(e.code!=='ENOENT')throw e;}
  const cv=await readFile(path.join(root,'cv/Adam_Kanevsky_CV.pdf'));
  if(cv.subarray(0,5).toString()!=='%PDF-')throw new Error('CV is not a PDF.');
  const ready:{email:Email;pdf?:Buffer;holds:string[]}[]=[];
  const excluded:{id:string;reasons:string[]}[]=[];
  for(const email of batch.emails){
    const policyIssues=canContact(email as Contact,rows,new Date(batch.createdAt));
    if(policyIssues.length){excluded.push({id:email.id,reasons:policyIssues});continue;}
    await checkCopy(email.subject+'\n'+email.body,root);
    const holds=[...email.holdReasons];
    if(!email.email||!email.addressEvidence)holds.push('UNVERIFIED address. Confirm the recipient before sending.');
    let pdf:Buffer|undefined;
    if(email.artefact){
      await checkCopy([email.artefact.title,...email.artefact.sections.flatMap(x=>[x.heading,x.text]),...email.artefact.sources.map(s=>s.title+' '+s.note)].join('\n'),root);
      for(const s of email.artefact.sources)if(!/^https:\/\//.test(s.url)||!s.checkedAt)throw new Error('Missing source evidence.');
      pdf=await makePdf(email.artefact);
      holds.push('Adam to check cited facts and approve the research sample.');
    }
    if(cv.length+(pdf?.length||0)>=1000000)throw new Error('Attachments must total under 1MB.');
    ready.push({email,pdf,holds});
  }
  for(const app of batch.applications)await checkCopy(app.points.join('\n'),root);
  const temporary=path.join(root,'tmp',`${batch.week}-${randomUUID()}`);await mkdir(temporary,{recursive:true});
  const report=[`# ${batch.week} | Hong Kong job hunt`,``,`Prepared for review. Nothing sent or submitted.`,...batch.notes.map(x=>`- ${x}`),'',`Reserve targets: ${batch.reserveCount}. ${batch.reserveCount<100?'Below the 100-target aim; replenish only with researched fits.':''}`,'','## Messages'];
  const manifest:any={week:batch.week,fingerprint,createdAt:batch.createdAt,status:'drafts_for_review',emails:[],excluded,applications:batch.applications.length,metrics:metrics(rows),checks:{humaniser:'clean',attachments:'under 1MB each',artefacts:'one page each'},nothingSent:true};
  for(const [index,{email,pdf,holds}] of ready.entries()){
    await writeFile(path.join(temporary,email.id+'.txt'),email.body+'\n');
    await writeFile(path.join(temporary,email.id+'.eml'),makeEml(email,cv,pdf));
    if(pdf)await writeFile(path.join(temporary,email.id+'.pdf'),pdf);
    report.push(`### ${index+1}. ${email.company}: ${email.person}`,`Type: ${email.kind} | Variant: ${email.variant}`,`Address: ${email.email||'UNVERIFIED, not guessed'}`,`Checks: ${holds.join(' ')||'Review and approve before sending.'}`,`Subject: ${email.subject}`,'',email.body,'',`[Email draft with attachments](${batch.week}/${email.id}.eml)${pdf?` | [One-page research sample](${batch.week}/${email.id}.pdf)`:''}`,'');
    manifest.emails.push({id:email.id,kind:email.kind,variant:email.variant,words:email.body.trim().split(/\s+/).length,attachmentBytes:cv.length+(pdf?.length||0),holds});
  }
  report.push('## Formal applications','Compare alternatives within the same programme. Do not submit multiple applications where the employer permits only one.','');
  for(const app of batch.applications)report.push(`### ${app.company}: ${app.title}`,`[Official application](${app.url})`,`Status: ${app.status}. Deadline: ${app.deadline||'Not published'}. Start: ${app.start}.`,`Language: ${app.language}`,`Eligibility: ${app.eligibility}`,app.exclusiveGroup?`Choose one within: ${app.exclusiveGroup}`:'',...app.holdReasons.map(x=>`- Check: ${x}`),...app.points.map(x=>`- ${x}`),'');
  report.push('## TESTS','| Variant | Sent | Human replies | Positive | Calls | Bounces |','|---|---:|---:|---:|---:|---:|',...Array.from(new Set(batch.emails.filter(x=>x.kind==='cold').map(x=>x.variant))).map(v=>{const m=manifest.metrics.variants[v];return `| ${v} | ${m?.sent||0} | ${m?.replies||0} | ${m?.positive||0} | ${m?.calls||0} | ${m?.bounces||0} |`;}),'No variant judgement before 20 confirmed sends per variant. Different target types confound comparisons.','',`Live conversations recorded: ${manifest.metrics.live}. The tracker cannot measure conversations not recorded in it.`);
  await writeFile(path.join(temporary,'manifest.json'),JSON.stringify(manifest,null,2));
  report.push('',...excluded.map(x=>`Excluded ${x.id}: ${x.reasons.join(' ')}`));
  await writeFile(path.join(temporary,'review.md'),report.join('\n').replaceAll(`](${batch.week}/`,'](./'));
  await mkdir(path.dirname(folder),{recursive:true});await rename(temporary,folder);
  await writeFile(path.join(root,'outbox',batch.week+'.md'),report.join('\n'),{flag:'wx'});
  return manifest;
}
