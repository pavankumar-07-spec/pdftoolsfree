/**
 * Recurring Deposit (RD) Calculator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('rd-monthly')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Monthly Deposit Amount ($ / ₹):</label>
        <input type="number" id="rd-monthly" class="form-input" value="5000" min="100" step="500" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Annual Interest Rate (%):</label>
          <input type="number" id="rd-rate" class="form-input" value="7.1" step="0.1" min="0.1" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Tenure (Months):</label>
          <input type="number" id="rd-tenure" class="form-input" value="12" min="1" max="120" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Compounding Frequency:</label>
        <select id="rd-freq" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
          <option value="quarterly">Quarterly (Standard Bank RD)</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-rd-btn" class="btn btn-primary flex-1">🏦 Calculate RD Returns</button>
      </div>
    `;
  }

  function calculate() {
    const P = parseFloat(document.getElementById('rd-monthly') ? document.getElementById('rd-monthly').value : 5000) || 0;
    const rPct = parseFloat(document.getElementById('rd-rate') ? document.getElementById('rd-rate').value : 7.1) || 0;
    const months = parseInt(document.getElementById('rd-tenure') ? document.getElementById('rd-tenure').value : 12, 10) || 0;
    const freq = document.getElementById('rd-freq') ? document.getElementById('rd-freq').value : 'quarterly';

    if (P <= 0 || rPct <= 0 || months <= 0) {
      if (out) out.value = 'ERROR: Please enter valid positive values for deposit amount, interest rate, and tenure.';
      return;
    }

    const r = rPct / 100;
    let nComp = 4; // Quarterly
    if (freq === 'monthly') nComp = 12;
    if (freq === 'yearly') nComp = 1;

    // Standard RD Maturity Formula: sum of compounded values for each monthly installment
    let maturity = 0;
    for (let i = 1; i <= months; i++) {
      // time remaining in years for installment i
      const tMonths = months - i + 1;
      const tYears = tMonths / 12;
      maturity += P * Math.pow(1 + r / nComp, nComp * tYears);
    }

    const totalInvested = P * months;
    const totalInterest = maturity - totalInvested;

    let res = `--- RECURRING DEPOSIT (RD) CALCULATOR ---nn`;
    res += `Monthly Deposit:       $${P.toFixed(2)}n`;
    res += `Annual Interest Rate:  ${rPct.toFixed(2)}%n`;
    res += `Tenure:                ${months} Months (${(months / 12).toFixed(1)} Years)n`;
    res += `Compounding:           ${freq.toUpperCase()}nn`;

    res += `=== FINANCIAL SUMMARY ===n`;
    res += `Total Amount Deposited: $${totalInvested.toFixed(2)}n`;
    res += `Total Interest Earned:  $${totalInterest.toFixed(2)}n`;
    res += `Maturity Value:        $${maturity.toFixed(2)}nn`;

    res += `Effective Wealth Increase: +${((totalInterest / totalInvested) * 100).toFixed(2)}%n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('RD calculation completed!', 'success');
  }

  const activeBtn = document.getElementById('calc-rd-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
