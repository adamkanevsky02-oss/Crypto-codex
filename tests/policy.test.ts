import {test} from 'node:test';
import assert from 'node:assert/strict';
import {hkWeek, canContact, metrics, schedule} from '../src/trigger/hk-job-hunt/policy.js';

const now = new Date('2026-09-11T04:00:00Z');
const sent = {company:'Acme',email:'a@acme.example',status:'sent',date_sent:'2026-09-01',follow_up_due:'2026-09-08',follow_up_count:0};
test('schedule is 09:07 Hong Kong, not Sydney',()=>assert.deepEqual(schedule,{pattern:'7 9 * * 1',timezone:'Asia/Hong_Kong'}));
test('Hong Kong Monday belongs to next week even on UTC Sunday',()=>assert.equal(hkWeek(new Date('2026-09-13T16:01:00Z')),'2026-week-38'));
test('ISO week year survives New Year',()=>assert.equal(hkWeek(new Date('2027-01-01T00:00:00Z')),'2026-week-53'));
test('blocks a second cold contact at the same company within 30 days',()=>assert.match(canContact({kind:'cold',company:' acme ',email:'b@acme.example'},[sent],now).join(' '),/30 days/));
test('drafts never count as sent or consume the 30 day window',()=>assert.equal(canContact({kind:'cold',company:'Acme'},[{...sent,status:'drafted',date_sent:''}],now).length,0));
test('permits due same-thread follow-up within company cooldown',()=>assert.equal(canContact({kind:'follow_up',company:'Acme',email:sent.email},[sent],now).length,0));
test('blocks third follow-up',()=>assert.match(canContact({kind:'follow_up',company:'Acme',email:sent.email},[{...sent,follow_up_count:2}],now).join(' '),/two/));
test('unknown follow-up count fails closed',()=>assert.match(canContact({kind:'follow_up',company:'Acme',email:sent.email},[{...sent,follow_up_count:undefined}],now).join(' '),/count/));
test('future follow-up is blocked',()=>assert.ok(canContact({kind:'follow_up',company:'Acme',email:sent.email},[{...sent,follow_up_due:'2026-09-20'}],now).length));
test('opt-out persists despite later drafted row',()=>assert.match(canContact({kind:'cold',company:'Acme',email:sent.email},[{...sent,status:'rejected',opt_out:true},{...sent,status:'drafted',date_sent:''}],now).join(' '),/opt-out/));
test('malformed send date blocks uncertain company history',()=>assert.ok(canContact({kind:'cold',company:'Acme'},[{...sent,date_sent:'yesterday'}],now).length));
test('zero sends yields no reply rate and zero live conversations',()=>assert.deepEqual(metrics([{...sent,status:'drafted',date_sent:''}]),{sent:0,replies:0,bounces:0,calls:0,live:0,replyRate:null,variants:{}}));
test('duplicate follow-up rows do not inflate contact or conversation counts',()=>{const result=metrics([{...sent,status:'replied',reply_type:'positive',variant:'A-finding'},{...sent,status:'replied',reply_type:'positive',variant:'A-finding'}]);assert.equal(result.sent,1);assert.equal(result.live,1);});
test('user company exclusion blocks every outreach kind and company suffix without fabricating a send',()=>{
  const rows=[{company:'Example Finance',status:'excluded'},{company:'Former Capital',status:'excluded'}];
  for(const kind of ['cold','warm','follow_up','reply'])for(const company of ['Example Finance','Example Finance Limited','Former Capital Management'])assert.match(canContact({kind,company,email:'example@example.com'},rows,now).join(' '),/excluded/i);
  assert.equal(canContact({kind:'cold',company:'Other finance firm'},rows,now).length,0);
  assert.equal(metrics(rows).sent,0);
});
