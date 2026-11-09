/// <reference types="node" />
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

describe('Offline cache privacy', () => {
  function handler() {
    const handlers: Record<string, (event: any) => void> = {};
    runInNewContext(readFileSync('public/sw.js', 'utf8'), {
      URL, Response,
      self: { location: { origin: 'https://demo.example' }, addEventListener: (name: string, fn: (event: any) => void) => handlers[name] = fn },
    });
    return handlers.fetch;
  }
  it.each([
    ['https://demo.example/api/v1/care/cases', {}],
    ['https://demo.example/photo.jpg', { Authorization: 'Bearer private-session' }],
    ['https://another.example/photo.jpg', {}],
  ])('never intercepts sensitive or external request %s', (url, headers) => {
    let intercepted = false;
    handler()({ request: { url, method: 'GET', mode: 'cors', headers: new Headers(headers) }, respondWith: () => { intercepted = true; } });
    expect(intercepted).toBe(false);
  });
});
