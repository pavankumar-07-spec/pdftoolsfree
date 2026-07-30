/**
 * Power Converter Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  const units = { W: 1, kW: 0.001, MW: 1e-6, hp: 0.00134102, BTU_h: 3.41214, cal_s: 0.238846 };

  if (inputsContainer && !document.getElementById('pow-value')) {
    const unitOpts = Object.keys(units).map(u => `<option value="${u}">${u}</option>`).join('');
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">From Unit:</label>
          <select id="pow-from" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">${unitOpts}</select>
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Value:</label>
          <input type="number" id="pow-value" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="1000">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-pow-btn" class="btn btn-primary flex-1">🔄 Convert Power</button>
      </div>
    `;
  }

  function calculate() {
    const from = document.getElementById('pow-from')?.value || 'W';
    const val = parseFloat(document.getElementById('pow-value')?.value || 1000);
    if (isNaN(val)) { if (out) out.value = 'ERROR: Enter a valid number.'; return; }
    const baseVal = val / units[from];
    let res = `--- POWER CONVERTER ---nnInput: ${val} ${from}nn`;
    Object.entries(units).forEach(([u, factor]) => {
      res += `${u.padEnd(8)}: ${(baseVal * factor).toFixed(6)}n`;
    });
    if (out) out.value = res;
    if (window.showToast) window.showToast('Power conversion complete!', 'success');
  }

  const activeBtn = document.getElementById('calc-pow-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
