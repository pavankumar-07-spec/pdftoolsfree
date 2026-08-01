/**
 * Decimal ↔ Hexadecimal Converter Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('dechex-input')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Enter Decimal or Hexadecimal Value (e.g. 4096 or 0x1000):</label>
        <input type="text" id="dechex-input" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="255">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-dechex-btn" class="btn btn-primary flex-1">⚡ Convert Decimal ↔ Hex</button>
      </div>
    `;
  }

  function calculate() {
    const val = (document.getElementById('dechex-input')?.value || '').trim();

    if (!val) {
      if (out) out.value = 'ERROR: Please enter a number.';
      return;
    }

    let res = '--- DECIMAL ↔ HEXADECIMAL CONVERTER ---nn';

    if (/^(0x)?[0-9a-fA-F]+$/.test(val) && (val.startsWith('0x') || val.startsWith('0X') || /[a-fA-F]/.test(val))) {
      const hexClean = val.replace(/^0x/i, '');
      const dec = parseInt(hexClean, 16);
      res += `Input (Hexadecimal): 0x${hexClean.toUpperCase()}nn`;
      res += `Decimal Output: ${dec}n`;
      res += `Binary Output: ${dec.toString(2)}n`;
    } else if (/^d+$/.test(val)) {
      const dec = parseInt(val, 10);
      const hex = dec.toString(16).toUpperCase();
      res += `Input (Decimal): ${dec}nn`;
      res += `Hexadecimal Output: 0x${hex}n`;
      res += `Binary Output: ${dec.toString(2)}n`;
    } else {
      res += 'ERROR: Invalid input format.';
    }

    if (out) out.value = res;
    if (window.showToast) window.showToast('Decimal-Hex conversion complete!', 'success');
  }

  const activeBtn = document.getElementById('calc-dechex-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
