import {test} from 'node:test';import assert from 'node:assert/strict';
import {extractJson,assertGrounded} from '../src/trigger/hk-job-hunt/research.js';
test('parse JSON with a fence',()=>assert.deepEqual(extractJson('```json\n{"ok":true}\n```'),{ok:true}));
test('reject prose instead of guessing JSON',()=>assert.throws(()=>extractJson('Here is a claim.')));
test('reject plausible but unretrieved sources',()=>assert.throws(()=>assertGrounded([{url:'https://company.example/claim'}],['https://company.example/']),/Unretrieved/));
test('reject insecure URLs even if returned',()=>assert.throws(()=>assertGrounded([{url:'http://company.example/'}],['http://company.example/']),/unsafe/));
test('permit an actually retrieved HTTPS source',()=>assertGrounded([{url:'https://company.example/'}],['https://company.example/']));
