const Database = require('better-sqlite3');

function init() {
  const db = new Database('database.db');

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
  console.log('SQLite database initialized.');
}

module.exports = init;
