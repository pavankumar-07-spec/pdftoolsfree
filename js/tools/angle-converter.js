/**
 * Angle Converter Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  const units = { degree: 1, radian: Math.PI / 180, gradian: 10/9, 'arcminute': 60, 'arcsecond': 3600, turn: 1/360 };

  if (inputsContainer && !document.getElementById('ang-value')) {
    const unitOpts = Object.keys(units).map(u => `<option value="${u}">${u}</option>`).join('');
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">From Unit:</label>
          <select id="ang-from" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">${unitOpts}</select>
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Value:</label>
          <input type="number" id="ang-value" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="90">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-ang-btn" class="btn btn-primary flex-1">🔄 Convert Angle</button>
      </div>
    `;
  }

  function calculate() {
    const from = document.getElementById('ang-from')?.value || 'degree';
    const val = parseFloat(document.getElementById('ang-value')?.value || 90);
    if (isNaN(val)) { if (out) out.value = 'ERROR: Enter a valid number.'; return; }
    const deg = val / units[from];
    let res = `--- ANGLE CONVERTER ---nnInput: ${val} ${from}nn`;
    Object.entries(units).forEach(([u, factor]) => {
      res += `${u.padEnd(12)}: ${(deg * factor).toFixed(8)}n`;
    });
    if (out) out.value = res;
    if (window.showToast) window.showToast('Angle conversion complete!', 'success');
  }

  const activeBtn = document.getElementById('calc-ang-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
