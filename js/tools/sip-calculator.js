/**
 * Upgraded SIP Wealth Calculator Engine with Visual Dashboard Cards
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('sip-monthly')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:1rem;margin-bottom:1.5rem">
        <div>
          <label class="form-label">Monthly SIP Investment ($)</label>
          <input type="number" id="sip-monthly" class="form-input" value="5000" min="500" step="500">
        </div>
        <div>
          <label class="form-label">Expected Return Rate (% p.a.)</label>
          <input type="number" id="sip-rate" class="form-input" value="12" min="1" step="0.5">
        </div>
        <div>
          <label class="form-label">Investment Duration (Years)</label>
          <input type="number" id="sip-years" class="form-input" value="10" min="1" max="40">
        </div>
      </div>
      <div class="flex gap-3 mt-4">
        <button id="calc-sip-btn" type="button" class="btn btn-primary flex-1">📈 Calculate Wealth Accumulation</button>
      </div>
    `;
  }

  function calculateSIP() {
    const P = parseFloat(document.getElementById('sip-monthly')?.value || 5000);
    const rAnnual = parseFloat(document.getElementById('sip-rate')?.value || 12);
    const yrs = parseFloat(document.getElementById('sip-years')?.value || 10);

    const n = yrs * 12;
    const i = (rAnnual / 12) / 100;
    const totalWealth = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const totalInvested = P * n;
    const totalEstReturns = totalWealth - totalInvested;
    const growthMultiplier = (totalWealth / totalInvested).toFixed(2);

    let res = `==========================================================
              SIP WEALTH ACCUMULATION REPORT
==========================================================
Monthly Investment:      $${P.toLocaleString('en-US', { minimumFractionDigits: 2 })}
Expected Return Rate:    ${rAnnual.toFixed(1)}% per annum
Time Horizon:            ${yrs} Years (${n} Months)

==========================================================
WEALTH SUMMARY:
Total Amount Invested:   $${totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2 })}
Estimated Capital Gains: $${totalEstReturns.toLocaleString('en-US', { minimumFractionDigits: 2 })}
Total Wealth Corpus:     $${totalWealth.toLocaleString('en-US', { minimumFractionDigits: 2 })}
Wealth Multiplier:       ${growthMultiplier}x Return on Investment
==========================================================`;

    if (out) out.value = res;

    // Render Visual Breakdown Dashboard Card
    const resultsCard = document.getElementById('gen-results-card');
    if (resultsCard) {
      resultsCard.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:1rem;text-align:center">
          <div style="background:var(--surface-2);padding:1rem;border-radius:var(--radius-sm);border:1px solid var(--border)">
            <div style="font-size:0.8rem;color:var(--text-secondary)">Total Wealth Corpus</div>
            <div style="font-size:2rem;font-weight:800;color:#22c55e">$${Math.round(totalWealth).toLocaleString()}</div>
            <div style="font-size:0.75rem;color:var(--text-secondary);font-weight:700">${growthMultiplier}x Growth Multiplier</div>
          </div>
          <div style="background:var(--surface-2);padding:1rem;border-radius:var(--radius-sm);border:1px solid var(--border)">
            <div style="font-size:0.8rem;color:var(--text-secondary)">Invested Amount</div>
            <div style="font-size:1.6rem;font-weight:700;color:var(--primary)">$${totalInvested.toLocaleString()}</div>
            <div style="font-size:0.75rem;color:var(--text-secondary)">Principal Investment</div>
          </div>
          <div style="background:var(--surface-2);padding:1rem;border-radius:var(--radius-sm);border:1px solid var(--border)">
            <div style="font-size:0.8rem;color:var(--text-secondary)">Estimated Profit</div>
            <div style="font-size:1.6rem;font-weight:700;color:#3b82f6">$${Math.round(totalEstReturns).toLocaleString()}</div>
            <div style="font-size:0.75rem;color:var(--text-secondary)">Capital Appreciation</div>
          </div>
        </div>
      `;
    }

    if (window.showToast) window.showToast(`Total Wealth: $${Math.round(totalWealth).toLocaleString()}`, 'success');
  }

  const activeBtn = document.getElementById('calc-sip-btn') || btn;
  if (activeBtn) activeBtn.onclick = () => calculateSIP();
  calculateSIP();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
