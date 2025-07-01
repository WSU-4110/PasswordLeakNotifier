
const PasswordLeakNotifier = (function () {

    // Checks if email is valid by trimming the input then using checkValidity (!== "" for making sure input is not empty) 
    function validateEmail(emailInput) {
        const emailValue = emailInput.value.trim();
        return emailInput.checkValidity() && emailValue !== "";
    }

    // Shows breach results by removing d-none class from the results div
    function showResults(email) {
        const results = document.getElementById("results");


        // Creates a list of the breaches with keys name, date, and link then outputs them into the results div
        const Breaches = [
            { name: "Example 1", date: "2023-03-15", link: "https://example.com" },
            { name: "Example 2", date: "2022-11-01", link: "https://example.com" }
        ];

        let html = `
    <div class="mb-3" style="font-size: 2.5rem;">
      <strong>${Breaches.length}</strong> breach(es) found for <strong>${email}</strong>:
    </div>
    <ul class="list-group mb-3 text-start">
  `;

        for (const breach of Breaches) {
            html += `
      <li class="list-group-item">
        <strong>${breach.name}</strong><br>
        Breach Date: ${breach.date}<br>
        <a href="${breach.link}" target="_blank">${breach.link}</a>
      </li>
    `;
        }

        html += `</ul>`;
        results.innerHTML = html;

        results.classList.remove("d-none");
        results.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }

    // Shows successful reminder popup by removing d-none class from reminders div
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
