/**
 * Ovulation & Fertility Window Calculator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('oc-lmp')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">First Day of Last Period:</label>
          <input type="date" id="oc-lmp" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Average Cycle Length (Days):</label>
          <input type="number" id="oc-cycle" class="form-input" value="28" min="20" max="45" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-oc-btn" class="btn btn-primary flex-1">🌸 Calculate Ovulation Window</button>
      </div>
    `;

    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    document.getElementById('oc-lmp').value = twoWeeksAgo;
  }

  function calculate() {
    const lmpStr = document.getElementById('oc-lmp') ? document.getElementById('oc-lmp').value : '';
    const cycle = parseInt(document.getElementById('oc-cycle') ? document.getElementById('oc-cycle').value : 28, 10) || 28;

    if (!lmpStr) {
      if (out) out.value = 'ERROR: Please select the first day of your last period.';
      return;
    }

    const lmp = new Date(lmpStr + 'T00:00:00');
    // Ovulation occurs approximately 14 days before next period start
    const nextPeriod = new Date(lmp.getTime() + cycle * 24 * 60 * 60 * 1000);
    const ovulationDate = new Date(nextPeriod.getTime() - 14 * 24 * 60 * 60 * 1000);

    const fertStart = new Date(ovulationDate.getTime() - 4 * 24 * 60 * 60 * 1000);
    const fertEnd = new Date(ovulationDate.getTime() + 1 * 24 * 60 * 60 * 1000);

    let res = `--- OVULATION & FERTILITY WINDOW REPORT ---nn`;
    res += `Last Period Start: ${lmp.toDateString()}n`;
    res += `Cycle Length:      ${cycle} Daysnn`;

    res += `=== ESTIMATED DATES ===n`;
    res += `• Estimated Ovulation Day: ${ovulationDate.toDateString()}n`;
    res += `• Fertile Window:          ${fertStart.toDateString()} to ${fertEnd.toDateString()}n`;
    res += `• Next Expected Period:    ${nextPeriod.toDateString()}n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Estimated Ovulation: ${ovulationDate.toLocaleDateString()}`, 'success');
  }

  const activeBtn = document.getElementById('calc-oc-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
