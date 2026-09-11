import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {publishBatch,type Batch} from '../src/trigger/hk-job-hunt/package.js';
import {parseTracker} from '../src/trigger/hk-job-hunt/repository.js';

// Local review packaging only. No mailbox or submission capability.
const file=process.argv[2];
if(!file)throw new Error('Usage: npm run package-batch -- private/batch-YYYY-week-NN.json');
const root=process.cwd();
const batch=JSON.parse(await readFile(path.resolve(file),'utf8')) as Batch;
const rows=parseTracker(await readFile(path.join(root,'tracker/outreach.csv'),'utf8'));
try{rows.push(...parseTracker(await readFile(path.join(root,'private/outreach.csv'),'utf8')));}catch(e:any){if(e.code!=='ENOENT')throw e;}
const manifest=await publishBatch(batch,root,rows);
console.log(JSON.stringify({week:manifest.week,status:manifest.status,emails:manifest.emails.length,applications:manifest.applications,checks:manifest.checks,nothingSent:manifest.nothingSent},null,2));
