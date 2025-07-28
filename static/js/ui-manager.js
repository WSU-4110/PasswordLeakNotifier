/**
 * Observer Pattern Implementation for UI State Management
 * 
 * This implementation follows the classic Observer Pattern:
 * - Subject (Observable): Maintains list of observers and notifies them of state changes
 * - Observer: Interface for objects that should be notified of subject changes
 * - ConcreteObserver: Implements the Observer interface and responds to notifications
 */

/**
 * Observer Interface
 * All UI components that want to be notified of state changes should implement this
 */
class Observer {
  update(state) {
    throw new Error('update method must be implemented by concrete observers');
  }
}

/**
 * Subject (Observable) - Manages observers and notifies them of changes
 */
class Subject {
  constructor() {
    this.observers = [];
  }

  /**
   * Add an observer to the list
   * @param {Observer} observer - Observer to add
   */
  attach(observer) {
    if (!(observer instanceof Observer)) {
      throw new Error('Observer must implement Observer interface');
    }
    this.observers.push(observer);
  }

  /**
   * Remove an observer from the list
   * @param {Observer} observer - Observer to remove
   */
  detach(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  /**
   * Notify all observers of state changes
   * @param {*} state - Current state to pass to observers
   */
  notify(state) {
    this.observers.forEach(observer => {
      try {
        observer.update(state);
      } catch (error) {
        console.error('Error notifying observer:', error);
      }
    });
  }
}

/**
 * Application State Subject
 * Manages the application state and notifies observers when it changes
 */
class AppStateSubject extends Subject {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      results: null,
      error: null,
      email: '',
      lastUpdated: Date.now()
    };
  }

  /**
   * Update the application state
   * @param {Object} newState - New state properties to merge
   */
  setState(newState) {
    const previousState = { ...this.state };
    this.state = { 
      ...this.state, 
      ...newState, 
      lastUpdated: Date.now() 
    };
    
    // Only notify if state actually changed
    if (JSON.stringify(previousState) !== JSON.stringify(this.state)) {
      this.notify(this.state);
    }
  }

  /**
   * Get current state (immutable copy)
   * @returns {Object} Current state
   */
  getState() {
    return { ...this.state };
  }

  /**
   * Reset state to initial values
   */
  resetState() {
    this.setState({
      isLoading: false,
      results: null,
      error: null,
      email: ''
    });
  }
}

// Create singleton instance
const appState = new AppStateSubject();

// Export for global access
window.Observer = Observer;
window.Subject = Subject;
window.AppStateSubject = AppStateSubject;
window.appState = appState;
