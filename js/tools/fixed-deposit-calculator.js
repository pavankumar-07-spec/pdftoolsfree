/**
 * Fixed Deposit Calculator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('fd-principal')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Deposit Amount (₹):</label>
          <input type="number" id="fd-principal" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="200000">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Annual Interest Rate (%):</label>
          <input type="number" id="fd-rate" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="7.5">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Tenure (Years):</label>
          <input type="number" id="fd-years" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="3">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Compounding:</label>
          <select id="fd-freq" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
            <option value="4" selected>Quarterly</option>
            <option value="12">Monthly</option>
            <option value="1">Annually</option>
          </select>
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-fd-btn" class="btn btn-primary flex-1">🏦 Calculate FD Maturity</button>
      </div>
    `;
  }

  function calculate() {
    const P = parseFloat(document.getElementById('fd-principal')?.value || 0);
    const r = parseFloat(document.getElementById('fd-rate')?.value || 0) / 100;
    const t = parseFloat(document.getElementById('fd-years')?.value || 0);
    const n = parseInt(document.getElementById('fd-freq')?.value || 4);

    if (P <= 0 || r <= 0 || t <= 0) {
      if (out) out.value = 'ERROR: Enter valid positive values.'; return;
    }

    const A = P * Math.pow(1 + r / n, n * t);
    const interest = A - P;

    let res = '--- FIXED DEPOSIT CALCULATOR ---nn';
    res += `Deposit Amount: ₹${P.toLocaleString('en-IN', { minimumFractionDigits: 2 })}n`;
    res += `Annual Rate: ${(r * 100).toFixed(2)}%n`;
    res += `Tenure: ${t} year(s)nn`;
    res += `Maturity Amount: ₹${A.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}n`;
    res += `Total Interest Earned: ₹${interest.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}n`;
    res += `Effective Annual Yield: ${((Math.pow(1 + r/n, n) - 1) * 100).toFixed(4)}%n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('FD maturity calculated!', 'success');
  }

  const activeBtn = document.getElementById('calc-fd-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
