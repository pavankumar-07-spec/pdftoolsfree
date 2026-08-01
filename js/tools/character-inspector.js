/**
 * Character Inspector Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('ci-char')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input Characters / String:</label>
        <input type="text" id="ci-char" class="form-input" value="A € 🚀 ✨ 𝄞" style="width:100%;padding:0.5rem;font-size:1.2rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-ci-btn" class="btn btn-primary flex-1">🔍 Inspect Unicode Characters</button>
      </div>
    `;
  }

  function calculate() {
    const str = document.getElementById('ci-char') ? document.getElementById('ci-char').value : '';

    if (!str) {
      if (out) out.value = 'ERROR: Please enter characters to inspect.';
      return;
    }

    let res = `--- CHARACTER INSPECTOR REPORT ---nn`;
    res += `Input String: "${str}"n`;
    res += `Total Code Points: ${Array.from(str).length}nn`;

    res += `=== CODE POINT BREAKDOWN ===n`;
    Array.from(str).forEach((char, idx) => {
      const codePoint = char.codePointAt(0);
      const hex = 'U+' + codePoint.toString(16).toUpperCase().padStart(4, '0');
      const htmlEntity = `&#${codePoint};`;
      res += `${idx + 1}. Char: "${char}" | Hex: ${hex} | Decimal: ${codePoint} | HTML: ${htmlEntity}n`;
    });

    if (out) out.value = res;
    if (window.showToast) window.showToast('Characters inspected!', 'success');
  }

  const activeBtn = document.getElementById('calc-ci-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
