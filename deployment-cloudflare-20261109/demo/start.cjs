const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=path.resolve(__dirname,'../..'),state=path.join(root,'.local','isolated-demo-20261109');
const env=JSON.parse(fs.readFileSync(path.join(state,'runtime.json'),'utf8'));
for(const key of Object.keys(process.env)) if(!['SystemRoot','WINDIR','PATH','TEMP','TMP','APPDATA','LOCALAPPDATA','USERPROFILE'].some(x=>x.toLowerCase()===key.toLowerCase())) delete process.env[key];
Object.assign(process.env,env);process.chdir(state);
const listen=http.Server.prototype.listen;
http.Server.prototype.listen=function(...args){ if(args[0]===4201 && (typeof args[1]==='function'||args[1]===undefined)) args.splice(1,0,'127.0.0.1'); return listen.apply(this,args); };
require(path.join(root,'backend/dist/src/main.js'));
