import {test} from 'node:test';import assert from 'node:assert/strict';
import {extractJson,assertGrounded,requestResearch} from '../src/trigger/hk-job-hunt/research.js';
test('parse JSON with a fence',()=>assert.deepEqual(extractJson('```json\n{"ok":true}\n```'),{ok:true}));
test('reject prose instead of guessing JSON',()=>assert.throws(()=>extractJson('Here is a claim.')));
test('reject plausible but unretrieved sources',()=>assert.throws(()=>assertGrounded([{url:'https://company.example/claim'}],['https://company.example/']),/Unretrieved/));
test('reject insecure URLs even if returned',()=>assert.throws(()=>assertGrounded([{url:'http://company.example/'}],['http://company.example/']),/unsafe/));
test('permit an actually retrieved HTTPS source',()=>assertGrounded([{url:'https://company.example/'}],['https://company.example/']));
test('review retains fetched page evidence and rejects tool errors inside successful HTTP responses',async()=>{
 const old=process.env.ANTHROPIC_API_KEY;process.env.ANTHROPIC_API_KEY='test-fixture-not-a-key';
 try{
  const response=(content:any)=>new Response(JSON.stringify({stop_reason:'end_turn',content:[...content,{type:'text',text:'{"verdict":"hold"}'}]}),{status:200});
  const result=await requestResearch('Test','Test',async()=>response([{type:'web_fetch_tool_result',content:{type:'web_fetch_result',url:'https://example.com/fees',retrieved_at:'2026-09-11T01:00:00Z',content:{type:'document',source:{type:'text',data:'Actual fetched pricing content.'}}}}]),true);
  assert.deepEqual(result.documents,[{url:'https://example.com/fees',retrievedAt:'2026-09-11T01:00:00Z',text:'Actual fetched pricing content.'}]);
  await assert.rejects(requestResearch('Test','Test',async()=>response([{type:'web_fetch_tool_result',content:{type:'web_fetch_tool_result_error',error_code:'url_not_accessible'}}]),true),/failed/);
 }finally{if(old===undefined)delete process.env.ANTHROPIC_API_KEY;else process.env.ANTHROPIC_API_KEY=old;}
});
