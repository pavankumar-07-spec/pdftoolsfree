/**
 * Binary ↔ Decimal Converter Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('bindec-input')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Enter Number (Decimal or Binary):</label>
        <input type="text" id="bindec-input" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="255">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-bindec-btn" class="btn btn-primary flex-1">🔄 Convert Binary ↔ Decimal</button>
      </div>
    `;
  }

  function calculate() {
    const val = (document.getElementById('bindec-input')?.value || '').trim();

    if (!val) {
      if (out) out.value = 'ERROR: Please enter a number.';
      return;
    }

    let res = '--- BINARY ↔ DECIMAL CONVERTER ---nn';

    if (/^[01]+$/.test(val)) {
      const dec = parseInt(val, 2);
      const hex = dec.toString(16).toUpperCase();
      res += `Input (Binary): ${val}nn`;
      res += `Decimal (Base 10): ${dec}n`;
      res += `Hexadecimal (Base 16): 0x${hex}n`;
      res += `Octal (Base 8): 0o${dec.toString(8)}n`;
    } else if (/^d+$/.test(val)) {
      const dec = parseInt(val, 10);
      const bin = dec.toString(2);
      const hex = dec.toString(16).toUpperCase();
      res += `Input (Decimal): ${dec}nn`;
      res += `Binary (Base 2): ${bin}n`;
      res += `Hexadecimal (Base 16): 0x${hex}n`;
      res += `Octal (Base 8): 0o${dec.toString(8)}n`;
    } else {
      res += 'ERROR: Input must be a valid non-negative integer or binary string.';
    }

    if (out) out.value = res;
    if (window.showToast) window.showToast('Radix conversion complete!', 'success');
  }

  const activeBtn = document.getElementById('calc-bindec-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
