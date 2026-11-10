const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { validateConfig, configureRuntime } = require('./config.cjs');
const root = path.resolve(__dirname, '../..');

async function start() {
  const config = validateConfig(process.env);
  const { Pool } = require(path.join(root, 'backend/node_modules/pg'));
  const pool = new Pool({ connectionString: config.databaseUrl, connectionTimeoutMillis: 20000 });
  try {
    const result = await pool.query("SELECT key_fingerprint FROM public.aarogya_demo_deployment WHERE id = 'synthetic-demo-v1'");
    if (result.rows.length !== 1 || result.rows[0].key_fingerprint !== config.fingerprint) throw new Error('Demo database marker or stable encryption key does not match');
  } finally { await pool.end(); }
  const runtime = fs.mkdtempSync(path.join(os.tmpdir(), 'aarogya-free-demo-'));
  fs.chmodSync(runtime, 0o700);
  const careDir = path.join(runtime, 'care');
  fs.mkdirSync(careDir, { mode: 0o700 });
  fs.writeFileSync(path.join(careDir, 'care.key'), config.key, { flag: 'wx', mode: 0o600 });
  configureRuntime(process.env, config, careDir);
  // Empty working directory prevents loading the repository's original backend .env.
  process.chdir(runtime);
  require(path.join(root, 'backend/dist/src/main.js'));
}
if (require.main === module) start().catch(() => { console.error('Demo startup refused: verify dedicated database initialization, stable CARE_KEY_BASE64, and required environment settings. No existing database was initialized by startup.'); process.exitCode = 1; });
module.exports = { start };
