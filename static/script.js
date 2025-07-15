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
      <p style="margin:.75rem 0">${breach.Description.slice(0,120)}…</p>
      ${
        breach.PasswordResetLink
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

/* Form submit */
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearResults();
  loader.classList.remove("hidden");

  try {
    const email = emailInput.value.trim();
    const r = await fetch(`/check-email?email=${encodeURIComponent(email)}`);
    const data = await r.json();

    loader.classList.add("hidden");
    resultsSection.classList.remove("hidden");

    if (data.breach_count === 0) {
      resultsSection.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;font-weight:600;background:var(--card);padding:1.25rem;border-radius:.85rem">🎉 <code>${data.email}</code> is squeaky clean!</div>
      `;
    } else {
      data.breaches.forEach((b) => resultsSection.appendChild(makeCard(b)));
    }
  } catch (err) {
    loader.classList.add("hidden");
    alert("Error: " + err.message);
  }
});
