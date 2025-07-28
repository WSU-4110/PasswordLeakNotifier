// Jest setup file

// Mock console
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn()
};

global.fetch = jest.fn();
beforeEach(() => {
  jest.clearAllMocks();
  // Reset DOM
  document.body.innerHTML = '';
  // Reset fetch mock
  fetch.mockClear();
});

// Clean up after each test
afterEach(() => {
  jest.restoreAllMocks();
});
