// Test for ApiService Class - resetApp method

const fs = require('fs');
const path = require('path');

const apiServiceCode = fs.readFileSync(path.join(__dirname, '../static/js/api-service.js'), 'utf8');
const uiManagerCode = fs.readFileSync(path.join(__dirname, '../static/js/ui-manager.js'), 'utf8');

eval(uiManagerCode);
eval(apiServiceCode);

describe('ApiService Class - resetApp method', () => {
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

  test('call resetState on app state', () => {
    // Act
    apiService.resetApp();
    
    // Assert
    expect(mockAppState.resetState).toHaveBeenCalled();
  });
});
