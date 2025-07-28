/**
 * API Service that integrates with Observer Pattern
 * Handles all API communication and updates application state
 */
class ApiService {  constructor(appStateSubject, baseUrl = null) {
    this.appState = appStateSubject;
    this.baseUrl = baseUrl || window.location.origin || 'http://localhost:3000';
  }

  /**
   * Check email for breaches
   * @param {string} email - Email address to check
   * @returns {Promise<Object>} API response data
   */  async checkEmail(email) {
    // Trim whitespace first
    const trimmedEmail = email.trim();
    
    // Validate email format
    if (!this.isValidEmail(trimmedEmail)) {
      throw new Error('Please enter a valid email address');
    }

    // Update state to loading
    this.appState.setState({
      isLoading: true,
      error: null,
      email: trimmedEmail
    });

    try {
      const response = await fetch(
        `${this.baseUrl}/check-email?email=${encodeURIComponent(trimmedEmail)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Check for API errors
      if (data.error) {
        throw new Error(data.error);
      }

      // Update state with successful results
      this.appState.setState({
        isLoading: false,
        results: data,
        error: null
      });

      return data;

    } catch (error) {
      // Update state with error
      this.appState.setState({
        isLoading: false,
        error: error.message,
        results: null
      });
      
      throw error;
    }
  }

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} Whether email is valid
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Clear current results
   */
  clearResults() {
    this.appState.setState({
      results: null,
      error: null,
      isLoading: false
    });
  }

  /**
   * Reset the entire application state
   */
  resetApp() {
    this.appState.resetState();
  }
}

// Export API service
window.ApiService = ApiService;
