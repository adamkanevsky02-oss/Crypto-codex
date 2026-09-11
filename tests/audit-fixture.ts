import {sealAudit,reviewChecks,type Review} from '../src/trigger/hk-job-hunt/audit.js';
// Synthetic review for packaging tests only. Never imported by production code.
export function reviewed<T extends Record<string,any>>(item:T){
 const now=new Date().toISOString();
 const review:Review={verdict:'pass',checks:Object.fromEntries(reviewChecks.map(k=>[k,{pass:true,reason:'Synthetic fixture for package verification only.'}])) as Review['checks'],claims:[{text:'This is a proposal to test.',kind:'proposal',explanation:'Synthetic fixture, no real company claim.'}],calculations:[],issues:[],briefing:'Synthetic fixture only. This tests draft packaging and does not represent researched outreach.'};
 return {...item,audit:sealAudit(item,review,[{url:'https://example.com/',retrievedAt:now,text:'Synthetic fixture source. '.repeat(10)}],'',now,'desktop-source-audit')};
}
