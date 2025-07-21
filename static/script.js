/* DOM hooks */
const form = document.getElementById("emailForm");
const emailInput = document.getElementById("emailInput");
const resultsSection = document.getElementById("resultsSection");
const loader = document.getElementById("loader");

/* Build result cards */
const makeCard = (breach) => {
  const div = document.createElement("div");
  div.className = "result-card";
  div.innerHTML = `
      <h4 style="margin-bottom:.25rem">${breach.Name}</h4>
      <small class="text-muted">Breached ${breach.BreachDate}</small>
      <p style="margin:.75rem 0">${breach.Description.slice(0, 120)}…</p>
      ${breach.PasswordResetLink
      ? `<a href="${breach.PasswordResetLink}" class="btn btn-sm" style="background:var(--primary);color:#fff;border-radius:.5rem;padding:.35rem .75rem" target="_blank">Reset Password</a>`
      : `<span style="font-size:.8rem;opacity:.7">No reset link</span>`
    }
  `;
  return div;
};

/* Helpers */
const clearResults = () => {
  resultsSection.innerHTML = "";
  resultsSection.classList.add("hidden");
};

export function generateTableHTML(email, breaches) {
  return `
    <div style="display: block; width: 100%;">
      <div class="mb-4 text-center" style="font-size: 2.5rem;">
        <strong>${breaches.length}</strong> breach(es) found for <strong>${email}</strong>:<br>
      </div>

      <div class="result-card p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle transparent-table mb-0">
            <thead>
              <tr>
                <th scope="col">Website</th>
                <th scope="col">Breach Date</th>
                <th scope="col">Reset Link</th>
              </tr>
            </thead>
            <tbody>
              ${breaches.map(b => `
                <tr>
                  <td><strong>${b.name}</strong></td>
                  <td>${b.date}</td>
                  <td>
                    <a href="${b.link}" target="_blank" class="btn btn-outline-primary btn-sm">
                      Reset Password
                    </a>
                  </td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}


/* Form submit */
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearResults();
  loader.classList.remove("hidden");

  try {
    const email = emailInput.value.trim();

    // Example data 
    const Breaches = [
      { name: "Example 1", date: "2023-03-15", link: "https://example.com" },
      { name: "Example 2", date: "2022-11-01", link: "https://example.com" }
    ];
    const html = generateTableHTML(email, Breaches);


    resultsSection.innerHTML = html;
    loader.classList.add("hidden");
    resultsSection.classList.remove("hidden");
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'end' });

  } catch (err) {
    loader.classList.add("hidden");
    alert("Error: " + err.message);
  }
});