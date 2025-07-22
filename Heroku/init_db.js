// db/init.js
const Database = require('better-sqlite3');

function init(filename = 'database.db') {
  const db = new Database(filename);

  db.exec('PRAGMA foreign_keys = ON;');

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS search_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_email TEXT NOT NULL,
      breach_name TEXT NOT NULL,
      breach_date TEXT NOT NULL,
      breach TEXT NOT NULL,
      FOREIGN KEY (user_email) REFERENCES users(email)
    );
  `);

  db.close();
  console.log(`SQLite database initialized: ${filename}`);
}

module.exports = init;
