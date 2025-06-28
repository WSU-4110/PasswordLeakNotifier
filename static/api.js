const apiBase = "https://password-leak-notifier-csc4110-45d5c49e4df3.herokuapp.com";

document.getElementById('emailForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    await createUser();
});

function displayOutput(data) {
    document.getElementById('output').textContent = "Breach Results:\n" + JSON.stringify(data, null, 2);
}

async function createUser() {
    const email = document.getElementById('emailInput').value;
    const res = await fetch(`${apiBase}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    });
    const data = await res.json();
    if ("error" in data) {
        getResults();
    } else {
        displayOutput(data);
    }
}

async function addSearch() {
    const user_id = document.getElementById('userId').value;
    const query = document.getElementById('query').value;
    const result = document.getElementById('result').value;

    const res = await fetch(`${apiBase}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id, query, result })
    });
    const data = await res.json();
    displayOutput(data);
}

async function getResults() {
    const user_email = document.getElementById('emailInput').value;
    const res = await fetch(`${apiBase}/search/${user_email}`);
    const data = await res.json();
    displayOutput(data);
}