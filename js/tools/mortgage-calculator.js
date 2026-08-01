/**
 * Mortgage & Loan Calculator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('mc-principal')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Home / Loan Amount ($/₹):</label>
          <input type="number" id="mc-principal" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="5000000">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Interest Rate (% p.a.):</label>
          <input type="number" id="mc-rate" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="8.5">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Loan Tenure (Years):</label>
          <input type="number" id="mc-years" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="20">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Down Payment ($/₹):</label>
          <input type="number" id="mc-dp" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="1000000">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-mc-btn" class="btn btn-primary flex-1">🏡 Calculate Mortgage EMI</button>
      </div>
    `;
  }

  function calculate() {
    const totalCost = parseFloat(document.getElementById('mc-principal')?.value || 0);
    const rateAnnual = parseFloat(document.getElementById('mc-rate')?.value || 0);
    const years = parseFloat(document.getElementById('mc-years')?.value || 0);
    const dp = parseFloat(document.getElementById('mc-dp')?.value || 0);

    const loanAmount = totalCost - dp;

    if (loanAmount <= 0 || rateAnnual <= 0 || years <= 0) {
      if (out) out.value = 'ERROR: Enter valid positive numbers.';
      return;
    }

    const r = (rateAnnual / 12) / 100;
    const n = years * 12;

    const emi = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - loanAmount;

    let res = '--- MORTGAGE LOAN ANALYSIS ---nn';
    res += `Total Home Value: ₹${totalCost.toLocaleString()}n`;
    res += `Down Payment:     ₹${dp.toLocaleString()}n`;
    res += `Net Loan Amount:  ₹${loanAmount.toLocaleString()}n`;
    res += `Tenure:           ${years} years (${n} months)n`;
    res += `Interest Rate:    ${rateAnnual}% p.a.nn`;
    res += `Monthly EMI Payment:  ₹${emi.toLocaleString('en-IN', { maximumFractionDigits: 2 })}n`;
    res += `Total Interest Payable: ₹${totalInterest.toLocaleString('en-IN', { maximumFractionDigits: 2 })}n`;
    res += `Total Amount Paid:      ₹${totalPayment.toLocaleString('en-IN', { maximumFractionDigits: 2 })}n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast(`EMI: ₹${Math.round(emi).toLocaleString()}/mo`, 'success');
  }

  const activeBtn = document.getElementById('calc-mc-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
