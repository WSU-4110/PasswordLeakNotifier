/**
 * Concrete Observer Implementations
 * Each observer handles a specific aspect of the UI updates
 */

/**
 * Loading State Observer - Manages loading indicators
 */
class LoadingObserver extends Observer {
  constructor(loaderElement) {
    super();
    this.loaderElement = loaderElement;
  }

  update(state) {
    if (state.isLoading) {
      this.showLoader();
    } else {
      this.hideLoader();
    }
  }

  showLoader() {
    if (this.loaderElement) {
      this.loaderElement.classList.remove('hidden');
    }
  }

  hideLoader() {
    if (this.loaderElement) {
      this.loaderElement.classList.add('hidden');
    }
  }
}

/**
 * Results Observer - Manages the display of search results
 */
class ResultsObserver extends Observer {
  constructor(resultsContainer) {
    super();
    this.resultsContainer = resultsContainer;
  }

  update(state) {
    if (state.results) {
      this.displayResults(state.results);
    } else if (state.error) {
      this.displayError(state.error);
    } else {
      this.clearResults();
    }
  }

  displayResults(results) {
    if (!this.resultsContainer) return;

    this.resultsContainer.innerHTML = '';
    this.resultsContainer.classList.remove('hidden');

    if (results.breach_count === 0) {
      this.displaySuccessMessage(results.email);
    } else {
      this.displayBreaches(results.breaches);
    }
  }

  displaySuccessMessage(email) {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
      grid-column: 1/-1; 
      text-align: center; 
      font-weight: 600; 
      background: var(--card); 
      padding: 1.25rem; 
      border-radius: 0.85rem;
      color: var(--primary);
    `;
    successDiv.innerHTML = `🎉 <code>${email}</code> is squeaky clean!`;
    this.resultsContainer.appendChild(successDiv);
  }

  displayBreaches(breaches) {
    breaches.forEach(breach => {
      const card = this.createBreachCard(breach);
      this.resultsContainer.appendChild(card);
    });
  }

  createBreachCard(breach) {
    const card = document.createElement('div');
    card.className = 'result-card';
    card.innerHTML = `
      <h4 style="margin-bottom: 0.25rem; color: var(--accent);">${breach.Name}</h4>
      <small class="text-muted">Breached ${breach.BreachDate}</small>
      <p style="margin: 0.75rem 0;">${breach.Description.slice(0, 120)}…</p>
      ${breach.PasswordResetLink 
        ? `<a href="${breach.PasswordResetLink}" class="btn btn-sm" 
           style="background: var(--primary); color: #fff; border-radius: 0.5rem; 
                  padding: 0.35rem 0.75rem; text-decoration: none; display: inline-block;" 
           target="_blank" rel="noopener noreferrer">Reset Password</a>`
        : `<span style="font-size: 0.8rem; opacity: 0.7;">No reset link available</span>`
      }
    `;
    return card;
  }

  displayError(error) {
    if (!this.resultsContainer) return;

    this.resultsContainer.innerHTML = '';
    this.resultsContainer.classList.remove('hidden');

    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
      grid-column: 1/-1; 
      text-align: center; 
      color: var(--accent); 
      background: var(--card); 
      padding: 1.25rem; 
      border-radius: 0.85rem; 
      border-left: 4px solid var(--accent);
    `;
    errorDiv.innerHTML = `⚠️ ${error}`;
    this.resultsContainer.appendChild(errorDiv);
  }

  clearResults() {
    if (this.resultsContainer) {
      this.resultsContainer.innerHTML = '';
      this.resultsContainer.classList.add('hidden');
    }
  }
}

/**
 * Form Observer - Manages form state and validation
 */
class FormObserver extends Observer {
  constructor(formElement, inputElement) {
    super();
    this.formElement = formElement;
    this.inputElement = inputElement;
  }

  update(state) {
    if (this.inputElement && state.email !== this.inputElement.value) {
      this.inputElement.value = state.email;
    }

    // Disable form during loading
    if (this.formElement) {
      const submitButton = this.formElement.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.disabled = state.isLoading;
        submitButton.textContent = state.isLoading ? 'Scanning...' : 'Scan';
      }
    }
  }
}

/**
 * Navigation Observer - Updates navigation state based on app state
 */
class NavigationObserver extends Observer {
  constructor() {
    super();
    this.navElement = document.querySelector('.nav');
  }

  update(state) {
    if (!this.navElement) return;

    // Add visual feedback during loading
    if (state.isLoading) {
      this.navElement.classList.add('app-loading');
    } else {
      this.navElement.classList.remove('app-loading');
    }
  }
}

/**
 * Analytics Observer - Tracks user interactions and state changes
 */
class AnalyticsObserver extends Observer {
  update(state) {
    // Log state changes for debugging/analytics
    console.log('App State Changed:', {
      timestamp: new Date(state.lastUpdated).toISOString(),
      isLoading: state.isLoading,
      hasResults: !!state.results,
      hasError: !!state.error,
      email: state.email ? '[email provided]' : '[no email]'
    });

    // Track significant events
    if (state.results && !state.isLoading) {
      this.trackEvent('search_completed', {
        breach_count: state.results.breach_count,
        email_domain: state.email.split('@')[1] || 'unknown'
      });
    }

    if (state.error && !state.isLoading) {
      this.trackEvent('search_error', {
        error_message: state.error
      });
    }
  }

  trackEvent(eventName, data) {
    // In a real application, this would send data to analytics service
    console.log(`Analytics Event: ${eventName}`, data);
  }
}

// Export all observer classes
window.LoadingObserver = LoadingObserver;
window.ResultsObserver = ResultsObserver;
window.FormObserver = FormObserver;
window.NavigationObserver = NavigationObserver;
window.AnalyticsObserver = AnalyticsObserver;
