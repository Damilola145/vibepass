import Database from 'better-sqlite3';
import { createClient } from '@libsql/client';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define Data Directory (Use env var or default to current directory)
const DATA_DIR = process.env.DATA_DIR || __dirname;

// Interface for DB Adapter
interface DBAdapter {
  exec(sql: string): Promise<void>;
  run(sql: string, ...args: any[]): Promise<{ lastInsertRowid?: number | bigint, changes: number }>;
  get(sql: string, ...args: any[]): Promise<any>;
  all(sql: string, ...args: any[]): Promise<any[]>;
}

// Local SQLite Adapter (Synchronous but wrapped in Promise)
class LocalDB implements DBAdapter {
  private db: Database.Database;

  constructor(dbPath: string) {
    this.db = new Database(dbPath);
    console.log(`Using Local SQLite database at: ${dbPath}`);
  }

  async exec(sql: string): Promise<void> {
    this.db.exec(sql);
  }

  async run(sql: string, ...args: any[]): Promise<{ lastInsertRowid?: number | bigint, changes: number }> {
    const stmt = this.db.prepare(sql);
    const result = stmt.run(...args);
    return { lastInsertRowid: result.lastInsertRowid, changes: result.changes };
  }

  async get(sql: string, ...args: any[]): Promise<any> {
    const stmt = this.db.prepare(sql);
    return stmt.get(...args);
  }

  async all(sql: string, ...args: any[]): Promise<any[]> {
    const stmt = this.db.prepare(sql);
    return stmt.all(...args);
  }
}

// Turso / LibSQL Adapter (Asynchronous)
class TursoDB implements DBAdapter {
  private client: any;

  constructor(url: string, authToken?: string) {
    this.client = createClient({
      url,
      authToken,
    });
    console.log(`Using Turso database at: ${url}`);
  }

  async exec(sql: string): Promise<void> {
    await this.client.execute(sql);
  }

  async run(sql: string, ...args: any[]): Promise<{ lastInsertRowid?: number | bigint, changes: number }> {
    const result = await this.client.execute({ sql, args });
    return { lastInsertRowid: result.lastInsertRowid, changes: result.rowsAffected };
  }

  async get(sql: string, ...args: any[]): Promise<any> {
    const result = await this.client.execute({ sql, args });
    return result.rows[0] || undefined;
  }

  async all(sql: string, ...args: any[]): Promise<any[]> {
    const result = await this.client.execute({ sql, args });
    return result.rows;
  }
}

// Factory Function
let dbInstance: DBAdapter;

export function getDB(): DBAdapter {
  if (dbInstance) return dbInstance;

  if (process.env.TURSO_DATABASE_URL) {
    dbInstance = new TursoDB(process.env.TURSO_DATABASE_URL, process.env.TURSO_AUTH_TOKEN);
  } else {
    const dbPath = path.join(DATA_DIR, 'vibepass.db');
    dbInstance = new LocalDB(dbPath);
  }
  
  return dbInstance;
}
