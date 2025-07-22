const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const init = require('../init_db');

const testDbFile = path.join(__dirname, 'test-database.db');

describe('Database Initialization', () => {

    beforeEach(() => {
        if (fs.existsSync(testDbFile)) {
            fs.unlinkSync(testDbFile);
        }
    });

  beforeAll(() => {
    // Ensure clean slate
    if (fs.existsSync(testDbFile)) {
      fs.unlinkSync(testDbFile);
    }
  });

  afterAll(() => {
    // Cleanup test database
    if (fs.existsSync(testDbFile)) {
      fs.unlinkSync(testDbFile);
    }
  });

  it('should create users and search_results tables', () => {
    init(testDbFile);

    const db = new Database(testDbFile);
    db.exec('PRAGMA foreign_keys = ON;');

    const tables = db.prepare(`
      SELECT name FROM sqlite_master
      WHERE type='table' AND name IN ('users', 'search_results');
    `).all();

    const tableNames = tables.map(t => t.name);
    expect(tableNames).toContain('users');
    expect(tableNames).toContain('search_results');

    db.close();
  });

  it('should enforce email UNIQUE constraint', () => {
    init(testDbFile);
    const db = new Database(testDbFile);
    db.exec('PRAGMA foreign_keys = ON;');

    const insert = db.prepare(`INSERT INTO users (email) VALUES (?)`);
    insert.run('test@example.com');

    expect(() => insert.run('test@example.com')).toThrow(); // Should throw due to UNIQUE constraint

    db.close();
  });

  it('should allow inserting search_results with valid foreign key', () => {
    init(testDbFile);
    const db = new Database(testDbFile);
    db.exec('PRAGMA foreign_keys = ON;');

    db.prepare(`INSERT INTO users (email) VALUES (?)`).run('test@example.com');

    const insert = db.prepare(`
      INSERT INTO search_results (user_email, breach_name, breach_date, breach)
      VALUES (?, ?, ?, ?)
    `);

    const result = insert.run('test@example.com', 'TestBreach', '2024-01-01', 'Password leaked');

    expect(result.changes).toBe(1);

    db.close();
  });
});