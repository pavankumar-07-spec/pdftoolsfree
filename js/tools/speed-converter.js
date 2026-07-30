/**
 * Speed Converter Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  const units = { 'km/h': 1, 'm/s': 0.277778, mph: 0.621371, knot: 0.539957, 'ft/s': 0.911344, 'Mach': 0.000816 };

  if (inputsContainer && !document.getElementById('spd-value')) {
    const unitOpts = Object.keys(units).map(u => `<option value="${u}">${u}</option>`).join('');
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">From Unit:</label>
          <select id="spd-from" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">${unitOpts}</select>
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Value:</label>
          <input type="number" id="spd-value" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="100">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-spd-btn" class="btn btn-primary flex-1">🔄 Convert Speed</button>
      </div>
    `;
  }

  function calculate() {
    const from = document.getElementById('spd-from')?.value || 'km/h';
    const val = parseFloat(document.getElementById('spd-value')?.value || 100);
    if (isNaN(val)) { if (out) out.value = 'ERROR: Enter a valid number.'; return; }
    const baseVal = val / units[from];
    let res = `--- SPEED CONVERTER ---nnInput: ${val} ${from}nn`;
    Object.entries(units).forEach(([u, factor]) => {
      res += `${u.padEnd(8)}: ${(baseVal * factor).toFixed(6)}n`;
    });
    if (out) out.value = res;
    if (window.showToast) window.showToast('Speed conversion complete!', 'success');
  }

  const activeBtn = document.getElementById('calc-spd-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
