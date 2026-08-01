/**
 * Energy Converter Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  const units = { J: 1, kJ: 0.001, MJ: 1e-6, cal: 0.239006, kcal: 0.000239006, Wh: 0.000277778, kWh: 2.77778e-7, BTU: 0.000947817, eV: 6.242e18 };

  if (inputsContainer && !document.getElementById('en-value')) {
    const unitOpts = Object.keys(units).map(u => `<option value="${u}">${u}</option>`).join('');
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">From Unit:</label>
          <select id="en-from" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">${unitOpts}</select>
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Value:</label>
          <input type="number" id="en-value" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="1000">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-en-btn" class="btn btn-primary flex-1">🔄 Convert Energy</button>
      </div>
    `;
  }

  function calculate() {
    const from = document.getElementById('en-from')?.value || 'J';
    const val = parseFloat(document.getElementById('en-value')?.value || 1000);
    if (isNaN(val)) { if (out) out.value = 'ERROR: Enter a valid number.'; return; }
    const baseVal = val / units[from];
    let res = `--- ENERGY CONVERTER ---nnInput: ${val} ${from}nn`;
    Object.entries(units).forEach(([u, factor]) => {
      res += `${u.padEnd(8)}: ${(baseVal * factor).toExponential(6)}n`;
    });
    if (out) out.value = res;
    if (window.showToast) window.showToast('Energy conversion complete!', 'success');
  }

  const activeBtn = document.getElementById('calc-en-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
