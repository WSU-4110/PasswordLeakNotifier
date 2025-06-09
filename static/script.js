// After valid email input

document.getElementById("emailForm").addEventListener("submit", function (event){
    event.preventDefault();

    const emailInput = document.getElementById("emailInput");
    const emailValue = emailInput.value.trim();
    const results = document.getElementById("results");
    const reminders = document.getElementById("reminders");

    if (emailInput.checkValidity() && emailValue !== ""){
        // Results div
        results.classList.remove("d-none");
        results.scrollIntoView({ behavior: 'smooth' });
        results.innerText = `# breach(es) found for ${emailValue}`;

        // Reminders div
        reminders.classList.remove("d-none");
        document.querySelector("#popupContent p").innerText = `You have successfully signed up for monthly reminders to ${emailValue}.`;
    } else {
        console.log("Invalid email.")
    }

})

// "Success" popup when clicking "Yes" for reminders

document.getElementById("reminderSubmit").addEventListener("click", function(){
    document.getElementById("popup").classList.remove("d-none");
})

document.getElementById("closePopup").addEventListener("click", function(){
    document.getElementById("popup").classList.add("d-none");
})