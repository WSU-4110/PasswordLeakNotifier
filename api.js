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