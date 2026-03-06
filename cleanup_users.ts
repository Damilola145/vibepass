import Database from 'better-sqlite3';
const db = new Database('vibepass.db');

const adminEmail = 'damilolaolonitola807@gmail.com';

console.log(`Deleting all users except ${adminEmail}...`);

const result = db.prepare('DELETE FROM users WHERE email != ?').run(adminEmail);

console.log(`Deleted ${result.changes} users.`);

const remaining = db.prepare('SELECT email, is_verified FROM users').all();
console.log('Remaining users:', remaining);
