/**
 * Business Days Calculator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('bd-start')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Start Date:</label>
          <input type="date" id="bd-start" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">End Date:</label>
          <input type="date" id="bd-end" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-bd-btn" class="btn btn-primary flex-1">💼 Calculate Business Days</button>
      </div>
    `;

    const today = new Date().toISOString().split('T')[0];
    const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    document.getElementById('bd-start').value = today;
    document.getElementById('bd-end').value = nextMonth;
  }

  function calculate() {
    const sStr = document.getElementById('bd-start') ? document.getElementById('bd-start').value : '';
    const eStr = document.getElementById('bd-end') ? document.getElementById('bd-end').value : '';

    if (!sStr || !eStr) {
      if (out) out.value = 'ERROR: Please select both start and end dates.';
      return;
    }

    const start = new Date(sStr + 'T00:00:00');
    const end = new Date(eStr + 'T00:00:00');

    if (end < start) {
      if (out) out.value = 'ERROR: End date cannot be before start date.';
      return;
    }

    let bizDays = 0;
    let weekendDays = 0;
    let totalCalendarDays = 0;

    const cur = new Date(start);
    while (cur <= end) {
      totalCalendarDays++;
      const day = cur.getDay();
      if (day === 0 || day === 6) {
        weekendDays++;
      } else {
        bizDays++;
      }
      cur.setDate(cur.getDate() + 1);
    }

    let res = `--- BUSINESS DAYS CALCULATOR REPORT ---nn`;
    res += `Start Date: ${start.toDateString()}n`;
    res += `End Date:   ${end.toDateString()}nn`;

    res += `=== DAYS BREAKDOWN ===n`;
    res += `Working Business Days (Mon-Fri): ${bizDays} daysn`;
    res += `Weekend Days (Sat-Sun):        ${weekendDays} daysn`;
    res += `Total Calendar Days:            ${totalCalendarDays} daysn`;

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Found ${bizDays} business days!`, 'success');
  }

  const activeBtn = document.getElementById('calc-bd-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
