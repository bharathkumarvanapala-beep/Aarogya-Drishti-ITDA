const fs=require('node:fs'),path=require('node:path');
const {Pool}=require('../backend/node_modules/pg');
(async()=>{
 if(process.env.CONFIRM_AUTH_MIGRATION!=='yes'||!process.env.DATABASE_URL)throw Error('Set DATABASE_URL and CONFIRM_AUTH_MIGRATION=yes explicitly.');
 const pool=new Pool({connectionString:process.env.DATABASE_URL});const client=await pool.connect();
 try{await client.query('BEGIN');await client.query('SET LOCAL search_path TO public');await client.query('SELECT pg_advisory_xact_lock(842029)');const before=(await client.query('SELECT count(*)::int AS n FROM user_accounts')).rows[0].n;
 await client.query(fs.readFileSync(path.join(__dirname,'../backend/prisma/migrations/20261109_auth_hardening/migration.sql'),'utf8'));
 const after=(await client.query('SELECT count(*)::int AS n FROM user_accounts')).rows[0].n;if(before!==after)throw Error('Account count changed unexpectedly');await client.query('COMMIT');console.log('Additive authentication migration applied. Existing account count preserved:',after);
 }catch(e){await client.query('ROLLBACK');throw e;}finally{client.release();await pool.end();}
})().catch(e=>{console.error(e.message);process.exitCode=1});
