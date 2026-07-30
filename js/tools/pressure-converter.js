/**
 * Pressure Converter Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  const units = { Pa: 1, kPa: 0.001, MPa: 1e-6, bar: 1e-5, atm: 9.86923e-6, psi: 0.000145038, mmHg: 0.00750062 };

  if (inputsContainer && !document.getElementById('pres-value')) {
    const unitOpts = Object.keys(units).map(u => `<option value="${u}">${u}</option>`).join('');
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">From Unit:</label>
          <select id="pres-from" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">${unitOpts}</select>
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Value:</label>
          <input type="number" id="pres-value" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="1">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-pres-btn" class="btn btn-primary flex-1">🔄 Convert Pressure</button>
      </div>
    `;
  }

  function calculate() {
    const from = document.getElementById('pres-from')?.value || 'Pa';
    const val = parseFloat(document.getElementById('pres-value')?.value || 1);
    if (isNaN(val)) { if (out) out.value = 'ERROR: Enter a valid number.'; return; }
    const baseVal = val / units[from];
    let res = `--- PRESSURE CONVERTER ---nnInput: ${val} ${from}nn`;
    Object.entries(units).forEach(([u, factor]) => {
      res += `${u.padEnd(8)}: ${(baseVal * factor).toExponential(6)}n`;
    });
    if (out) out.value = res;
    if (window.showToast) window.showToast('Pressure conversion complete!', 'success');
  }

  const activeBtn = document.getElementById('calc-pres-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
