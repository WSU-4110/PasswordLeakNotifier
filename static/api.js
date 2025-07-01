const apiBase = "https://password-leak-notifier-csc4110-45d5c49e4df3.herokuapp.com";

document.getElementById('emailForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    await createUser();
});

function displayOutput(data) {
    document.getElementById('testp').textContent = "Stored in Database:\n" + JSON.stringify(data, null, 2);
}

function userExists() {
    document.getElementById('testp').textContent = "User already exists in database.";
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
        userExists();
    } else {
        displayOutput(data);
    }
}

//change function
async function addSearch(email, name, date, breach) {
    try {
        if (!breach) {
            breach = "Reset link not found";
        }
        const res = await fetch(`${apiBase}/search`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_email: email,
                breach_name: name,
                breach_date: date,
                breach: breach
            })
        });

        const data = await res.json();

        if (!res.ok || "error" in data) {
            return { error: data.error || "oops" };
        }

        return data;
    } catch (err) {
        console.error('addSearch fetch error:', err);
        return { error: 'Network error or invalid response' };
    }
}

const EmailAPI = (function() {
    
    async function checkEmail(email) {
        try {
            // Call your Flask backend endpoint instead of the old Heroku URL
            const res = await fetch(`/check-email?email=${encodeURIComponent(email)}`);
            const data = await res.json();
            
            if (data.error) {
                // Use the UI functions from script.js to show error
                PasswordLeakNotifier.showError(data.error);
                return;
            }

            let display = {};
            for (const breach of data.breaches) {
                
                const result = await addSearch(
                    email,
                    breach.name,
                    breach.date,
                    breach.reset_link 
                );

                display[breach.name] = result;
            }
            displayOutput(display);
            
            // Use the UI functions from script.js to show results
            PasswordLeakNotifier.showResults(data);
            PasswordLeakNotifier.showReminders(email);
            
        } catch (error) {
            console.error('Error checking email:', error);
            PasswordLeakNotifier.showError('Failed to check email. Please try again.');
        }
    }

    // Keep the structure for future functionality
    async function subscribeToReminders(email) {
        // Placeholder for future reminder functionality
        console.log(`Subscribing ${email} to reminders`);
    }

    return {
        checkEmail,
        subscribeToReminders
    };
})();