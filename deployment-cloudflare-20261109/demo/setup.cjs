const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),cp=require('node:child_process');
const root=path.resolve(__dirname,'../..'),state=path.join(root,'.local','isolated-demo-20261109');
const {Pool}=require(root+'/backend/node_modules/pg');
(async()=>{
 fs.mkdirSync(state); // Refuse to reuse or overwrite any previous setup.
 const identity=process.env.USERDOMAIN+'\\'+process.env.USERNAME;
 const acl=cp.spawnSync('icacls.exe',[state,'/inheritance:r','/grant:r',identity+':(OI)(CI)F','SYSTEM:(OI)(CI)F'],{encoding:'utf8'});
 if(acl.status!==0) throw new Error('Unable to protect new demo secrets directory');
 const original=require(root+'/backend/node_modules/dotenv').parse(fs.readFileSync(path.join(root,'backend/.env')));
 const originalUrl=new URL(original.DATABASE_URL); const adminUrl=new URL(originalUrl);adminUrl.search='';
 const admin=new Pool({connectionString:adminUrl.href});
 const name='aarogya_demo_'+crypto.randomBytes(6).toString('hex'), role=name+'_owner',password=crypto.randomBytes(36).toString('hex');
 const demoUrl=new URL(adminUrl);demoUrl.username=role;demoUrl.password=password;demoUrl.pathname='/'+name;
 const env={NODE_ENV:'development',PORT:'4201',API_PREFIX:'api/v1',CORS_ORIGIN:'http://127.0.0.1:3202',DATABASE_URL:demoUrl.href,JWT_SECRET:crypto.randomBytes(48).toString('hex'),JWT_REFRESH_SECRET:crypto.randomBytes(48).toString('hex'),JWT_EXPIRES_IN:'2h',JWT_REFRESH_EXPIRES_IN:'8h',ALLOW_DEMO_AUTH_FALLBACK:'false',CARE_DATA_DIR:path.join(state,'care-data'),CARE_SCHEMA:'public',REDIS_HOST:'127.0.0.1',REDIS_PORT:'1',REDIS_PASSWORD:crypto.randomBytes(24).toString('hex'),S3_ENDPOINT:'http://127.0.0.1:1',S3_BUCKET:name,S3_ACCESS_KEY:crypto.randomBytes(24).toString('hex'),S3_SECRET_KEY:crypto.randomBytes(36).toString('hex'),S3_FORCE_PATH_STYLE:'true',OPENCV_SERVICE_URL:'http://127.0.0.1:1',AI_RESEARCH_SERVICE_URL:'http://127.0.0.1:1'};
 fs.writeFileSync(path.join(state,'runtime.json'),JSON.stringify(env),{flag:'wx',mode:0o600});
 fs.writeFileSync(path.join(state,'metadata.json'),JSON.stringify({database:name,role,port:4201,originalDatabase:originalUrl.pathname.slice(1)}),{flag:'wx'});
 try {
 await admin.query('CREATE ROLE '+role+" LOGIN PASSWORD '"+password+"' NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOREPLICATION NOBYPASSRLS");
 await admin.query('CREATE DATABASE '+name+' OWNER '+role);
 const scoped=new Pool({connectionString:demoUrl.href});
 try{await scoped.query('REVOKE ALL ON DATABASE '+name+' FROM PUBLIC');await scoped.query('REVOKE CREATE ON SCHEMA public FROM PUBLIC');}finally{await scoped.end();}
 }finally{await admin.end();}
 const probeUrl=new URL(demoUrl);probeUrl.pathname=originalUrl.pathname;
 const probe=new Pool({connectionString:probeUrl.href});let rejected=false;
 try{await probe.query('SELECT id FROM public.user_accounts LIMIT 0');}catch(error){if(error.code==='42501') rejected=true;else throw error;}finally{await probe.end();}
 if(!rejected) throw new Error('Demo role unexpectedly has access to existing tables');
 fs.copyFileSync(path.join(root,'backend/prisma/schema.prisma'),path.join(state,'schema.prisma'),fs.constants.COPYFILE_EXCL);
 const systemEnv=Object.fromEntries(['SystemRoot','WINDIR','PATH','TEMP','TMP','APPDATA','LOCALAPPDATA','USERPROFILE'].filter(key=>process.env[key]).map(key=>[key,process.env[key]]));
 const pushed=cp.spawnSync(process.execPath,[path.join(root,'backend/node_modules/prisma/build/index.js'),'db','push','--schema',path.join(state,'schema.prisma'),'--skip-generate'],{cwd:state,env:{...systemEnv,...env},encoding:'utf8'});
 if(pushed.status!==0) throw new Error('Fresh demo schema creation failed; no existing database modified');
 Object.assign(process.env,env);process.chdir(state);
 const accounts=await require('./seed.cjs')();
 console.log(JSON.stringify({database:name,role,port:4201,syntheticAccounts:accounts,existingTableAccessRejected:rejected,secretDirectory:state}));
})().catch(error=>{console.error('Demo setup failed:',error.code||error.message.replace(/postgres(?:ql)?:\/\/\S+/g,'[redacted]'));process.exitCode=1;});
