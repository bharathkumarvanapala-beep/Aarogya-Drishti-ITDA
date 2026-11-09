import http from 'node:http';
import { createReadStream } from 'node:fs';
import { realpath, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const mime = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.mjs':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.json':'application/json', '.webmanifest':'application/manifest+json', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.svg':'image/svg+xml', '.ico':'image/x-icon', '.webp':'image/webp', '.woff':'font/woff', '.woff2':'font/woff2', '.pdf':'application/pdf', '.txt':'text/plain; charset=utf-8', '.mp4':'video/mp4', '.wasm':'application/wasm' };
const hop = ['connection','keep-alive','proxy-authenticate','proxy-authorization','te','trailer','transfer-encoding','upgrade'];
function headersForProxy(headers) {
  const result = { ...headers };
  for (const key of [...hop, ...(headers.connection || '').split(',').map(x=>x.trim().toLowerCase())]) delete result[key];
  return result;
}
function inside(root, target) {
  const relative = path.relative(root, target);
  return relative === '' || (!relative.startsWith('..' + path.sep) && relative !== '..' && !path.isAbsolute(relative));
}
function reply(res, status, message) {
  res.writeHead(status, { 'Content-Type':'text/plain; charset=utf-8', 'Cache-Control':'no-store' });
  res.end(message);
}

export async function createOrigin({ dist = path.resolve(here, '../dist'), backendPort = 4100 } = {}) {
  if (!Number.isInteger(backendPort) || backendPort < 1 || backendPort > 65535) throw new Error('Invalid backend port');
  const root = await realpath(dist);
  await stat(path.join(root, 'index.html'));
  return http.createServer(async (req, res) => {
    const rawPath = (req.url || '/').split('?')[0];
    if (rawPath === '/api' || rawPath.startsWith('/api/')) {
      const headers = headersForProxy(req.headers);
      // Forwarded identity must not be supplied by an arbitrary client.
      for (const key of Object.keys(headers)) if (key === 'forwarded' || key.startsWith('x-forwarded-')) delete headers[key];
      headers.host = '127.0.0.1:' + backendPort;
      const upstream = http.request({ hostname:'127.0.0.1', port:backendPort, method:req.method, path:req.url, headers }, response => {
        res.writeHead(response.statusCode || 502, headersForProxy(response.headers));
        response.on('error', () => res.destroy());
        response.pipe(res);
      });
      upstream.setTimeout(60000, () => upstream.destroy(new Error('Upstream timeout')));
      upstream.on('error', () => { if (!res.headersSent) reply(res, 502, 'Backend unavailable'); else res.destroy(); });
      req.on('aborted', () => upstream.destroy());
      res.on('close', () => { if (!res.writableEnded) upstream.destroy(); });
      req.pipe(upstream);
      return;
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') { res.setHeader('Allow', 'GET, HEAD'); reply(res, 405, 'Method not allowed'); return; }
    try {
      let decoded;
      try { decoded = decodeURIComponent(rawPath); } catch { reply(res, 400, 'Invalid path'); return; }
      if (!decoded.startsWith('/') || /[\\\x00]/.test(decoded) || decoded.split('/').some(segment => segment.startsWith('.'))) { reply(res, 403, 'Forbidden'); return; }
      let target = path.resolve(root, '.' + decoded);
      if (!inside(root, target)) { reply(res, 403, 'Forbidden'); return; }
      let info;
      try { info = await stat(target); } catch (error) { if (error.code !== 'ENOENT' && error.code !== 'ENOTDIR') throw error; }
      if (!info?.isFile()) {
        const acceptsHtml = (req.headers.accept || '').split(',').some(value => /^text\/html(?:;|$)/i.test(value.trim()) && !/;\s*q=0(?:\.0*)?(?:;|$)/i.test(value));
        if (!acceptsHtml || path.extname(decoded)) { reply(res, 404, 'Not found'); return; }
        target = path.join(root, 'index.html');
        info = await stat(target);
      }
      const actual = await realpath(target);
      if (!inside(root, actual)) { reply(res, 403, 'Forbidden'); return; }
      const contentType = mime[path.extname(actual).toLowerCase()] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type':contentType, 'Content-Length':info.size, 'Cache-Control':'no-cache', 'X-Content-Type-Options':'nosniff' });
      if (req.method === 'HEAD') { res.end(); return; }
      const stream = createReadStream(actual);
      stream.on('error', () => res.destroy());
      res.on('close', () => stream.destroy());
      stream.pipe(res);
    } catch { if (!res.headersSent) reply(res, 500, 'Unable to serve application'); else res.destroy(); }
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const server = await createOrigin();
  server.on('error', error => { console.error('Origin failed:', error.message); process.exitCode = 1; });
  server.listen(3201, '127.0.0.1', () => console.log('Application origin: http://127.0.0.1:3201 (API: 127.0.0.1:4100)'));
}
