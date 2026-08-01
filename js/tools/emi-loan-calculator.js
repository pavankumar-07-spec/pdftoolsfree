/**
 * Upgraded EMI Loan Calculator Engine with Visual Dashboard Breakdown Cards
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('emi-principal')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:1rem;margin-bottom:1.5rem">
        <div>
          <label class="form-label">Loan Amount ($)</label>
          <input type="number" id="emi-principal" class="form-input" value="500000" min="1000" step="1000">
        </div>
        <div>
          <label class="form-label">Interest Rate (% p.a.)</label>
          <input type="number" id="emi-rate" class="form-input" value="8.5" min="0.1" step="0.1">
        </div>
        <div>
          <label class="form-label">Loan Tenure (Months)</label>
          <input type="number" id="emi-tenure" class="form-input" value="60" min="1" max="360">
        </div>
      </div>
      <div class="flex gap-3 mt-4">
        <button id="calc-emi-btn" type="button" class="btn btn-primary flex-1">🏦 Calculate Monthly EMI & Interest Breakdown</button>
      </div>
    `;
  }

  function calculateEMI() {
    const P = parseFloat(document.getElementById('emi-principal')?.value || 500000);
    const rAnnual = parseFloat(document.getElementById('emi-rate')?.value || 8.5);
    const n = parseFloat(document.getElementById('emi-tenure')?.value || 60);

    const r = (rAnnual / 12) / 100;
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;
    const interestRatio = (totalInterest / totalPayment) * 100;

    let res = `==========================================================
                 EMI LOAN CALCULATOR SUMMARY
==========================================================
Principal Amount:        $${P.toLocaleString('en-US', { minimumFractionDigits: 2 })}
Interest Rate:           ${rAnnual.toFixed(2)}% per annum
Tenure Duration:         ${n} Months (${(n / 12).toFixed(1)} Years)

==========================================================
REPAYMENT BREAKDOWN:
Monthly EMI:             $${emi.toFixed(2)}
Total Interest Payable:  $${totalInterest.toFixed(2)}
Total Repayment Amount:  $${totalPayment.toFixed(2)}
Interest Share:          ${interestRatio.toFixed(1)}% of Total Repayment
==========================================================`;

    if (out) out.value = res;

    // Render Visual Breakdown Dashboard Card
    const resultsCard = document.getElementById('gen-results-card');
    if (resultsCard) {
      resultsCard.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:1rem;text-align:center">
          <div style="background:var(--surface-2);padding:1rem;border-radius:var(--radius-sm);border:1px solid var(--border)">
            <div style="font-size:0.8rem;color:var(--text-secondary)">Monthly EMI</div>
            <div style="font-size:2rem;font-weight:800;color:var(--primary)">$${emi.toFixed(2)}</div>
            <div style="font-size:0.75rem;color:var(--text-secondary)">Fixed Monthly Repayment</div>
          </div>
          <div style="background:var(--surface-2);padding:1rem;border-radius:var(--radius-sm);border:1px solid var(--border)">
            <div style="font-size:0.8rem;color:var(--text-secondary)">Total Interest</div>
            <div style="font-size:1.6rem;font-weight:700;color:#ef4444">$${totalInterest.toFixed(0)}</div>
            <div style="font-size:0.75rem;color:var(--text-secondary)">${interestRatio.toFixed(1)}% of total payout</div>
          </div>
          <div style="background:var(--surface-2);padding:1rem;border-radius:var(--radius-sm);border:1px solid var(--border)">
            <div style="font-size:0.8rem;color:var(--text-secondary)">Total Repayment</div>
            <div style="font-size:1.6rem;font-weight:700;color:var(--text)">$${totalPayment.toFixed(0)}</div>
            <div style="font-size:0.75rem;color:var(--text-secondary)">Principal + Interest</div>
          </div>
        </div>
      `;
    }

    if (window.showToast) window.showToast(`Monthly EMI: $${emi.toFixed(2)}`, 'success');
  }

  const activeBtn = document.getElementById('calc-emi-btn') || btn;
  if (activeBtn) activeBtn.onclick = () => calculateEMI();
  calculateEMI();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
