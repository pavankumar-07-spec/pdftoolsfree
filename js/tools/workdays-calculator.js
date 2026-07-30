/**
 * Workdays & Business Days Engine (Alias)
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('wd-start')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Start Date:</label>
          <input type="date" id="wd-start" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">End Date:</label>
          <input type="date" id="wd-end" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-wd-btn" class="btn btn-primary flex-1">💼 Calculate Workdays</button>
      </div>
    `;

    const today = new Date().toISOString().split('T')[0];
    const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    document.getElementById('wd-start').value = today;
    document.getElementById('wd-end').value = nextMonth;
  }

  function calculate() {
    const sStr = document.getElementById('wd-start') ? document.getElementById('wd-start').value : '';
    const eStr = document.getElementById('wd-end') ? document.getElementById('wd-end').value : '';

    if (!sStr || !eStr) {
      if (out) out.value = 'ERROR: Please select start and end dates.';
      return;
    }

    const start = new Date(sStr + 'T00:00:00');
    const end = new Date(eStr + 'T00:00:00');

    let workDays = 0;
    let weekendDays = 0;

    const cur = new Date(start);
    while (cur <= end) {
      const day = cur.getDay();
      if (day === 0 || day === 6) weekendDays++;
      else workDays++;
      cur.setDate(cur.getDate() + 1);
    }

    let res = `--- WORKDAYS CALCULATOR REPORT ---nn`;
    res += `Start Date: ${start.toDateString()}n`;
    res += `End Date:   ${end.toDateString()}nn`;
    res += `Workdays (Mon-Fri): ${workDays} daysn`;
    res += `Weekend Days:       ${weekendDays} daysn`;

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Found ${workDays} workdays!`, 'success');
  }

  const activeBtn = document.getElementById('calc-wd-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
