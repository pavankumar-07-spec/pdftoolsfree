/**
 * Monthly Planner Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('mp-month')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Select Month & Year:</label>
        <input type="month" id="mp-month" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-mp-btn" class="btn btn-primary flex-1">📅 Generate Monthly Plan</button>
      </div>
    `;

    const now = new Date();
    const ym = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
    document.getElementById('mp-month').value = ym;
  }

  function calculate() {
    const mStr = document.getElementById('mp-month') ? document.getElementById('mp-month').value : '';

    if (!mStr) {
      if (out) out.value = 'ERROR: Please select a month.';
      return;
    }

    const [yr, mo] = mStr.split('-').map(Number);
    const date = new Date(yr, mo - 1, 1);
    const monthName = date.toLocaleString('en-US', { month: 'long' });
    const daysInMonth = new Date(yr, mo, 0).getDate();

    let res = `--- MONTHLY PLANNER: ${monthName.toUpperCase()} ${yr} ---nn`;
    res += `Total Days in Month: ${daysInMonth}nn`;

    res += `=== MONTHLY CALENDAR OUTLINE ===n`;
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(yr, mo - 1, day);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      res += `${day.toString().padStart(2, '0')} [${dayName}]: n`;
    }

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Monthly plan generated for ${monthName}!`, 'success');
  }

  const activeBtn = document.getElementById('calc-mp-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
