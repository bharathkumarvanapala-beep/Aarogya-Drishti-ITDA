import { createHmac, timingSafeEqual, randomBytes, createCipheriv, createDecipheriv } from 'node:crypto';
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
export function newTotpSecret(): string {
  const bytes = randomBytes(20); let bits = '';
  for (const byte of bytes) bits += byte.toString(2).padStart(8, '0');
  return bits.match(/.{5}/g)!.map(b => alphabet[parseInt(b, 2)]).join('');
}
export function totp(secret: string, step: number): string {
  const bits = [...secret].map(c => { const n=alphabet.indexOf(c); if(n<0) throw new Error('Invalid MFA secret'); return n.toString(2).padStart(5,'0'); }).join('');
  const key = Buffer.from((bits.match(/.{8}/g)||[]).map(b=>parseInt(b,2)));
  const counter=Buffer.alloc(8);counter.writeBigUInt64BE(BigInt(step));
  const hash=createHmac('sha1',key).update(counter).digest();const offset=hash[19]&15;
  return ((hash.readUInt32BE(offset)&0x7fffffff)%1000000).toString().padStart(6,'0');
}
export function verifyTotp(secret: string, code: string, now=Date.now()): number | null {
  if(!/^\d{6}$/.test(code))return null;
  const step=Math.floor(now/30000);
  for(const candidate of [step,step-1,step+1])if(timingSafeEqual(Buffer.from(totp(secret,candidate)),Buffer.from(code)))return candidate;
  return null;
}
function key(): Buffer {const value=Buffer.from(process.env.CARE_KEY_BASE64||'','base64');if(value.length!==32)throw new Error('Stable encryption key required');return value;}
export function protectSecret(secret: string): string {const iv=randomBytes(12);const cipher=createCipheriv('aes-256-gcm',key(),iv);const body=Buffer.concat([cipher.update(secret,'utf8'),cipher.final()]);return Buffer.concat([iv,cipher.getAuthTag(),body]).toString('base64');}
export function revealSecret(value: string): string {const b=Buffer.from(value,'base64');const cipher=createDecipheriv('aes-256-gcm',key(),b.subarray(0,12));cipher.setAuthTag(b.subarray(12,28));return Buffer.concat([cipher.update(b.subarray(28)),cipher.final()]).toString('utf8');}
