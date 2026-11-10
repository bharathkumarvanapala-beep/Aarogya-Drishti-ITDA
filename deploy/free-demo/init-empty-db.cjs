const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const cp = require('node:child_process');
const { validateConfig, configureRuntime } = require('./config.cjs');
const root = path.resolve(__dirname, '../..');

async function initialize() {
  if (process.env.INIT_EMPTY_DEMO_DATABASE !== 'yes') throw new Error('Explicit INIT_EMPTY_DEMO_DATABASE=yes is required');
  const config = validateConfig(process.env);
  const { Pool } = require(path.join(root, 'backend/node_modules/pg'));
  const pool = new Pool({ connectionString: config.databaseUrl, connectionTimeoutMillis: 20000 });
  const client = await pool.connect();
  try {
    await client.query('SELECT pg_advisory_lock(842027)');
    const objects = await client.query("SELECT c.oid FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname NOT IN ('pg_catalog','information_schema') AND n.nspname NOT LIKE 'pg_toast%' AND c.relkind IN ('r','p','v','m','S','f') LIMIT 1");
    if (objects.rows.length) throw new Error('Database is not empty; refusing initialization');
    const runtime = fs.mkdtempSync(path.join(os.tmpdir(), 'aarogya-demo-init-'));
    const schema = path.join(runtime, 'schema.prisma');
    fs.copyFileSync(path.join(root, 'backend/prisma/schema.prisma'), schema, fs.constants.COPYFILE_EXCL);
    configureRuntime(process.env, config, path.join(runtime, 'care'));
    process.chdir(runtime);
    const pushed = cp.spawnSync(process.execPath, [path.join(root, 'backend/node_modules/prisma/build/index.js'), 'db', 'push', '--schema', schema, '--skip-generate'], { cwd: runtime, env: process.env, stdio: 'pipe' });
    if (pushed.status !== 0) throw new Error('Empty demo schema creation failed; investigate before retrying');
    const accounts = await require(path.join(root, 'deployment-cloudflare-20261109/demo/seed.cjs'))();
    await client.query('CREATE TABLE public.aarogya_demo_deployment (id text PRIMARY KEY, key_fingerprint text NOT NULL, created_at timestamptz NOT NULL DEFAULT now())');
    await client.query('INSERT INTO public.aarogya_demo_deployment(id,key_fingerprint) VALUES ($1,$2)', ['synthetic-demo-v1', config.fingerprint]);
    console.log('Initialized dedicated empty demo database with ' + accounts + ' synthetic accounts. No existing records imported.');
  } finally { await client.query('SELECT pg_advisory_unlock(842027)').catch(() => {}); client.release(); await pool.end(); }
}
if (require.main === module) initialize().catch(error => { console.error('Initialization refused or failed:', error.message.includes('Database is not empty') ? 'Database is not empty; no schema push performed.' : 'Check explicit consent, required configuration, empty dedicated Neon database, and dependencies. Credentials are not logged.'); process.exitCode = 1; });
module.exports = { initialize };
