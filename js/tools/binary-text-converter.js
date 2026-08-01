/**
 * Binary Text Converter Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('bin-text-input')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input Text or Binary (e.g. 01001000 01101001):</label>
        <textarea id="bin-text-input" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">Hello</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-bin-text-btn" class="btn btn-primary flex-1">⚡ Convert Text ↔ Binary</button>
      </div>
    `;
  }

  function textToBinary(str) {
    return str.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
  }

  function binaryToText(binStr) {
    return binStr.trim().split(/s+/).map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
  }

  function calculate() {
    const val = document.getElementById('bin-text-input') ? document.getElementById('bin-text-input').value.trim() : '';

    if (!val) {
      if (out) out.value = 'ERROR: Please enter text or binary data.';
      return;
    }

    const isBinary = /^[01s]+$/.test(val) && val.length >= 8;

    let res = '--- BINARY ↔ TEXT CONVERTER ---nn';
    if (isBinary) {
      const convertedText = binaryToText(val);
      res += `Input (Binary):n${val}nn`;
      res += `Converted Text Output:n${convertedText}n`;
    } else {
      const convertedBinary = textToBinary(val);
      res += `Input (Text):n${val}nn`;
      res += `Converted 8-bit Binary Output:n${convertedBinary}n`;
    }

    if (out) out.value = res;
    if (window.showToast) window.showToast('Binary conversion complete!', 'success');
  }

  const activeBtn = document.getElementById('calc-bin-text-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
