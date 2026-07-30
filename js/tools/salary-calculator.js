/**
 * Salary Converter Calculator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('sal-amount')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Pay Amount ($/₹):</label>
          <input type="number" id="sal-amount" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="600000">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Frequency:</label>
          <select id="sal-freq" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
            <option value="year" selected>Per Year (Annual CTC)</option>
            <option value="month">Per Month</option>
            <option value="hour">Per Hour</option>
          </select>
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-sal-btn" class="btn btn-primary flex-1">💵 Convert Salary Rates</button>
      </div>
    `;
  }

  function calculate() {
    const amount = parseFloat(document.getElementById('sal-amount')?.value || 0);
    const freq = document.getElementById('sal-freq')?.value || 'year';

    if (isNaN(amount) || amount <= 0) {
      if (out) out.value = 'ERROR: Enter a valid positive salary amount.';
      return;
    }

    let annual = 0;
    if (freq === 'year') annual = amount;
    else if (freq === 'month') annual = amount * 12;
    else if (freq === 'hour') annual = amount * 40 * 52; // 40 hrs/week, 52 weeks

    const monthly = annual / 12;
    const weekly = annual / 52;
    const daily = annual / 260; // 5 workdays * 52 weeks
    const hourly = annual / 2080;

    let res = '--- SALARY BREAKDOWN & CONVERSION ---nn';
    res += `• Annual Salary:  ₹${annual.toLocaleString('en-IN', { maximumFractionDigits: 2 })}n`;
    res += `• Monthly Pay:    ₹${monthly.toLocaleString('en-IN', { maximumFractionDigits: 2 })}n`;
    res += `• Weekly Pay:     ₹${weekly.toLocaleString('en-IN', { maximumFractionDigits: 2 })}n`;
    res += `• Daily Pay:      ₹${daily.toLocaleString('en-IN', { maximumFractionDigits: 2 })}n`;
    res += `• Hourly Rate:    ₹${hourly.toLocaleString('en-IN', { maximumFractionDigits: 2 })}n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Salary converted!', 'success');
  }

  const activeBtn = document.getElementById('calc-sal-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
