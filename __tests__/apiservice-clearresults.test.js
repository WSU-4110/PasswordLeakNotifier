// Test for ApiService Class - clearResults method

const fs = require('fs');
const path = require('path');

const apiServiceCode = fs.readFileSync(path.join(__dirname, '../static/js/api-service.js'), 'utf8');
const uiManagerCode = fs.readFileSync(path.join(__dirname, '../static/js/ui-manager.js'), 'utf8');

eval(uiManagerCode);
eval(apiServiceCode);

describe('ApiService Class - clearResults method', () => {
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
  });

  test('clear all state properties', () => {
    // Act
    apiService.clearResults();
    
    // Assert (Self-Validating)
    expect(mockAppState.setState).toHaveBeenCalledWith({
      results: null,
      error: null,
      isLoading: false
    });
  });
});
