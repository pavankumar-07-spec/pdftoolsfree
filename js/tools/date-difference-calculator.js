/**
 * Date Difference Calculator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('dd-start')) {
    const today = new Date().toISOString().substring(0, 10);
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Start Date:</label>
          <input type="date" id="dd-start" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="2026-01-01">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">End Date:</label>
          <input type="date" id="dd-end" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="${today}">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-dd-btn" class="btn btn-primary flex-1">🗓️ Calculate Difference</button>
      </div>
    `;
  }

  function calculate() {
    const d1Str = document.getElementById('dd-start')?.value;
    const d2Str = document.getElementById('dd-end')?.value;

    if (!d1Str || !d2Str) {
      if (out) out.value = 'ERROR: Select both start and end dates.';
      return;
    }

    const d1 = new Date(d1Str);
    const d2 = new Date(d2Str);

    const diffMs = Math.abs(d2 - d1);
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffWeeks = (diffDays / 7).toFixed(2);
    const diffMonths = (diffDays / 30.4375).toFixed(2);
    const diffHours = diffDays * 24;

    let res = '--- DATE DIFFERENCE RESULT ---nn';
    res += `From: ${d1.toDateString()}nTo:   ${d2.toDateString()}nn`;
    res += `• Difference in Days: ${diffDays.toLocaleString()} daysn`;
    res += `• Difference in Weeks: ~${diffWeeks} weeksn`;
    res += `• Difference in Months: ~${diffMonths} monthsn`;
    res += `• Difference in Hours: ${diffHours.toLocaleString()} hoursn`;

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Difference: ${diffDays} days`, 'success');
  }

  const activeBtn = document.getElementById('calc-dd-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
