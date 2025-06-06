// After valid email input

document.getElementById("emailForm").addEventListener("submit", function (event){
    event.preventDefault();

    const emailInput = document.getElementById("emailInput");
    const results = document.getElementById("results");

    if (emailInput.checkValidity()){
        results.classList.remove("d-none");

    } else {
        console.log("Invalid email.")
    }

})