const crypto = require('node:crypto');

function validateConfig(env) {
  if (env.DEMO_ONLY !== 'true') throw new Error('DEMO_ONLY must explicitly be true');
  let database;
  try { database = new URL(env.DATABASE_URL); } catch { throw new Error('A dedicated Neon DATABASE_URL is required'); }
  if (!['postgres:', 'postgresql:'].includes(database.protocol) || !database.hostname.endsWith('.neon.tech') || !database.username || !database.password) throw new Error('DATABASE_URL must use an authenticated Neon PostgreSQL endpoint');
  if (!/^\/aarogya_demo_[a-z0-9_]+$/.test(database.pathname)) throw new Error('Use a fresh dedicated database named aarogya_demo_<name>');
  if (!['require', 'verify-full'].includes(database.searchParams.get('sslmode'))) throw new Error('Neon connection must require SSL');
  if (database.searchParams.has('schema') && database.searchParams.get('schema') !== 'public') throw new Error('Only public schema is supported');
  // Care store removes a trailing ?schema query. Keep TLS options intact instead.
  database.searchParams.delete('schema');
  const encoded = env.CARE_KEY_BASE64 || '';
  const key = Buffer.from(encoded, 'base64');
  if (key.length !== 32 || key.toString('base64') !== encoded) throw new Error('CARE_KEY_BASE64 must be canonical base64 for exactly 32 random bytes');
  for (const name of ['JWT_SECRET', 'JWT_REFRESH_SECRET']) if (!/^[a-f0-9]{64,128}$/i.test(env[name] || '')) throw new Error(name + ' must contain 32–64 random bytes encoded as hex');
  if (env.JWT_SECRET === env.JWT_REFRESH_SECRET) throw new Error('JWT secrets must be different');
  const port = Number(env.PORT || 10000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be valid');
  let origin;
  try { origin = new URL(env.CORS_ORIGIN); } catch { throw new Error('CORS_ORIGIN must be the public frontend HTTPS origin'); }
  if (origin.protocol !== 'https:' || origin.origin !== env.CORS_ORIGIN) throw new Error('CORS_ORIGIN must be an HTTPS origin without a trailing slash or path');
  return { key, fingerprint: crypto.createHash('sha256').update(key).digest('hex'), databaseUrl: database.href, port, origin: origin.origin };
}

function configureRuntime(env, config, careDir) {
  Object.assign(env, {
    DATABASE_URL: config.databaseUrl, PORT: String(config.port), NODE_ENV: 'development',
    API_PREFIX: 'api/v1', CORS_ORIGIN: config.origin, ALLOW_DEMO_AUTH_FALLBACK: 'false',
    CARE_DATA_DIR: careDir, CARE_SCHEMA: 'public',
    REDIS_HOST: '127.0.0.1', REDIS_PORT: '1', REDIS_PASSWORD: crypto.randomBytes(24).toString('hex'),
    S3_ENDPOINT: 'http://127.0.0.1:1', S3_BUCKET: 'isolated-synthetic-demo',
    S3_ACCESS_KEY: crypto.randomBytes(24).toString('hex'), S3_SECRET_KEY: crypto.randomBytes(32).toString('hex'),
    S3_FORCE_PATH_STYLE: 'true', OPENCV_SERVICE_URL: 'http://127.0.0.1:1', AI_RESEARCH_SERVICE_URL: 'http://127.0.0.1:1',
  });
}
module.exports = { validateConfig, configureRuntime };
