export const schedule = { pattern: "7 9 * * 1", timezone: "Asia/Hong_Kong" };
export interface Contact {kind?:string; company:string; email?:string; status?:string; date_sent?:string; follow_up_due?:string; follow_up_count?:number; opt_out?:boolean; variant?:string; reply_type?:string; thread_id?:string;}
const normal = (s = '') => s.trim().toLowerCase();
export function hkDate(date: Date): string { return new Intl.DateTimeFormat('en-CA',{timeZone:schedule.timezone,year:'numeric',month:'2-digit',day:'2-digit'}).format(date); }
export function hkWeek(date: Date): string {
  const d = new Date(hkDate(date)+'T00:00:00Z');
  d.setUTCDate(d.getUTCDate()+4-(d.getUTCDay()||7));
  const year=d.getUTCFullYear();
  const week=Math.ceil(((d.getTime()-Date.UTC(year,0,1))/86400000+1)/7);
  return `${year}-week-${String(week).padStart(2,'0')}`;
}
function day(value?:string): number {
  if(!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return NaN;
  const parsed=new Date(value+'T00:00:00Z');
  return Number.isFinite(+parsed)&&parsed.toISOString().slice(0,10)===value?+parsed:NaN;
}
export function companyExcluded(company:string,rows:Contact[]):boolean {
  const key=normal(company).replace(/[^a-z0-9]+/g,' ').trim();
  return rows.some(row=>{const excluded=normal(row.company).replace(/[^a-z0-9]+/g,' ').trim();return row.status==='excluded'&&!!excluded&&(key===excluded||key.startsWith(excluded+' '));});
}
export function canContact(item: Contact, rows: Contact[], now: Date): string[] {
  if(companyExcluded(item.company,rows))return ['Company excluded by Adam. Do not prepare outreach.'];
  const same=rows.filter(r=>normal(r.company)===normal(item.company));
  const person=rows.filter(r=>!!item.email&&normal(r.email)===normal(item.email));
  if([...same,...person].some(r=>r.opt_out)) return ['Permanent opt-out: do not contact.'];
  if(person.some(r=>r.status==='rejected'||r.status==='bounced')) return ['Recipient is closed or bounced.'];
  const today=day(hkDate(now));
  if(item.kind==='follow_up') {
    const sent=person.filter(r=>r.status!=='drafted').at(-1);
    if(!sent || sent.status!=='sent') return ['No unanswered sent thread to follow up.'];
    if(!Number.isInteger(sent.follow_up_count)||sent.follow_up_count!<0) return ['Follow-up count unknown; reconcile history first.'];
    if(sent.follow_up_count!>=2) return ['Maximum two follow-ups reached.'];
    const due=day(sent.follow_up_due);
    if(!Number.isFinite(due)||due>today) return ['Follow-up is not due or date is invalid.'];
    return [];
  }
  if(item.kind==='reply') return person.some(r=>r.status==='replied'||r.status==='call_booked')?[]:['No tracked human reply.'];
  for(const r of same.filter(r=>r.status!=='drafted'&&r.status!=='applied')) {
    const sent=day(r.date_sent);
    if(!Number.isFinite(sent)) return ['Invalid send date; reconcile company history first.'];
    if(today-sent<30*86400000) return ['Company already contacted within 30 days.'];
  }
  return [];
}
export function metrics(rows: Contact[]) {
  const contacts=new Map<string,Contact>();
  for(const r of rows) if(r.status!=='drafted'&&r.status!=='applied'&&Number.isFinite(day(r.date_sent))) {
    contacts.set(r.thread_id||`${normal(r.company)}|${normal(r.email)}`,r);
  }
  const out={sent:0,replies:0,bounces:0,calls:0,live:0,replyRate:null as number|null,variants:{} as Record<string,{sent:number,replies:number,positive:number,calls:number,bounces:number}>};
  for(const r of contacts.values()) {
    out.sent++;
    const human=!!r.reply_type&&!['auto_reply','bounce'].includes(r.reply_type);
    const call=r.status==='call_booked';
    const bounce=r.status==='bounced'||r.reply_type==='bounce';
    const live=call||(r.status==='replied'&&['positive','referral','other'].includes(r.reply_type||''));
    out.replies+=+human; out.calls+=+call; out.bounces+=+bounce; out.live+=+live;
    const v=out.variants[r.variant||'untagged']??={sent:0,replies:0,positive:0,calls:0,bounces:0};
    v.sent++;v.replies+=+human;v.positive+=+(r.reply_type==='positive');v.calls+=+call;v.bounces+=+bounce;
  }
  out.replyRate=out.sent?out.replies/out.sent:null;
  return out;
}
