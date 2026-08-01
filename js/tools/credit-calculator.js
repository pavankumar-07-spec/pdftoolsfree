/**
 * Credit Card & Loan Payoff Calculator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('cc-balance')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Current Credit Balance ($ / ₹):</label>
        <input type="number" id="cc-balance" class="form-input" value="5000" min="100" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Annual Interest Rate APR (%):</label>
          <input type="number" id="cc-apr" class="form-input" value="18" step="0.5" min="0" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Target Monthly Payment ($):</label>
          <input type="number" id="cc-payment" class="form-input" value="200" min="10" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-cc-btn" class="btn btn-primary flex-1">💳 Calculate Credit Payoff</button>
      </div>
    `;
  }

  function calculate() {
    const balance = parseFloat(document.getElementById('cc-balance') ? document.getElementById('cc-balance').value : 5000) || 0;
    const apr = parseFloat(document.getElementById('cc-apr') ? document.getElementById('cc-apr').value : 18) || 0;
    const monthlyPayment = parseFloat(document.getElementById('cc-payment') ? document.getElementById('cc-payment').value : 200) || 0;

    if (balance <= 0 || apr < 0 || monthlyPayment <= 0) {
      if (out) out.value = 'ERROR: Please enter valid positive values for balance, APR, and monthly payment.';
      return;
    }

    const monthlyRate = apr / 100 / 12;
    const minInterestFirstMonth = balance * monthlyRate;

    if (monthlyPayment <= minInterestFirstMonth) {
      if (out) out.value = `ERROR: Monthly payment ($${monthlyPayment.toFixed(2)}) is less than or equal to monthly interest ($${minInterestFirstMonth.toFixed(2)}). You will NEVER pay off this debt with this payment amount!`;
      return;
    }

    let currentBalance = balance;
    let totalInterest = 0;
    let months = 0;

    while (currentBalance > 0 && months < 600) {
      months++;
      const interestForMonth = currentBalance * monthlyRate;
      totalInterest += interestForMonth;
      const principalPaid = Math.min(currentBalance, monthlyPayment - interestForMonth);
      currentBalance -= principalPaid;
    }

    const totalPaid = balance + totalInterest;

    let res = `--- CREDIT CARD / LOAN PAYOFF CALCULATOR ---nn`;
    res += `Starting Balance:        $${balance.toFixed(2)}n`;
    res += `Annual Interest Rate:    ${apr.toFixed(2)}%n`;
    res += `Monthly Payment:         $${monthlyPayment.toFixed(2)}nn`;

    res += `=== PAYOFF SUMMARY ===n`;
    res += `Time to Pay Off:         ${months} Months (${(months / 12).toFixed(1)} Years)n`;
    res += `Total Interest Paid:     $${totalInterest.toFixed(2)}n`;
    res += `Total Amount Paid:       $${totalPaid.toFixed(2)}n`;
    res += `Interest % of Principal: ${((totalInterest / balance) * 100).toFixed(1)}%nn`;

    res += `💡 TIP: Increasing your monthly payment by 20% would significantly reduce total interest paid.`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Credit payoff calculated!', 'success');
  }

  const activeBtn = document.getElementById('calc-cc-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
