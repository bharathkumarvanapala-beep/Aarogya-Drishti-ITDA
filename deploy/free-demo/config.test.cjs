const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { validateConfig, configureRuntime } = require('./config.cjs');
function valid() { return { DEMO_ONLY: 'true', DATABASE_URL: 'postgresql://fixture:fixture@ep-fixture.us-east-2.aws.neon.tech/aarogya_demo_fixture?schema=public&sslmode=require', CARE_KEY_BASE64: crypto.randomBytes(32).toString('base64'), JWT_SECRET: crypto.randomBytes(32).toString('hex'), JWT_REFRESH_SECRET: crypto.randomBytes(32).toString('hex'), CORS_ORIGIN: 'https://example.workers.dev', PORT: '10000' }; }
test('accepts isolated Neon configuration and preserves TLS after schema removal', () => {
  const input = valid(); const result = validateConfig(input);
  assert.equal(result.key.length, 32); assert.equal(result.port, 10000);
  const url = new URL(result.databaseUrl); assert.equal(url.searchParams.get('sslmode'), 'require'); assert.equal(url.searchParams.has('schema'), false);
  assert.equal(validateConfig(input).fingerprint, result.fingerprint);
});
test('rejects local, misleading host, non-demo, insecure and malformed database URLs', () => {
  for (const DATABASE_URL of ['postgresql://u:p@127.0.0.1/aarogya_connected', 'postgresql://u:p@neon.tech.attacker.example/aarogya_demo_test?sslmode=require', 'postgresql://u:p@ep-x.neon.tech/existing?sslmode=require', 'postgresql://u:p@ep-x.neon.tech/aarogya_demo_test', 'not a URL']) assert.throws(() => validateConfig({ ...valid(), DATABASE_URL }));
});
test('requires explicit demo consent, canonical encryption key, independent strong JWT secrets, origin and port', () => {
  for (const patch of [{ DEMO_ONLY: 'false' }, { CARE_KEY_BASE64: '' }, { CARE_KEY_BASE64: crypto.randomBytes(31).toString('base64') }, { CARE_KEY_BASE64: crypto.randomBytes(32).toString('base64') + '\n' }, { JWT_SECRET: 'development-secret' }, { JWT_REFRESH_SECRET: 'short' }, { PORT: 'NaN' }, { PORT: '65536' }, { CORS_ORIGIN: 'https://example.com/path' }, { CORS_ORIGIN: 'http://example.com' }]) assert.throws(() => validateConfig({ ...valid(), ...patch }));
  const same = valid(); same.JWT_REFRESH_SECRET = same.JWT_SECRET; assert.throws(() => validateConfig(same));
});
test('runtime isolates key directory and disables original auxiliary connections', () => {
  const input = valid(), env = { S3_ENDPOINT: 'http://existing', CARE_DATA_DIR: '/original' };
  configureRuntime(env, validateConfig(input), '/ephemeral/new-care');
  assert.equal(env.CARE_DATA_DIR, '/ephemeral/new-care'); assert.equal(env.ALLOW_DEMO_AUTH_FALLBACK, 'false');
  assert.equal(env.S3_ENDPOINT, 'http://127.0.0.1:1'); assert.equal(env.OPENCV_SERVICE_URL, 'http://127.0.0.1:1'); assert.equal(env.AI_RESEARCH_SERVICE_URL, 'http://127.0.0.1:1'); assert.equal(env.REDIS_PORT, '1');
});
