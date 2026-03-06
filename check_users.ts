import Database from 'better-sqlite3';
const db = new Database('vibepass.db');

const users = db.prepare('SELECT id, email, name, is_admin, is_verified FROM users').all();
console.log('Current Users:', JSON.stringify(users, null, 2));
