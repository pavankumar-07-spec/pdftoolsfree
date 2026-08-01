/**
 * Upgraded Return on Investment (ROI) Calculator Engine with Visual Dashboard Cards
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('roi-initial')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:1rem;margin-bottom:1.5rem">
        <div>
          <label class="form-label">Initial Investment / Cost ($)</label>
          <input type="number" id="roi-initial" class="form-input" value="5000" min="1" step="500">
        </div>
        <div>
          <label class="form-label">Final Value / Revenue ($)</label>
          <input type="number" id="roi-final" class="form-input" value="8500" min="0" step="500">
        </div>
      </div>
      <div class="flex gap-3 mt-4">
        <button id="calc-roi-btn" type="button" class="btn btn-primary flex-1">📈 Calculate Return on Investment (ROI)</button>
      </div>
    `;
  }

  function calculateROI() {
    const V0 = parseFloat(document.getElementById('roi-initial')?.value || 5000);
    const Vn = parseFloat(document.getElementById('roi-final')?.value || 8500);

    const profit = Vn - V0;
    const roi = V0 > 0 ? (profit / V0) * 100 : 0;
    const multiplier = V0 > 0 ? (Vn / V0).toFixed(2) : '0';

    let res = `==========================================================
               RETURN ON INVESTMENT (ROI) REPORT
==========================================================
Initial Investment Cost: $${V0.toLocaleString('en-US', { minimumFractionDigits: 2 })}
Final Revenue / Value:   $${Vn.toLocaleString('en-US', { minimumFractionDigits: 2 })}

==========================================================
FINANCIAL PERFORMANCE:
Net Profit / Loss:       $${profit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
Return on Investment:    ${roi >= 0 ? '+' : ''}${roi.toFixed(2)}%
Return Multiplier:       ${multiplier}x Capital Return
==========================================================`;

    if (out) out.value = res;

    // Render Visual Breakdown Dashboard Card
    const resultsCard = document.getElementById('gen-results-card');
    if (resultsCard) {
      resultsCard.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:1rem;text-align:center">
          <div style="background:var(--surface-2);padding:1rem;border-radius:var(--radius-sm);border:1px solid var(--border)">
            <div style="font-size:0.8rem;color:var(--text-secondary)">ROI Percentage</div>
            <div style="font-size:2rem;font-weight:800;color:${roi >= 0 ? '#22c55e' : '#ef4444'}">${roi >= 0 ? '+' : ''}${roi.toFixed(2)}%</div>
            <div style="font-size:0.75rem;color:var(--text-secondary)">Return on Capital</div>
          </div>
          <div style="background:var(--surface-2);padding:1rem;border-radius:var(--radius-sm);border:1px solid var(--border)">
            <div style="font-size:0.8rem;color:var(--text-secondary)">Net Profit / Loss</div>
            <div style="font-size:1.6rem;font-weight:700;color:${profit >= 0 ? '#22c55e' : '#ef4444'}">${profit >= 0 ? '+$' : '-$'}${Math.abs(profit).toLocaleString()}</div>
            <div style="font-size:0.75rem;color:var(--text-secondary)">Absolute Capital Gain</div>
          </div>
          <div style="background:var(--surface-2);padding:1rem;border-radius:var(--radius-sm);border:1px solid var(--border)">
            <div style="font-size:0.8rem;color:var(--text-secondary)">Return Multiplier</div>
            <div style="font-size:1.8rem;font-weight:800;color:#3b82f6">${multiplier}x</div>
            <div style="font-size:0.75rem;color:var(--text-secondary)">Capital Ratio</div>
          </div>
        </div>
      `;
    }

    if (window.showToast) window.showToast(`ROI: ${roi >= 0 ? '+' : ''}${roi.toFixed(2)}%`, roi >= 0 ? 'success' : 'warning');
  }

  const activeBtn = document.getElementById('calc-roi-btn') || btn;
  if (activeBtn) activeBtn.onclick = () => calculateROI();
  calculateROI();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
