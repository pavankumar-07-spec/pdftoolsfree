/**
 * Data Size Converter Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  const units = { bit: 1, byte: 8, KB: 8192, MB: 8388608, GB: 8589934592, TB: 8796093022208, KiB: 8192, MiB: 8388608, GiB: 8589934592 };

  if (inputsContainer && !document.getElementById('ds-value')) {
    const unitOpts = Object.keys(units).map(u => `<option value="${u}">${u}</option>`).join('');
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">From Unit:</label>
          <select id="ds-from" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">${unitOpts}</select>
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Value:</label>
          <input type="number" id="ds-value" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="1">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-ds-btn" class="btn btn-primary flex-1">🔄 Convert Data Size</button>
      </div>
    `;
  }

  function calculate() {
    const from = document.getElementById('ds-from')?.value || 'GB';
    const val = parseFloat(document.getElementById('ds-value')?.value || 1);
    if (isNaN(val)) { if (out) out.value = 'ERROR: Enter a valid number.'; return; }
    const bits = val * units[from];
    let res = `--- DATA SIZE CONVERTER ---nnInput: ${val} ${from}nn`;
    Object.entries(units).forEach(([u, factor]) => {
      res += `${u.padEnd(6)}: ${(bits / factor).toFixed(6)}n`;
    });
    if (out) out.value = res;
    if (window.showToast) window.showToast('Data size conversion complete!', 'success');
  }

  const activeBtn = document.getElementById('calc-ds-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
