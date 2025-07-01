const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const Database = require('better-sqlite3');

const initDB = require('./init_db');

const DB_PATH = 'database.db';
if (!fs.existsSync(DB_PATH)) initDB();

const db = new Database(DB_PATH);
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Create user
app.post('/users', (req, res) => {
  const { email } = req.body;
  try {
    const stmt = db.prepare('INSERT INTO users (email) VALUES (?)');
    const info = stmt.run(email);
    res.status(201).json({ id: info.lastInsertRowid, email });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add search result
app.post('/search', (req, res) => {
  const { user_id, query, result } = req.body;
  try {
    const stmt = db.prepare(`
      INSERT INTO search_results (user_id, query, result)
      VALUES (?, ?, ?)
    `);
    const info = stmt.run(user_id, query, result);
    res.status(201).json({ id: info.lastInsertRowid, user_id, query, result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get search results by user email
app.get('/search/:userEmail', (req, res) => {
  const { userEmail } = req.params;

  try {
    const stmt = db.prepare(`SELECT * FROM users WHERE email = ?`);
    const user = stmt.get(userEmail);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('SQLite API is running.');
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
