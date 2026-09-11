import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,readFile,writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import * as research from '../src/trigger/hk-job-hunt/research.js';
import * as tasks from '../src/trigger/hk-job-hunt/tasks.js';
const r=research as any;const t=tasks as any;
const draft={id:'model-id',kind:'cold',company:'Acme',person:'Alex',email:null,variant:'B-teardown',subject:'A check before the next deposit',body:'Hi Alex, I read your guide. I wrote a short note on the payment choice. Adam',holdReasons:['Review required.'],artefact:{title:'Payment choice',sections:[{heading:'Proposal',text:'Show the required evidence beside each route. This is a proposal to test.'}],sources:[{url:'https://example.com/',title:'Guide',checkedAt:'2026-09-11',note:'Check before sending.'}]}};
test('cold output cannot masquerade as warm or omit its sample',()=>{
 assert.equal(typeof r.parseColdOutput,'function');
 assert.throws(()=>r.parseColdOutput({...draft,kind:'warm',artefact:undefined},'Acme',['https://example.com/']));
 assert.throws(()=>r.parseColdOutput({...draft,artefact:undefined},'Acme',['https://example.com/']));
 assert.throws(()=>r.parseColdOutput({...draft,company:'Other'},'Acme',['https://example.com/']));
});
test('cold identity is deterministic and cannot collide through model IDs',()=>{
 assert.equal(typeof r.parseColdOutput,'function');
 const a=r.parseColdOutput(draft,'Acme',['https://example.com/']);
 const b=r.parseColdOutput({...draft,id:'different'},'Acme',['https://example.com/']);
 const c=r.parseColdOutput({...draft,company:'Other'},'Other',['https://example.com/']);
 assert.equal(a.id,b.id);assert.equal(a.variant,b.variant);assert.notEqual(a.id,c.id);
 assert.match(a.id,/^[a-z0-9][a-z0-9-]{0,79}$/);assert.ok(['A-finding','B-teardown'].includes(a.variant));
});
test('child validation rejects overlong mail, multi-page sample and oversized attachments before success',async()=>{
 assert.equal(typeof r.validateColdDraft,'function');
 const email=r.parseColdOutput(draft,'Acme',['https://example.com/']);
 await r.validateColdDraft(email,process.cwd(),'2026-09-11',1000);
 await assert.rejects(r.validateColdDraft({...email,body:Array(140).fill('word').join(' ')},process.cwd(),'2026-09-11',1000),/140/);
 await assert.rejects(r.validateColdDraft({...email,artefact:{...email.artefact,sections:[{heading:'Proposal',text:'A plain sentence. '.repeat(1500)}]}},process.cwd(),'2026-09-11',1000),/one page/);
 await assert.rejects(r.validateColdDraft(email,process.cwd(),'2026-09-11',999999),/1MB/);
});
async function services(){
 const root=await mkdtemp(path.join(tmpdir(),'hk-runtime-'));await mkdir(path.join(root,'cv'));
 await writeFile(path.join(root,'cv/Adam_Kanevsky_CV.pdf'),'%PDF-1.7 test');
 let publications=0;let discoveryFails=true;let partial:any=null;
 const dependencies={
  config:()=>({branch:'test'}),prior:async()=>{if(partial)return partial;throw new Error('GitHub GET 404');},
  snapshot:async()=>({root,context:'Test',head:'head',tree:'tree',rows:[]}),
  targets:async()=>discoveryFails?{ok:false}:{ok:true,output:['Acme','Other'].map(company=>({company,verification:'verified'}))},
  applications:async()=>({ok:true,output:[]}),
  draft:async(p:any)=>p.company==='Acme'?{ok:true,output:r.parseColdOutput(draft,'Acme',['https://example.com/'])}:{ok:false},
  publish:async(batch:any)=>{publications++;await mkdir(path.join(root,'outbox',batch.week),{recursive:true});return {status:'drafts_for_review',emails:batch.emails};},
  upload:async()=> 'commit',
 };
 return {dependencies,root,get publications(){return publications;},recover:()=>{discoveryFails=false;},setPrior:(v:any)=>{partial=v;}};
}
test('discovery failure publishes nothing and the same week can recover',async()=>{
 assert.equal(typeof t.runWeeklyCore,'function');const s=await services();
 await assert.rejects(t.runWeeklyCore({date:'2026-09-11'},s.dependencies),/discovery/i);assert.equal(s.publications,0);
 s.recover();const result=await t.runWeeklyCore({date:'2026-09-11'},s.dependencies);
 assert.equal(s.publications,1);assert.equal(result.status,'partial');assert.equal(result.manifest.emails.length,1);
 assert.equal(result.manifest.failedItems.length,1);
 const persisted=JSON.parse(await readFile(path.join(s.root,'outbox','2026-week-37','manifest.json'),'utf8'));
 assert.equal(persisted.status,'partial');
 s.setPrior(persisted);await t.runWeeklyCore({date:'2026-09-11'},s.dependencies);assert.equal(s.publications,2);
});
test('confirmed applications block exact roles, one-application employers, and unknown programmes without dates',()=>{
 const application=(company:string,title:string)=>({id:company+title,company,title,url:'https://example.com/',deadline:null,start:'August 2027',language:'English',eligibility:'Review',points:['A point'],status:'review',holdReasons:[],source:{url:'https://example.com/',title:'Guide',checkedAt:'2026-09-11',note:'Review'}});
 const previous=[{company:'UBS',role_title:'Global Wealth Management',status:'applied',date_sent:''},{company:'UBS',role_title:'GIC Solutions',status:'applied',date_sent:''},{company:'HSBC',role_title:'Investment Banking',status:'applied',date_sent:''},{company:'BlackRock',role_title:'Unknown',status:'applied',date_sent:''}];
 const result=t.filterApplicationHistory([application('UBS','2027 Global Wealth Management Hong Kong'),application('UBS','GIC Solutions Graduate Programme'),application('UBS','Asset Management'),application('HSBC','Commercial Banking'),application('BlackRock','Graduate Analyst')],previous);
 assert.deepEqual(result.applications.map((a:any)=>a.title),['Asset Management']);assert.equal(result.excluded.length,4);
});
test('a fully completed weekly manifest still prevents duplicate publication',async()=>{
 const s=await services();s.setPrior({status:'drafts_for_review'});
 const result=await t.runWeeklyCore({date:'2026-09-11'},s.dependencies);
 assert.equal(result.status,'already_prepared');assert.equal(s.publications,0);
});
test('application discovery failure also prevents publication',async()=>{
 const s=await services();s.recover();s.dependencies.applications=async()=>({ok:false} as any);
 await assert.rejects(t.runWeeklyCore({date:'2026-09-11'},s.dependencies),/applications/);assert.equal(s.publications,0);
});
