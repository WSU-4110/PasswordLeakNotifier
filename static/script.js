
const PasswordLeakNotifier = (function () {

    // Checks if email is valid by trimming the input then using checkValidity (!== "" for making sure input is not empty) 
    function validateEmail(emailInput) {
        const emailValue = emailInput.value.trim();
        return emailInput.checkValidity() && emailValue !== "";
    }

    // Shows loading state
    function showLoading(email) {
        const results = document.getElementById("results");
        results.classList.remove("d-none");
        results.innerHTML = `
            <div class="text-center">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Checking breaches...</p>
            </div>
        `;
        results.scrollIntoView({ behavior: 'smooth' });
    }

    // Shows breach results by removing d-none class from the results div
    function showResults(data) {
        const results = document.getElementById("results");
        results.classList.remove("d-none");
        results.scrollIntoView({ behavior: 'smooth' });
        
        if (data.breach_count === 0) {
            results.innerHTML = `
                <div class="alert alert-success">
                    <h4>Good news!</h4>
                    <p>No breaches found for your email</p>
                </div>
            `;
        } else {
            let breachesHtml = `
                <div class="alert alert-warning">
                    <h4>⚠️ ${data.breach_count} breach${data.breach_count > 1 ? 'es' : ''} found</h4>
                </div>
                <div class="row">
            `;
            
            data.breaches.forEach(breach => {
                breachesHtml += `
                    <div class="col-md-6 mb-3">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">${breach.name}</h5>
                                <p class="card-text">Breach Date: ${breach.date}</p>
                                ${breach.reset_link ? 
                                    `<a href="${breach.reset_link}" target="_blank" class="btn btn-primary">Reset Password</a>` :
                                    `<p class="text-muted">${breach.error}</p>`
                                }
                            </div>
                        </div>
                    </div>
                `;
            });
            
            breachesHtml += '</div>';
            results.innerHTML = breachesHtml;
        }
    }

    // Shows error messages
    function showError(message) {
        const results = document.getElementById("results");
        results.classList.remove("d-none");
        results.innerHTML = `
            <div class="alert alert-danger">
                <h4>Error</h4>
                <p>${message}</p>
            </div>
        `;
        results.scrollIntoView({ behavior: 'smooth' });
    }

    // Shows successful reminder popup by removing d-none class from reminders div
    function showReminders(email) {
        const reminders = document.getElementById("reminders");
        reminders.classList.remove("d-none");
        document.querySelector("#popupContent p").innerText =
            `You have successfully signed up for monthly reminders for ${email}.`;
    }

    // Simple function to remove d-none from the popup div
    function showPopup() {
        document.getElementById("popup").classList.remove("d-none");
    }

    // Simple function to add d-none from the popup div
    function hidePopup() {
        document.getElementById("popup").classList.add("d-none");
    }

    return {
        // Expose functions for api.js
        showLoading,
        showResults,
        showError,
        showReminders,
        
        handleFormSubmit: async function (event) {
            event.preventDefault();
            const emailInput = document.getElementById("emailInput");
            const emailValue = emailInput.value.trim();

            if (validateEmail(emailInput)) {
                showLoading(emailValue);
                // Call the API function from api.js
                await EmailAPI.checkEmail(emailValue);
            } else {
                showError("Please enter a valid email address.");
            }
        },
        
        handleReminderClick: function () {
            showPopup();
        },
        
        handleClosePopup: function () {
            hidePopup();
        }
    };
})();

document.getElementById("emailForm").addEventListener("submit", PasswordLeakNotifier.handleFormSubmit);
document.getElementById("reminderSubmit").addEventListener("click", PasswordLeakNotifier.handleReminderClick);
document.getElementById("closePopup").addEventListener("click", PasswordLeakNotifier.handleClosePopup);
