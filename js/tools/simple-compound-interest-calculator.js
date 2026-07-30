/**
 * Simple & Compound Interest Calculator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('sci-principal')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Principal (₹):</label>
          <input type="number" id="sci-principal" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="50000">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Rate (% p.a.):</label>
          <input type="number" id="sci-rate" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="10">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Time (Years):</label>
          <input type="number" id="sci-time" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="3">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-sci-btn" class="btn btn-primary flex-1">💵 Calculate Simple & Compound Interest</button>
      </div>
    `;
  }

  function calculate() {
    const P = parseFloat(document.getElementById('sci-principal')?.value || 0);
    const r = parseFloat(document.getElementById('sci-rate')?.value || 0) / 100;
    const t = parseFloat(document.getElementById('sci-time')?.value || 0);

    if (P <= 0 || r <= 0 || t <= 0) {
      if (out) out.value = 'ERROR: Enter valid positive values.'; return;
    }

    const si = P * r * t;
    const ciAmount = P * Math.pow(1 + r, t);
    const ci = ciAmount - P;

    let res = '--- SIMPLE vs COMPOUND INTEREST ---nn';
    res += `Principal: ₹${P.toLocaleString('en-IN', { minimumFractionDigits: 2 })}n`;
    res += `Rate: ${(r * 100).toFixed(2)}% p.a.n`;
    res += `Time: ${t} year(s)nn`;
    res += `SIMPLE INTEREST:n`;
    res += `  SI = P × R × T = ₹${si.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}n`;
    res += `  Total Amount = ₹${(P + si).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}nn`;
    res += `COMPOUND INTEREST (Annually):n`;
    res += `  CI = ₹${ci.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}n`;
    res += `  Total Amount = ₹${ciAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}nn`;
    res += `Extra Earned with CI: ₹${(ci - si).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Interest calculated!', 'success');
  }

  const activeBtn = document.getElementById('calc-sci-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
