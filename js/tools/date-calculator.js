/**
 * Date Calculator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('dc-start')) {
    const today = new Date().toISOString().substring(0, 10);
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Start Date:</label>
          <input type="date" id="dc-start" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="${today}">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Days to Add / Subtract:</label>
          <input type="number" id="dc-days" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="30">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-dc-btn" class="btn btn-primary flex-1">📅 Calculate Target Date</button>
      </div>
    `;
  }

  function calculate() {
    const startStr = document.getElementById('dc-start')?.value;
    const days = parseInt(document.getElementById('dc-days')?.value || 0);

    if (!startStr || isNaN(days)) {
      if (out) out.value = 'ERROR: Enter a valid start date and number of days.';
      return;
    }

    const startDate = new Date(startStr);
    const targetDate = new Date(startDate);
    targetDate.setDate(targetDate.getDate() + days);

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    let res = '--- DATE ARITHMETIC CALCULATOR ---nn';
    res += `Start Date: ${startDate.toLocaleDateString('en-US', options)}n`;
    res += `Days Delta: ${days >= 0 ? '+' : ''}${days} daysnn`;
    res += `Result Date: ${targetDate.toLocaleDateString('en-US', options)}n`;
    res += `ISO Format: ${targetDate.toISOString().substring(0, 10)}n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Target date calculated!', 'success');
  }

  const activeBtn = document.getElementById('calc-dc-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
