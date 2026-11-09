import { openDB } from 'idb';
import { careApi } from './careApi';
const db = () => openDB('aarogya_encrypted_care', 1, { upgrade(db) { db.createObjectStore('drafts', { keyPath: 'id' }); } });
async function key(passphrase: string, salt: Uint8Array<ArrayBuffer>) {
  if (passphrase.length < 12) throw new Error('Use an offline passphrase of at least 12 characters.');
  const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(passphrase), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: 210000, hash: 'SHA-256' }, material, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}
export async function saveOffline(owner: string, payload: unknown, passphrase: string) {
  const id = crypto.randomUUID(), salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv, additionalData: new TextEncoder().encode(owner) }, await key(passphrase, salt), new TextEncoder().encode(JSON.stringify(payload)));
  await (await db()).put('drafts', { id, owner, salt, iv, ciphertext, createdAt: Date.now() }); return id;
}
export async function syncOffline(owner: string, passphrase: string) {
  const database = await db(); const drafts = await database.getAll('drafts'); let count = 0;
  for (const draft of drafts.filter(d => d.owner === owner).sort((a,b) => (a.createdAt || 0) - (b.createdAt || 0))) {
    const clear = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: draft.iv, additionalData: new TextEncoder().encode(owner) }, await key(passphrase, draft.salt), draft.ciphertext);
    const payload = JSON.parse(new TextDecoder().decode(clear));
    if (payload.operation === 'ACTION') await careApi(`/cases/${payload.caseId}/actions`, { ...payload.body, commandId: draft.id });
    else await careApi('/cases', payload, draft.id);
    await database.delete('drafts', draft.id); count++;
  }
  return count;
}
