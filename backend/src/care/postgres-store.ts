import { Pool, PoolClient } from 'pg';
import { AsyncLocalStorage } from 'node:async_hooks';

export class PostgresCareStore {
  private pool: Pool;
  private context = new AsyncLocalStorage<PoolClient>();
  private ready: Promise<unknown>;
  constructor() {
    const schema = process.env.CARE_SCHEMA || 'public';
    if (!/^[a-z][a-z0-9_]*$/.test(schema)) throw new Error('Invalid care schema');
    this.pool = new Pool({ connectionString: process.env.DATABASE_URL?.replace(/\?schema=.*$/, ''), max: 8, options: `-c search_path=${schema}` });
    this.ready = this.pool.query(`CREATE SCHEMA IF NOT EXISTS ${schema}`).then(() => this.pool.query(`CREATE TABLE IF NOT EXISTS care_cases (id text PRIMARY KEY, payload text NOT NULL);
      CREATE TABLE IF NOT EXISTS care_receipts (id text PRIMARY KEY, owner text NOT NULL, case_id text NOT NULL);
      CREATE TABLE IF NOT EXISTS care_access_log (id text PRIMARY KEY, case_id text, actor text, action text, at text);`));
  }
  async close() { await this.pool.end(); }
  private async query(sql: string, values: unknown[]) {
    await this.ready; let index = 0;
    const mapped = sql.replace(/\b(cases|receipts|access_log)\b/g, 'care_$1').replace(/\?/g, () => '$' + (++index));
    return (this.context.getStore() || this.pool).query(mapped, values);
  }
  prepare(sql: string) {
    return {
      all: async (...values: unknown[]) => (await this.query(sql, values)).rows,
      get: async (...values: unknown[]) => (await this.query(sql, values)).rows[0],
      run: async (...values: unknown[]) => this.query(sql, values),
    };
  }
  async transaction<T>(work: () => Promise<T>): Promise<T> {
    await this.ready; const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      // Serialize care mutations across workers, including duplicate and slot checks.
      await client.query('SELECT pg_advisory_xact_lock(842026)');
      const result = await this.context.run(client, work);
      await client.query('COMMIT'); return result;
    } catch (e) { await client.query('ROLLBACK'); throw e; }
    finally { client.release(); }
  }
}
