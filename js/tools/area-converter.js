/**
 * Area Converter Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  const units = { 'm²': 1, 'km²': 1e-6, 'cm²': 1e4, 'mm²': 1e6, 'ft²': 10.7639, 'in²': 1550.0031, 'yd²': 1.19599, acre: 0.000247105, hectare: 1e-4 };

  if (inputsContainer && !document.getElementById('area-value')) {
    const unitOpts = Object.keys(units).map(u => `<option value="${u}">${u}</option>`).join('');
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">From Unit:</label>
          <select id="area-from" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">${unitOpts}</select>
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Value:</label>
          <input type="number" id="area-value" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="1">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-area-btn" class="btn btn-primary flex-1">🔄 Convert Area</button>
      </div>
    `;
  }

  function calculate() {
    const from = document.getElementById('area-from')?.value || 'm²';
    const val = parseFloat(document.getElementById('area-value')?.value || 1);
    if (isNaN(val)) { if (out) out.value = 'ERROR: Enter a valid number.'; return; }
    const baseVal = val / units[from];
    let res = `--- AREA CONVERTER ---nnInput: ${val} ${from}nn`;
    Object.entries(units).forEach(([u, factor]) => {
      res += `${u.padEnd(12)}: ${(baseVal * factor).toExponential(6)}n`;
    });
    if (out) out.value = res;
    if (window.showToast) window.showToast('Area conversion complete!', 'success');
  }

  const activeBtn = document.getElementById('calc-area-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
