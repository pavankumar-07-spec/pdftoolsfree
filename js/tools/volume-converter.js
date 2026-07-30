/**
 * Volume Converter Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  const units = { L: 1, mL: 1000, 'm³': 0.001, 'cm³': 1000, 'ft³': 0.0353147, 'in³': 61.0237, gallon: 0.264172, 'gallon(UK)': 0.219969, pint: 2.11338, cup: 4.22675, tablespoon: 67.628, teaspoon: 202.884 };

  if (inputsContainer && !document.getElementById('vol-value')) {
    const unitOpts = Object.keys(units).map(u => `<option value="${u}">${u}</option>`).join('');
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">From Unit:</label>
          <select id="vol-from" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">${unitOpts}</select>
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Value:</label>
          <input type="number" id="vol-value" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="1">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-vol-btn" class="btn btn-primary flex-1">🔄 Convert Volume</button>
      </div>
    `;
  }

  function calculate() {
    const from = document.getElementById('vol-from')?.value || 'L';
    const val = parseFloat(document.getElementById('vol-value')?.value || 1);
    if (isNaN(val)) { if (out) out.value = 'ERROR: Enter a valid number.'; return; }
    const baseVal = val / units[from];
    let res = `--- VOLUME CONVERTER ---nnInput: ${val} ${from}nn`;
    Object.entries(units).forEach(([u, factor]) => {
      res += `${u.padEnd(14)}: ${(baseVal * factor).toFixed(6)}n`;
    });
    if (out) out.value = res;
    if (window.showToast) window.showToast('Volume conversion complete!', 'success');
  }

  const activeBtn = document.getElementById('calc-vol-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
