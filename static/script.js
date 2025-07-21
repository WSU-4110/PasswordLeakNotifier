/* ---------- DOM hooks ---------- */
const form           = document.getElementById("emailForm");
const emailInput     = document.getElementById("emailInput");
const resultsSection = document.getElementById("resultsSection");
const loader         = document.getElementById("loader");

/* ---------- Config ---------- */
/* Local dev → Flask usually runs on port 5000.
   When you deploy, change only this constant. */
const API_BASE = window.location.origin;

/* ---------- Helper to talk to Flask ---------- */
async function checkEmail(email) {
  const url = `${API_BASE}/check-email?email=${encodeURIComponent(email)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Server error ${res.status}`);
  return res.json();                // {breach_count:int, breaches:[…]}
}

/* ---------- UI helpers ---------- */
const clearResults = () => {
  resultsSection.innerHTML = "";
  resultsSection.classList.add("hidden");
};

const showError = (msg) => {
  loader.classList.add("hidden");
  resultsSection.innerHTML =
    `<div class="alert alert-danger" role="alert">${msg}</div>`;
  resultsSection.classList.remove("hidden");
  resultsSection.scrollIntoView({ behavior: "smooth", block: "end" });
};

const showResults = (json, email) => {
  loader.classList.add("hidden");

  /* TODO – If your backend uses different keys, edit here */
  const { breach_count, breaches } = json;

  /* Header */
  let html = `
    <div class="mb-4 text-center" style="font-size: 2.5rem;">
      <strong>${breach_count}</strong> breach${breach_count === 1 ? "" : "es"}
      found for <strong>${email}</strong>:
    </div>

    <div class="result-card p-0">
      <div class="table-responsive">
        <table class="table table-hover align-middle transparent-table mb-0">
          <thead>
            <tr>
              <th scope="col">Website</th>
              <th scope="col">Breach Date</th>
              <th scope="col">Reset Link</th>
            </tr>
          </thead>
          <tbody>
  `;

  /* Each breach row */
  breaches.forEach(b => {
    /* TODO – adjust field names if your JSON differs */
    html += `
      <tr>
        <td><strong>${b.name}</strong></td>
        <td>${b.date}</td>
        <td>
          ${
            b.reset_link
              ? `<a href="${b.reset_link}" target="_blank"
                     class="btn btn-outline-primary btn-sm">
                     Reset&nbsp;Password
                 </a>`
              : `<span style="opacity:.6">No reset link</span>`
          }
        </td>
      </tr>
    `;
  });

  /* Close table */
  html += `
          </tbody>
        </table>
      </div>
    </div>
  `;

  resultsSection.innerHTML = html;
  resultsSection.classList.remove("hidden");
  resultsSection.scrollIntoView({ behavior: "smooth", block: "end" });
};

/* ---------- Form handler ---------- */
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearResults();

  const email = emailInput.value.trim();
  if (!email) {
    showError("Please enter a valid e‑mail address.");
    return;
  }

  loader.classList.remove("hidden");

  try {
    const data = await checkEmail(email);
    if (data.error) {
      showError(data.error);
    } else {
      showResults(data, email);
    }
  } catch (err) {
    console.error(err);
    showError("Unable to reach the server.  Please try again.");
  }
});