/**
 * Upgraded CAGR Growth Calculator Engine with Visual Breakdown Cards
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('cagr-initial')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:1rem;margin-bottom:1.5rem">
        <div>
          <label class="form-label">Initial Investment Value ($)</label>
          <input type="number" id="cagr-initial" class="form-input" value="10000" min="1" step="500">
        </div>
        <div>
          <label class="form-label">Final Value ($)</label>
          <input type="number" id="cagr-final" class="form-input" value="25000" min="1" step="500">
        </div>
        <div>
          <label class="form-label">Investment Duration (Years)</label>
          <input type="number" id="cagr-years" class="form-input" value="5" min="1" max="50">
        </div>
      </div>
      <div class="flex gap-3 mt-4">
        <button id="calc-cagr-btn" type="button" class="btn btn-primary flex-1">📈 Calculate CAGR & Growth Multiplier</button>
      </div>
    `;
  }

  function calculateCAGR() {
    const V0 = parseFloat(document.getElementById('cagr-initial')?.value || 10000);
    const Vn = parseFloat(document.getElementById('cagr-final')?.value || 25000);
    const n = parseFloat(document.getElementById('cagr-years')?.value || 5);

    const cagr = (Math.pow(Vn / V0, 1 / n) - 1) * 100;
    const totalProfit = Vn - V0;
    const totalGrowthPct = ((Vn - V0) / V0) * 100;
    const multiplier = (Vn / V0).toFixed(2);

    let res = `==========================================================
             CAGR ANNUAL GROWTH RATE REPORT
==========================================================
Initial Investment:      $${V0.toLocaleString('en-US', { minimumFractionDigits: 2 })}
Final Portfolio Value:   $${Vn.toLocaleString('en-US', { minimumFractionDigits: 2 })}
Duration:                ${n} Years

==========================================================
GROWTH METRICS:
CAGR (Annualized):       ${cagr.toFixed(2)}% per annum
Absolute Total Profit:   $${totalProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
Total Return %:          +${totalGrowthPct.toFixed(2)}%
Capital Multiplier:      ${multiplier}x Return
==========================================================`;

    if (out) out.value = res;

    // Render Visual Breakdown Dashboard Card
    const resultsCard = document.getElementById('gen-results-card');
    if (resultsCard) {
      resultsCard.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:1rem;text-align:center">
          <div style="background:var(--surface-2);padding:1rem;border-radius:var(--radius-sm);border:1px solid var(--border)">
            <div style="font-size:0.8rem;color:var(--text-secondary)">Annualized CAGR</div>
            <div style="font-size:2rem;font-weight:800;color:#22c55e">${cagr.toFixed(2)}%</div>
            <div style="font-size:0.75rem;color:var(--text-secondary)">Compounded Yearly Rate</div>
          </div>
          <div style="background:var(--surface-2);padding:1rem;border-radius:var(--radius-sm);border:1px solid var(--border)">
            <div style="font-size:0.8rem;color:var(--text-secondary)">Total Return</div>
            <div style="font-size:1.6rem;font-weight:700;color:var(--primary)">+$${totalProfit.toLocaleString()}</div>
            <div style="font-size:0.75rem;color:var(--text-secondary)">+${totalGrowthPct.toFixed(0)}% Absolute Return</div>
          </div>
          <div style="background:var(--surface-2);padding:1rem;border-radius:var(--radius-sm);border:1px solid var(--border)">
            <div style="font-size:0.8rem;color:var(--text-secondary)">Capital Multiplier</div>
            <div style="font-size:1.8rem;font-weight:800;color:#3b82f6">${multiplier}x</div>
            <div style="font-size:0.75rem;color:var(--text-secondary)">Growth Factor</div>
          </div>
        </div>
      `;
    }

    if (window.showToast) window.showToast(`CAGR: ${cagr.toFixed(2)}% per annum`, 'success');
  }

  const activeBtn = document.getElementById('calc-cagr-btn') || btn;
  if (activeBtn) activeBtn.onclick = () => calculateCAGR();
  calculateCAGR();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
