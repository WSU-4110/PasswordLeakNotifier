const { spawn } = require('child_process');
const axios = require('axios');
const express = require('express');
const waitPort = require('wait-port');
const fs = require('fs');
const path = require('path');
const net = require('net');

jest.setTimeout(30000);

// Find a free TCP port (no ESM deps)
function getFreePort() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.listen(0, '127.0.0.1', () => {
      const { port } = srv.address();
      srv.close(() => resolve(port));
    });
    srv.on('error', reject);
  });
}

function resolvePython() {
  const venvPy = path.join(process.cwd(), '.venv', 'Scripts', 'python.exe');
  if (fs.existsSync(venvPy)) return { exe: venvPy, args: ['app.py'] };
  return { exe: 'py', args: ['-3', 'app.py'] };
}

async function startMockHIBP(scenario = 'empty') {
  const app = express();

  app.get('/api/v3/breachedaccount/:email', (_req, res) => {
    if (scenario === '404') return res.sendStatus(404);
    if (scenario === '503') return res.sendStatus(503);
    if (scenario === '200_known') {
      return res.status(200).json([
        { Name: 'Adobe', BreachDate: '2013-10-04', Domain: 'ADOBE.COM' }
      ]);
    }
    if (scenario === '200_unknown') {
      return res.status(200).json([
        { Name: 'UnknownSite', BreachDate: '2020-01-01', Domain: 'unknown.example' },
        { Name: 'NoDomain', BreachDate: '2020-01-02', Domain: null }
      ]);
    }
    return res.status(200).json([]);
  });

  const hibpPort = await getFreePort();
  const server = app.listen(hibpPort);
  await new Promise((r) => server.on('listening', r));
  return { url: `http://127.0.0.1:${hibpPort}`, close: () => new Promise((r) => server.close(r)) };
}

async function startFlask(hibpURL) {
  const flaskPort = await getFreePort();
  const { exe, args } = resolvePython();
  const env = {
    ...process.env,
    FLASK_PORT: String(flaskPort),
    HIBP_BASE_URL: hibpURL,
    HIBP_API_KEY: 'test-key'
  };
  const proc = spawn(exe, args, { env, stdio: 'inherit' });
  await waitPort({ host: '127.0.0.1', port: flaskPort, timeout: 15000 });
  return { base: `http://127.0.0.1:${flaskPort}`, stop: () => { try { proc.kill(); } catch (_) {} } };
}

// 1
test('returns 400 when email is missing', async () => {
  const mock = await startMockHIBP('empty');
  const flask = await startFlask(mock.url);
  try {
    await expect(axios.get(`${flask.base}/check-email`)).rejects.toMatchObject({ response: { status: 400 } });
  } finally { flask.stop(); await mock.close(); }
});

// 2
test('404 from HIBP -> 200 with zero breaches', async () => {
  const mock = await startMockHIBP('404');
  const flask = await startFlask(mock.url);
  try {
    const res = await axios.get(`${flask.base}/check-email`, { params: { email: 'a@b.com' } });
    expect(res.status).toBe(200);
    expect(res.data.breach_count).toBe(0);
    expect(res.data.breaches).toEqual([]);
  } finally { flask.stop(); await mock.close(); }
});

// 3
test('non-200 from HIBP -> 500 error', async () => {
  const mock = await startMockHIBP('503');
  const flask = await startFlask(mock.url);
  try {
    await expect(axios.get(`${flask.base}/check-email`, { params: { email: 'a@b.com' } }))
      .rejects.toMatchObject({ response: { status: 500 } });
  } finally { flask.stop(); await mock.close(); }
});

// 4
test('200 with known domain includes reset_link', async () => {
  const mock = await startMockHIBP('200_known');
  const flask = await startFlask(mock.url);
  try {
    const res = await axios.get(`${flask.base}/check-email`, { params: { email: 'a@b.com' } });
    expect(res.status).toBe(200);
    expect(res.data.breach_count).toBe(1);
    const entry = res.data.breaches[0];
    expect(entry.name).toBe('Adobe');
    expect(entry.reset_link).toMatch(/^https?:\/\//);
  } finally { flask.stop(); await mock.close(); }
});

// 5
test('200 with unknown/null domain sets the error message', async () => {
  const mock = await startMockHIBP('200_unknown');
  const flask = await startFlask(mock.url);
  try {
    const res = await axios.get(`${flask.base}/check-email`, { params: { email: 'a@b.com' } });
    expect(res.status).toBe(200);
    expect(res.data.breach_count).toBe(2);
    for (const e of res.data.breaches) {
      expect(e.error).toBe("Reset link can't be found for this site");
    }
  } finally { flask.stop(); await mock.close(); }
});

// 6
test('200 with empty list -> breach_count 0', async () => {
  const mock = await startMockHIBP('empty');
  const flask = await startFlask(mock.url);
  try {
    const res = await axios.get(`${flask.base}/check-email`, { params: { email: 'a@b.com' } });
    expect(res.status).toBe(200);
    expect(res.data.breach_count).toBe(0);
    expect(res.data.breaches).toEqual([]);
  } finally { flask.stop(); await mock.close(); }
});
