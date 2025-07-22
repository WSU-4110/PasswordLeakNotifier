const request = require('supertest');
const fs = require('fs');
const path = require('path');
const initDB = require('../init_db');
const createServer = require('../server');

const TEST_DB = path.join(__dirname, 'test-database.db');

let app;
let db;

beforeEach(() => {
  // Clean up old test DB
  if (fs.existsSync(TEST_DB)) {
    fs.unlinkSync(TEST_DB);
  }

  // Initialize DB schema
  initDB(TEST_DB);

  // Create fresh app + db instance for test DB
  const server = createServer(TEST_DB);
  app = server.app;
  db = server.db;
});

afterEach(() => {
  if (db) db.close();
  if (fs.existsSync(TEST_DB)) fs.unlinkSync(TEST_DB);
});

beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterAll(() => {
  console.log.mockRestore();
});

describe('Express API with real DB init', () => {
  it('should create a new user', async () => {
    const res = await request(app)
      .post('/users')
      .send({ email: 'test@example.com' });

    expect(res.status).toBe(201);
    expect(res.body.email).toBe('test@example.com');
    expect(res.body.id).toBeDefined();
  });

  it('should not allow duplicate users', async () => {
    await request(app).post('/users').send({ email: 'duplicate@example.com' });

    const res = await request(app).post('/users').send({ email: 'duplicate@example.com' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/UNIQUE constraint failed/);
  });

  it('should add a search result for an existing user', async () => {
    await request(app).post('/users').send({ email: 'breach@example.com' });

    const res = await request(app).post('/search').send({
      user_email: 'breach@example.com',
      breach_name: 'TestBreach',
      breach_date: '2024-01-01',
      breach: 'Test data leak',
    });

    expect(res.status).toBe(201);
    expect(res.body.breach_name).toBe('TestBreach');
  });

  it('should return all search results for a user', async () => {
    await request(app).post('/users').send({ email: 'history@example.com' });

    await request(app).post('/search').send({
      user_email: 'history@example.com',
      breach_name: 'Breach1',
      breach_date: '2024-01-01',
      breach: 'Data 1',
    });

    await request(app).post('/search').send({
      user_email: 'history@example.com',
      breach_name: 'Breach2',
      breach_date: '2025-01-01',
      breach: 'Data 2',
    });

    const res = await request(app).get('/search/history@example.com');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0]).toHaveProperty('breach_name');
  });

  it('should return empty array if user has no results', async () => {
    const res = await request(app).get('/search/empty@example.com');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});
