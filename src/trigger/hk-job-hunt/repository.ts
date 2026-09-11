import {mkdir,writeFile,readFile,readdir} from 'node:fs/promises';
import path from 'node:path';
import {tmpdir} from 'node:os';
import {randomUUID} from 'node:crypto';
import {parse} from 'csv-parse/sync';
import type {Contact} from './policy.js';

export const inputFiles=['CLAUDE.md','.claude/skills/hk-job-hunt/SKILL.md','.claude/skills/humaniser/SKILL.md','.claude/skills/humaniser/scripts/check.py','profile/YOUR-PROFILE.md','cv/Adam_Kanevsky_CV.pdf','targets/companies.md','targets/deadlines.md','tracker/outreach.csv','templates/email-templates.md'];
export function parseTracker(csv:string):Contact[]{
  const records=parse(csv,{columns:true,skip_empty_lines:true,bom:true}) as Record<string,string>[];
  return records.map(r=>({...r,company:r.company,email:r.email,follow_up_count:r.follow_up_count&&/^\d+$/.test(r.follow_up_count)?Number(r.follow_up_count):undefined,opt_out:r.opt_out==='true'}));
}
export function githubConfig(){
  const token=process.env.GITHUB_TOKEN;const repo=process.env.GITHUB_REPOSITORY;const branch=process.env.GITHUB_BRANCH;
  if(!token||!repo||!branch)throw new Error('GITHUB_TOKEN, GITHUB_REPOSITORY and GITHUB_BRANCH are required.');
  if(!/^[\w.-]+\/[\w.-]+$/.test(repo))throw new Error('Invalid repository name.');
  return {token,repo,branch};
}
export async function github(endpoint:string,method='GET',body?:unknown){
  const {token,repo}=githubConfig();
  const response=await fetch(`https://api.github.com/repos/${repo}/${endpoint}`,{method,headers:{Authorization:`Bearer ${token}`,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28',...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(30000)});
  if(!response.ok)throw new Error(`GitHub ${method} ${response.status} at ${endpoint.split('?')[0]}`);
  return response.json() as Promise<any>;
}
export async function loadSnapshot(){
  const {branch}=githubConfig();
  const info=await github('');
  if(!info.private)throw new Error('Cloud runs require a private repository for contact history and draft materials.');
  const ref=await github('git/ref/heads/'+branch.split('/').map(encodeURIComponent).join('/'));
  const commit=await github('git/commits/'+ref.object.sha);
  const root=path.join(tmpdir(),'hk-job-hunt-'+randomUUID());
  await mkdir(root,{recursive:true});
  for(const file of inputFiles){
    const data=await github(`contents/${file}?ref=${encodeURIComponent(ref.object.sha)}`);
    if(data.type!=='file'||data.encoding!=='base64')throw new Error('Missing required input: '+file);
    await mkdir(path.dirname(path.join(root,file)),{recursive:true});
    await writeFile(path.join(root,file),Buffer.from(data.content,'base64'));
  }
  const context=(await Promise.all(inputFiles.filter(f=>f.endsWith('.md')).map(f=>readFile(path.join(root,f),'utf8')))).join('\n\n');
  return {root,context,head:ref.object.sha as string,tree:commit.tree.sha as string,rows:parseTracker(await readFile(path.join(root,'tracker/outreach.csv'),'utf8'))};
}
export async function uploadWeek(root:string,week:string,head:string,tree:string){
  if(!/^\d{4}-week-\d{2}$/.test(week))throw new Error('Invalid week');
  const {branch}=githubConfig();
  const files=[`outbox/${week}.md`,...(await readdir(path.join(root,'outbox',week))).map(f=>`outbox/${week}/${f}`)];
  const entries=[];
  for(const file of files){const blob=await github('git/blobs','POST',{content:(await readFile(path.join(root,file))).toString('base64'),encoding:'base64'});entries.push({path:file,mode:'100644',type:'blob',sha:blob.sha});}
  const newTree=await github('git/trees','POST',{base_tree:tree,tree:entries});
  const commit=await github('git/commits','POST',{message:`Prepare ${week} Hong Kong job review pack`,tree:newTree.sha,parents:[head]});
  // Never force. A concurrent edit must fail and be reconciled, not overwritten.
  await github('git/refs/heads/'+branch.split('/').map(encodeURIComponent).join('/'),'PATCH',{sha:commit.sha,force:false});
  return commit.sha as string;
}
