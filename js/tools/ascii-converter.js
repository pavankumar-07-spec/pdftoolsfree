/**
 * ASCII Converter Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('ascii-input')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input Text / ASCII Code:</label>
        <textarea id="ascii-input" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">Hello World</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-ascii-btn" class="btn btn-primary flex-1">🔤 Convert ASCII</button>
      </div>
    `;
  }

  function calculate() {
    const text = document.getElementById('ascii-input') ? document.getElementById('ascii-input').value : '';

    if (!text) {
      if (out) out.value = 'ERROR: Please enter text to convert.';
      return;
    }

    const decimalCodes = [];
    const hexCodes = [];
    const binaryCodes = [];

    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      decimalCodes.push(code);
      hexCodes.push(code.toString(16).toUpperCase().padStart(2, '0'));
      binaryCodes.push(code.toString(2).padStart(8, '0'));
    }

    let res = '--- ASCII CONVERSION RESULTS ---nn';
    res += `Input Text: "${text}"nn`;
    res += `ASCII Decimal Codes:n${decimalCodes.join(' ')}nn`;
    res += `ASCII Hexadecimal Codes:n${hexCodes.join(' ')}nn`;
    res += `ASCII Binary Codes:n${binaryCodes.join(' ')}n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('ASCII conversion complete!', 'success');
  }

  const activeBtn = document.getElementById('calc-ascii-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
