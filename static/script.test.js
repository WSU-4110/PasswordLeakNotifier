// Test 1: Generating breach results table

import './script.js';
import { setupFormHandler } from './script.js';
import { clearResults } from './script.js';
import { makeCard } from './script.js';

beforeEach(() => {
    document.body.innerHTML = `
    <form id="emailForm">
      <input id="emailInput" />
      <div id="resultsSection" class="hidden"></div>
      <div id="loader" class="hidden"></div>
    </form>
  `;
    setupFormHandler();
});

test('form submission displays breach results', async () => {
    const form = document.getElementById('emailForm');
    const emailInput = document.getElementById('emailInput');
    const loader = document.getElementById('loader');
    const resultsSection = document.getElementById('resultsSection');

    emailInput.value = 'test@adobe.com';

    const submitEvent = new Event('submit');
    form.dispatchEvent(submitEvent);

    await Promise.resolve();

    expect(resultsSection.classList.contains('hidden')).toBe(false);
    expect(resultsSection.innerHTML).toContain('breach(es) found');
    expect(resultsSection.innerHTML).toContain('test@adobe.com');
});

// Test 2: Clearing results

test('clearResults clears innerHTML and adds hidden class', () => {
    document.body.innerHTML = `
    <div id="resultsSection" class="visible">
      <p>Previous content</p>
    </div>
  `;

    const resultsSection = document.getElementById("resultsSection");

    expect(resultsSection.innerHTML).toContain("Previous content");
    expect(resultsSection.classList.contains("hidden")).toBe(false);

    clearResults();

    expect(resultsSection.innerHTML).toBe("");
    expect(resultsSection.classList.contains("hidden")).toBe(true);
})

// Test 3: Generating correct formatting
test('makeCard applies correct inline styles and classes', () => {
    const breach = {
        Name: "TestBreach",
        BreachDate: "2024-01-01",
        PasswordResetLink: "https://example.com/reset"
    };

    const card = makeCard(breach);

    expect(card.classList.contains('result-card')).toBe(true);

    const h4 = card.querySelector('h4');
    const small = card.querySelector('small');
    const a = card.querySelector('a');

    expect(h4.style.marginBottom).toBe('0.25rem');
    expect(a).not.toBeNull();
    expect(a.style.background).toBe('var(--primary)');
    expect(a.style.borderRadius).toBe('.5rem');
    expect(a.style.padding).toBe('0.35rem 0.75rem');
});
