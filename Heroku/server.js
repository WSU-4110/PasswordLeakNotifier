const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const Database = require('better-sqlite3');
const initDB = require('./init_db');

function createServer(dbPath = 'database.db') {
  if (!fs.existsSync(dbPath)) {
    initDB(dbPath);
  }

  const db = new Database(dbPath);
  const app = express();

  app.use(cors());
  app.use(bodyParser.json());

  app.post('/users', (req, res) => {
    const { email } = req.body;
    try {
      const stmt = db.prepare('INSERT INTO users (email) VALUES (?)');
      const info = stmt.run(email);
      res.status(201).json({ id: info.lastInsertRowid, email });
    } catch (err) {
      if (err.message.includes('UNIQUE constraint')) {
        res.status(400).json({ error: err.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  });

  app.post('/search', (req, res) => {
    const { user_email, breach_name, breach_date, breach } = req.body;

    try {
      const stmt = db.prepare(`
        INSERT INTO search_results (user_email, breach_name, breach_date, breach)
        VALUES (?, ?, ?, ?)
      `);
      const info = stmt.run(user_email, breach_name, breach_date, breach);

      res.status(201).json({
        id: info.lastInsertRowid,
        user_email,
        breach_name,
        breach_date,
        breach,
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  app.get('/search/:userEmail', (req, res) => {
    const { userEmail } = req.params;

    try {
      const stmt = db.prepare(`SELECT * FROM search_results WHERE user_email = ?`);
      const rows = stmt.all(userEmail);
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/', (req, res) => {
    res.send('SQLite API is running.');
  });

  return { app, db };
}

if (require.main === module) {
  const { app } = createServer();
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
}

module.exports = createServer;
