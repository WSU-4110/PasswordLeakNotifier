/**
 * Main Application Script - Refactored with Observer Pattern
 * This script initializes the application using the Observer Pattern for state management
 * Includes fallback mechanisms to ensure functionality even if Observer Pattern fails
 */

// Application initialization
document.addEventListener('DOMContentLoaded', function() {
  initializeApplication();
});

/**
 * Initialize the application with Observer Pattern and fallback mechanisms
 */
function initializeApplication() {
  // Get DOM elements
  const form = document.getElementById("emailForm");
  const emailInput = document.getElementById("emailInput");
  const resultsSection = document.getElementById("resultsSection");
  const loader = document.getElementById("loader");

  // Validate required elements exist
  if (!form || !emailInput || !resultsSection || !loader) {
    console.error('Required DOM elements not found');
    return;
  }

  try {
    // Check if Observer Pattern classes are available
    if (typeof Observer === 'undefined' || 
        typeof AppStateSubject === 'undefined' || 
        typeof ApiService === 'undefined' ||
        !window.appState) {
      throw new Error('Observer Pattern classes not loaded, falling back to basic implementation');
    }

    // Initialize Observer Pattern implementation
    initializeObserverPattern(form, emailInput, resultsSection, loader);
    
  } catch (error) {
    console.warn('Observer Pattern initialization failed:', error.message);
    console.log('Falling back to basic implementation...');
    
    // Fallback to basic implementation
    initializeBasicImplementation(form, emailInput, resultsSection, loader);
  }
}

/**
 * Initialize with Observer Pattern
 */
function initializeObserverPattern(form, emailInput, resultsSection, loader) {
  try {
    // Create API service
    const apiService = new ApiService(window.appState);

    // Create and register observers
    const loadingObserver = new LoadingObserver(loader);
    const resultsObserver = new ResultsObserver(resultsSection);
    const formObserver = new FormObserver(form, emailInput);
    const navigationObserver = new NavigationObserver();
    const analyticsObserver = new AnalyticsObserver();

    // Attach observers to the application state
    window.appState.attach(loadingObserver);
    window.appState.attach(resultsObserver);
    window.appState.attach(formObserver);
    window.appState.attach(navigationObserver);
    window.appState.attach(analyticsObserver);

    // Set up form submission handler
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      
      const email = emailInput.value.trim();
      if (!email) {
        window.appState.setState({
          error: 'Please enter an email address',
          results: null
        });
        return;
      }

      try {
        await apiService.checkEmail(email);
      } catch (error) {
        // Error handling is already done in the API service
        console.error('Search failed:', error.message);
      }
    });

    // Set up input validation
    emailInput.addEventListener('input', function() {
      // Clear previous errors when user starts typing
      const currentState = window.appState.getState();
      if (currentState.error) {
        window.appState.setState({ error: null });
      }
    });

    // Optional: Add keyboard shortcuts
    document.addEventListener('keydown', function(event) {
      // Escape key clears results
      if (event.key === 'Escape') {
        apiService.clearResults();
        emailInput.focus();
      }
      
      // Ctrl+R resets the application
      if (event.ctrlKey && event.key === 'r') {
        event.preventDefault();
        apiService.resetApp();
        emailInput.value = '';
        emailInput.focus();
      }
    });

    // Log successful initialization
    console.log('Password Leak Notifier initialized with Observer Pattern');
    console.log('Attached observers:', window.appState.observers.length);
    
    // Make API service globally available for debugging
    window.apiService = apiService;
    
  } catch (error) {
    console.error('Observer Pattern initialization error:', error);
    throw error; // Re-throw to trigger fallback
  }
}
