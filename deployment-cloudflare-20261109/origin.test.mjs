import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createOrigin } from './origin.mjs';

function listen(server) { return new Promise((resolve,reject) => { server.once('error',reject); server.listen(0,'127.0.0.1',()=>resolve(server.address().port)); }); }
function close(server) { return new Promise(resolve=>server.close(resolve)); }
function request(port, url, {method='GET', headers={}, body}={}) { return new Promise((resolve,reject)=> { const req=http.request({hostname:'127.0.0.1',port,path:url,method,headers},res=>{let data='';res.on('data',chunk=>data+=chunk);res.on('end',()=>resolve({status:res.statusCode,headers:res.headers,body:data}));});req.on('error',reject);req.end(body); }); }

test('origin serves SPA safely and preserves API requests and responses', async t => {
  const tempRoot = path.resolve(os.tmpdir());
  const fixture = await mkdtemp(path.join(tempRoot,'aarogya-origin-test-'));
  assert.equal(path.dirname(fixture),tempRoot);
  await writeFile(path.join(fixture,'index.html'),'<html>app fixture</html>');
  await writeFile(path.join(fixture,'app.js'),'console.log("fixture");');
  await writeFile(path.join(fixture,'.env'),'must-not-be-served');
  const backend=http.createServer((req,res)=>{let body='';req.on('data',chunk=>body+=chunk);req.on('end',()=>{res.writeHead(201,{'Content-Type':'application/json','Set-Cookie':['one=1; HttpOnly','two=2; Secure'],'X-Test':'passed'});res.end(JSON.stringify({method:req.method,url:req.url,authorization:req.headers.authorization,idempotency:req.headers['x-idempotency-key'],forwarded:req.headers['x-forwarded-for'],body}));});});
  const backendPort=await listen(backend);
  const origin=await createOrigin({dist:fixture,backendPort});
  const port=await listen(origin);
  t.after(async()=>{await close(origin); if(backend.listening) await close(backend); const resolved=path.resolve(fixture); assert.equal(path.dirname(resolved),tempRoot); assert.ok(path.basename(resolved).startsWith('aarogya-origin-test-')); await rm(resolved,{recursive:true});});
  const page=await request(port,'/care/doctor',{headers:{Accept:'text/html'}});
  assert.equal(page.status,200); assert.match(page.body,/app fixture/);
  const asset=await request(port,'/app.js'); assert.equal(asset.status,200); assert.match(asset.headers['content-type'],/javascript/);
  const head=await request(port,'/app.js',{method:'HEAD'}); assert.equal(head.status,200); assert.equal(head.body,''); assert.ok(Number(head.headers['content-length'])>0);
  for(const url of ['/missing.js','/missing','/.env','/%2e%2e/package.json','/%5c..%5cpackage.json','/%00']) { const result=await request(port,url); assert.ok([403,404].includes(result.status),url); assert.doesNotMatch(result.body,/must-not-be-served|app fixture/); }
  assert.equal((await request(port,'/missing.js',{headers:{Accept:'text/html'}})).status,404);
  assert.equal((await request(port,'/care',{headers:{Accept:'text/html;q=0'}})).status,404);
  assert.equal((await request(port,'/%ZZ')).status,400);
  assert.equal((await request(port,'/',{method:'POST',body:'abc'})).status,405);
  const api=await request(port,'/api/v1/test?name=a%20b',{method:'POST',headers:{Authorization:'Bearer fixture-token','Content-Type':'application/json','X-Idempotency-Key':'fixture-key','X-Forwarded-For':'attacker'},body:'{"value":123}'});
  assert.equal(api.status,201); assert.deepEqual(api.headers['set-cookie'],['one=1; HttpOnly','two=2; Secure']); assert.equal(api.headers['x-test'],'passed');
  assert.deepEqual(JSON.parse(api.body),{method:'POST',url:'/api/v1/test?name=a%20b',authorization:'Bearer fixture-token',idempotency:'fixture-key',body:'{"value":123}'});
  await close(backend);
  assert.equal((await request(port,'/api/v1/health')).status,502);
});
