const API_BASE = 'https://password-leak-notifier-csc4110-45d5c49e4df3.herokuapp.com'; 

function displayOutput(data) {
    document.getElementById('output').textContent = JSON.stringify(data, null, 2);
}

// Create a new user by email
export async function createUser() {
    const email = document.getElementById('email').value;
    const res = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
      displayOutput(data);
    
  }

// Add a search result for a user
export async function addSearchResult(user_id, query, result) {
  const res = await fetch(`${API_BASE}/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id, query, result })
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to add search result');
  }

  return await res.json();
}

// Fetch search results for a user
export async function getSearchResults(user_id) {
  const res = await fetch(`${API_BASE}/search/${user_id}`);
  
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to fetch results');
  }

  return await res.json();
}