/**
 * Down Payment & Mortgage Loan Calculator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('dp-price')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Property / Purchase Price ($ / ₹):</label>
        <input type="number" id="dp-price" class="form-input" value="300000" min="1000" step="5000" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Down Payment (%):</label>
          <input type="number" id="dp-pct" class="form-input" value="20" min="0" max="100" step="1" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Loan Term (Years):</label>
          <input type="number" id="dp-term" class="form-input" value="30" min="1" max="50" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Loan Interest Rate APR (%):</label>
        <input type="number" id="dp-rate" class="form-input" value="6.5" step="0.1" min="0.1" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-dp-btn" class="btn btn-primary flex-1">🏡 Calculate Down Payment & EMI</button>
      </div>
    `;
  }

  function calculate() {
    const price = parseFloat(document.getElementById('dp-price') ? document.getElementById('dp-price').value : 300000) || 0;
    const dpPct = parseFloat(document.getElementById('dp-pct') ? document.getElementById('dp-pct').value : 20) || 0;
    const termYears = parseInt(document.getElementById('dp-term') ? document.getElementById('dp-term').value : 30, 10) || 0;
    const ratePct = parseFloat(document.getElementById('dp-rate') ? document.getElementById('dp-rate').value : 6.5) || 0;

    if (price <= 0 || dpPct < 0 || termYears <= 0 || ratePct <= 0) {
      if (out) out.value = 'ERROR: Please enter valid positive values for property price, down payment, term, and interest rate.';
      return;
    }

    const downPaymentAmount = (price * dpPct) / 100;
    const loanAmount = price - downPaymentAmount;

    const n = termYears * 12;
    const r = ratePct / 100 / 12;
    const monthlyEMI = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayments = monthlyEMI * n;
    const totalInterest = totalPayments - loanAmount;

    let res = `--- DOWN PAYMENT & MORTGAGE CALCULATOR ---nn`;
    res += `Purchase Price:       $${price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}n`;
    res += `Down Payment Rate:    ${dpPct}%n`;
    res += `Interest Rate:        ${ratePct}%n`;
    res += `Loan Term:            ${termYears} Years (${n} Months)nn`;

    res += `=== CASH & LOAN BREAKDOWN ===n`;
    res += `Upfront Down Payment: $${downPaymentAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}n`;
    res += `Total Loan Amount:    $${loanAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}nn`;

    res += `=== MONTHLY & TOTAL COST ===n`;
    res += `Monthly EMI Payment:  $${monthlyEMI.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}n`;
    res += `Total Loan Interest:  $${totalInterest.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}n`;
    res += `Total Cost of Home:   $${(price + totalInterest).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}nn`;

    res += `--- DOWN PAYMENT SCENARIOS ---n`;
    [10, 15, 20, 25].forEach(pct => {
      const dpAmt = (price * pct) / 100;
      const lAmt = price - dpAmt;
      const emi = (lAmt * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      res += `${pct}% Down ($${dpAmt.toLocaleString()}) => Loan: $${lAmt.toLocaleString()} | EMI: $${emi.toFixed(2)}/mon`;
    });

    if (out) out.value = res;
    if (window.showToast) window.showToast('Down payment breakdown generated!', 'success');
  }

  const activeBtn = document.getElementById('calc-dp-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
