// After valid email input

document.getElementById("emailForm").addEventListener("submit", function (event){
    event.preventDefault();

    const emailInput = document.getElementById("emailInput");
    const emailValue = emailInput.value.trim();
    const results = document.getElementById("results");

    if (emailInput.checkValidity() && emailValue !== ""){
        results.classList.remove("d-none");
        results.scrollIntoView({ behavior: 'smooth' });

    } else {
        console.log("Invalid email.")
    }

})