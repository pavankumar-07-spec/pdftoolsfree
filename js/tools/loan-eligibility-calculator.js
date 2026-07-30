/**
 * Bank Loan Eligibility Calculator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('lec-income')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Gross Monthly Income ($ / ₹):</label>
          <input type="number" id="lec-income" class="form-input" value="5000" min="500" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Existing Monthly EMI Obligations:</label>
          <input type="number" id="lec-emis" class="form-input" value="800" min="0" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Interest Rate (% p.a.):</label>
          <input type="number" id="lec-rate" class="form-input" value="8.5" step="0.1" min="1" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Loan Tenure (Years):</label>
          <input type="number" id="lec-tenure" class="form-input" value="20" min="1" max="30" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-lec-btn" class="btn btn-primary flex-1">🏦 Calculate Max Loan Eligibility</button>
      </div>
    `;
  }

  function calculate() {
    const income = parseFloat(document.getElementById('lec-income') ? document.getElementById('lec-income').value : 5000) || 0;
    const emis = parseFloat(document.getElementById('lec-emis') ? document.getElementById('lec-emis').value : 800) || 0;
    const rateAnnual = parseFloat(document.getElementById('lec-rate') ? document.getElementById('lec-rate').value : 8.5) || 0;
    const tenureYears = parseInt(document.getElementById('lec-tenure') ? document.getElementById('lec-tenure').value : 20, 10) || 0;

    if (income <= 0) {
      if (out) out.value = 'ERROR: Please enter a valid gross monthly income.';
      return;
    }

    // Standard bank FOIR limit (Fixed Obligation to Income Ratio): 50% of income max for all EMIs combined
    const maxAvailableEmi = Math.max(0, (income * 0.50) - emis);

    const r = (rateAnnual / 12) / 100;
    const n = tenureYears * 12;

    // EMI formula: P * r * (1+r)^n / ((1+r)^n - 1) => P = EMI * ((1+r)^n - 1) / (r * (1+r)^n)
    let maxLoanPrincipal = 0;
    if (r > 0 && n > 0 && maxAvailableEmi > 0) {
      const num = Math.pow(1 + r, n) - 1;
      const den = r * Math.pow(1 + r, n);
      maxLoanPrincipal = maxAvailableEmi * (num / den);
    }

    let res = `--- LOAN ELIGIBILITY CALCULATOR REPORT ---nn`;
    res += `Gross Income:      $${income.toLocaleString()} / monthn`;
    res += `Existing EMIs:     $${emis.toLocaleString()} / monthn`;
    res += `Max Allowed EMI:   $${maxAvailableEmi.toFixed(2)} / month (50% FOIR cap)nn`;

    res += `=== ELIGIBILITY ESTIMATE ===n`;
    res += `• Maximum Eligible Loan Principal: $${Math.round(maxLoanPrincipal).toLocaleString()}n`;
    res += `• Interest Rate:                  ${rateAnnual}% p.a.n`;
    res += `• Tenure:                         ${tenureYears} Years (${n} months)n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Max Loan Eligibility: $${Math.round(maxLoanPrincipal).toLocaleString()}`, 'success');
  }

  const activeBtn = document.getElementById('calc-lec-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
