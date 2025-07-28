// Test for ApiService Class - checkEmail method

const fs = require('fs');
const path = require('path');

const apiServiceCode = fs.readFileSync(path.join(__dirname, '../static/js/api-service.js'), 'utf8');
const uiManagerCode = fs.readFileSync(path.join(__dirname, '../static/js/ui-manager.js'), 'utf8');

eval(uiManagerCode);
eval(apiServiceCode);

describe('ApiService Class - checkEmail method', () => {
  let apiService;
  let mockAppState;

  beforeEach(() => {
    // Create mock object
    mockAppState = {
      setState: jest.fn(),
      resetState: jest.fn(),
      getState: jest.fn().mockReturnValue({
        isLoading: false,
        results: null,
        error: null,
        email: ''
      })
    };
    
    apiService = new ApiService(mockAppState, 'http://localhost:3000');
    
    // Reset and setup fetch mock with default success response
    fetch.mockClear();
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        breach_count: 0,
        breaches: [],
        email: 'test@example.com'
      })
    });
  });

  test('check valid email and update state', async () => {
    // Arrange
    const email = 'test@example.com';
    const mockResponse = {
      email: email,
      breach_count: 0,
      breaches: []
    };
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });
    
    // Act
    const result = await apiService.checkEmail(email);
    
    // Assert
    expect(fetch).toHaveBeenCalledWith(
      `http://localhost:3000/check-email?email=${encodeURIComponent(email)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    
    expect(mockAppState.setState).toHaveBeenCalledWith({
      isLoading: true,
      error: null,
      email: email
    });
    
    expect(mockAppState.setState).toHaveBeenCalledWith({
      isLoading: false,
      results: mockResponse,
      error: null
    });
    
    expect(result).toEqual(mockResponse);
  });

  test('handle email with extra whitespace', async () => {
    // Arrange
    const emailWithSpaces = '  test@example.com  ';
    const trimmedEmail = 'test@example.com';
    const mockResponse = { email: trimmedEmail, breach_count: 0, breaches: [] };
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });
    
    // Act
    await apiService.checkEmail(emailWithSpaces);
    
    // Assert
    expect(fetch).toHaveBeenCalledWith(
      `http://localhost:3000/check-email?email=${encodeURIComponent(trimmedEmail)}`,
      expect.any(Object)
    );
    
    expect(mockAppState.setState).toHaveBeenCalledWith({
      isLoading: true,
      error: null,
      email: trimmedEmail
    });
  });

  test('reject invalid email and update state with error', async () => {
    // Arrange
    const invalidEmail = 'invalid-email';   
    await expect(apiService.checkEmail(invalidEmail)).rejects.toThrow('Please enter a valid email address');
    
    expect(fetch).not.toHaveBeenCalled();
  });

  test('handle HTTP error responses', async () => {
    const email = 'test@example.com';
    
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404
    });
    
    await expect(apiService.checkEmail(email)).rejects.toThrow('HTTP error! status: 404');
    
    expect(mockAppState.setState).toHaveBeenCalledWith({
      isLoading: false,
      error: 'HTTP error! status: 404',
      results: null
    });
  });

  test('handle API error responses', async () => {
    const email = 'test@example.com';
    const errorResponse = { error: 'API rate limit exceeded' };
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => errorResponse
    });
    
    await expect(apiService.checkEmail(email)).rejects.toThrow('API rate limit exceeded');
    
    expect(mockAppState.setState).toHaveBeenCalledWith({
      isLoading: false,
      error: 'API rate limit exceeded',
      results: null
    });
  });

  test('handle network errors', async () => {
    const email = 'test@example.com';
    
    fetch.mockRejectedValueOnce(new Error('Network error'));
    
    await expect(apiService.checkEmail(email)).rejects.toThrow('Network error');
    
    expect(mockAppState.setState).toHaveBeenCalledWith({
      isLoading: false,
      error: 'Network error',
      results: null
    });
  });

  test('handle special characters in email', async () => {
    const email = 'test+special@example.com';
    const mockResponse = { email: email, breach_count: 1, breaches: [] };
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });
    
    // Act
    await apiService.checkEmail(email);
    
    // Assert
    expect(fetch).toHaveBeenCalledWith(
      `http://localhost:3000/check-email?email=${encodeURIComponent(email)}`,
      expect.any(Object)
    );
  });
});
