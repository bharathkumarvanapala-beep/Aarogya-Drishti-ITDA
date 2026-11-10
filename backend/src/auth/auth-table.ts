import { Prisma } from '@prisma/client';

// Poolers can reuse a connection's search_path. Always name the configured schema.
export function authTable(table: 'user_accounts' | 'auth_attempts') {
  const schema = new URL(process.env.DATABASE_URL!).searchParams.get('schema') || 'public';
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(schema)) throw new Error('Invalid database schema');
  return Prisma.raw(`"${schema}"."${table}"`);
}
