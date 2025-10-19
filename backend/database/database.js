const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const DBSOURCE = "database.db";

const db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) { console.error(err.message); throw err; }
  console.log('Conectado a SQLite');
  db.serialize(() => {
    db.run('PRAGMA foreign_keys = ON;');
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('user','admin')) DEFAULT 'user'
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      owner_id INTEGER NOT NULL,
      FOREIGN KEY(owner_id) REFERENCES users(id) ON DELETE CASCADE
    )`);
    // Seeding
    const saltRounds = 10;
    bcrypt.hash('admin_password_123', saltRounds, (err, hash) => {
      if(!err) db.run('INSERT OR IGNORE INTO users (id,username,password_hash,role) VALUES (1,?,?,?)', ['admin', hash, 'admin']);
    });
    bcrypt.hash('user_password_123', saltRounds, (err, hash) => {
      if(!err) db.run('INSERT OR IGNORE INTO users (id,username,password_hash,role) VALUES (2,?,?,?)', ['user', hash, 'user']);
    });
  });
});

module.exports = db;
