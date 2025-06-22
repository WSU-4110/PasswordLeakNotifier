
const PasswordLeakNotifier = (function () {

    // Checks if email is valid by trimming the input then using checkValidity (!== "" for making sure input is not empty) 
    function validateEmail(emailInput) {
        const emailValue = emailInput.value.trim();
        return emailInput.checkValidity() && emailValue !== "";
    }

    // Shows breach results by removing d-none class from the results div
    function showResults(email) {
        const results = document.getElementById("results");
        results.classList.remove("d-none");
        results.scrollIntoView({ behavior: 'smooth' });
        results.innerText = `# breach(es) found for ${email}`;
    }

    // Shows successful reminder popup by remove d-none class from reminders div
    function showReminders(email) {
        const reminders = document.getElementById("reminders");
        reminders.classList.remove("d-none");
        document.querySelector("#popupContent p").innerText =
            `You have successfully signed up for monthly reminders to ${email}.`;
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
        handleFormSubmit: function (event) {
            event.preventDefault();
            const emailInput = document.getElementById("emailInput");
            const emailValue = emailInput.value.trim();

            if (validateEmail(emailInput)) {
                showResults(emailValue);
                showReminders(emailValue);
            } else {
                console.log("Invalid email.");
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

