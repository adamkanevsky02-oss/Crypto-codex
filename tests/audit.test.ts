import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,cp,readFile} from 'node:fs/promises';
import path from 'node:path';
import {tmpdir} from 'node:os';
import {publishBatch} from '../src/trigger/hk-job-hunt/package.js';
import {sealAudit,assertAudit,reviewChecks,type Review} from '../src/trigger/hk-job-hunt/audit.js';

const item={subject:'Fee example',body:'A hypothetical USD 100,000 exchange at 0.10% costs USD 100.'};
function proof(){
 const date=new Date().toISOString();
 const review:Review={verdict:'pass',checks:Object.fromEntries(reviewChecks.map(k=>[k,{pass:true,reason:'Reviewed against the synthetic fee schedule.'}])) as Review['checks'],claims:[
 {text:'A hypothetical USD 100,000 exchange',kind:'assumption',explanation:'This is an explicit scenario, not customer data.'},
 {text:'0.10%',kind:'fact',sourceUrl:'https://example.com/fees',quote:'The exchange fee is 0.10%.',explanation:'The source states the published exchange fee.'},
 {text:'costs USD 100',kind:'calculation',calculationId:'fx',displayedValue:100,explanation:'Apply the published percentage to scenario volume.'} as any],
 calculations:[{id:'fx',operands:[100000,0.001],operation:'multiply',result:100,unit:'USD',basis:'USD volume multiplied by percentage divided by one hundred.'}],issues:[],briefing:'A hypothetical fee example for a synthetic company, used only to exercise review failure checks.'};
 const evidence=[{url:'https://example.com/fees',text:'The exchange fee is 0.10%.',retrievedAt:date}];
 return {review,evidence,date};
}
test('reject wrong arithmetic even when the reviewer says pass',()=>{const p=proof();p.review.calculations[0].result=145;assert.throws(()=>sealAudit(item,p.review,p.evidence,'',p.date),/arithmetic|display/i);});
test('reject correct arithmetic paired with a different displayed result',()=>{const p=proof();p.review.calculations[0].operands=[100000,0.002];p.review.calculations[0].result=200;assert.throws(()=>sealAudit(item,p.review,p.evidence,'',p.date),/display/i);});
test('reject invented quote even from a real URL',()=>{const p=proof();p.evidence[0].text='Different text';assert.throws(()=>sealAudit(item,p.review,p.evidence,'',p.date),/quote/);});
test('reject an uncovered numeral',()=>{const p=proof();assert.throws(()=>sealAudit({...item,body:item.body+' Minimum USD 50.'},p.review,p.evidence,'',p.date),/numeric/);});
test('reject a material condition failure instead of delegating it to Adam',()=>{const p=proof();p.review.checks.conditions.pass=false;assert.throws(()=>sealAudit(item,p.review,p.evidence,'',p.date),/conditions/);});
test('reject generic low-value analysis even with accurate numbers',()=>{const p=proof();p.review.checks.usefulness.pass=false;assert.throws(()=>sealAudit(item,p.review,p.evidence,'',p.date),/usefulness/);});
test('edited and expired receipts cannot be reused',()=>{const p=proof();const audit=sealAudit(item,p.review,p.evidence,'',p.date);assertAudit({...item,audit});assert.throws(()=>assertAudit({...item,subject:'An unsupported new hook',audit}),/edited/);assert.throws(()=>assertAudit({...item,audit},new Date(Date.parse(p.date)+8*86400000)),/expired/);});
test('old retrieved evidence cannot be labelled freshly reviewed',()=>{const p=proof();p.evidence[0].retrievedAt=new Date(Date.parse(p.date)-2*86400000).toISOString();assert.throws(()=>sealAudit(item,p.review,p.evidence,'',p.date),/stale/);});
test('personal assertions require confirmed context, not a reviewer invention',()=>{const p=proof();p.review.claims[0]={text:p.review.claims[0].text,kind:'personal',quote:'I ran a hedge fund.',explanation:'Invented personal history must not pass.'};assert.throws(()=>sealAudit(item,p.review,p.evidence,'Student',p.date),/personal/);});

test('a clean humaniser and source URL cannot release an unaudited attachment',async()=>{
 const root=await mkdtemp(path.join(tmpdir(),'hk-audit-'));
 await mkdir(path.join(root,'cv'));await cp('cv/Adam_Kanevsky_CV.pdf',path.join(root,'cv/Adam_Kanevsky_CV.pdf'));
 await cp('.claude',path.join(root,'.claude'),{recursive:true});
 const m=await publishBatch({week:'2026-week-37',createdAt:'2026-09-11T01:00:00Z',reserveCount:1,notes:[],applications:[],emails:[{id:'unchecked',company:'Example',person:'Alex',kind:'cold',email:null,variant:'A-finding',subject:'A fee example',body:'Hi Alex, the fee is USD 145. Adam',holdReasons:[],artefact:{title:'Fee example',sections:[{heading:'Claim',text:'The fee is USD 145.'}],sources:[{url:'https://example.com',title:'Pricing',checkedAt:'2026-09-11',note:'Public page.'}]}}]},root);
 assert.equal(m.emails.length,0,'Unreviewed research must not be packaged as an email');
 assert.match(m.excluded[0].reasons.join(' '),/audit/i);
 await assert.rejects(readFile(path.join(root,'outbox/2026-week-37/unchecked.eml')));
});
