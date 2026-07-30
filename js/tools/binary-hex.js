/**
 * Binary ↔ Hexadecimal Converter Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('binhex-input')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Enter Binary or Hex String (e.g. 11111111 or FF):</label>
        <input type="text" id="binhex-input" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="11010110">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-binhex-btn" class="btn btn-primary flex-1">⚡ Convert Binary ↔ Hex</button>
      </div>
    `;
  }

  function calculate() {
    const val = (document.getElementById('binhex-input')?.value || '').trim();

    if (!val) {
      if (out) out.value = 'ERROR: Please enter a binary or hex value.';
      return;
    }

    let res = '--- BINARY ↔ HEXADECIMAL CONVERTER ---nn';

    if (/^[01]+$/.test(val)) {
      const dec = parseInt(val, 2);
      const hex = dec.toString(16).toUpperCase();
      res += `Input (Binary): ${val}nn`;
      res += `Hexadecimal Output: 0x${hex}n`;
      res += `Decimal Value: ${dec}n`;
    } else if (/^(0x)?[0-9a-fA-F]+$/.test(val)) {
      const hexClean = val.replace(/^0x/i, '');
      const dec = parseInt(hexClean, 16);
      const bin = dec.toString(2).padStart(hexClean.length * 4, '0');
      res += `Input (Hexadecimal): 0x${hexClean.toUpperCase()}nn`;
      res += `Binary Output: ${bin}n`;
      res += `Decimal Value: ${dec}n`;
    } else {
      res += 'ERROR: Invalid format. Please enter binary (0s and 1s) or Hex (0-9, A-F).';
    }

    if (out) out.value = res;
    if (window.showToast) window.showToast('Binary-Hex conversion complete!', 'success');
  }

  const activeBtn = document.getElementById('calc-binhex-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
