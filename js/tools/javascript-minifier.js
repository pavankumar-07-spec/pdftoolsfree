document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('jm-code')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input JavaScript Code:</label>
        <textarea id="jm-code" class="form-input" style="width:100%;height:120px;padding:0.5rem;font-family:monospace;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">function calculateTotal(items) {\n  let sum = 0;\n  for (let i = 0; i < items.length; i++) {\n    sum += items[i].price;\n  }\n  return sum;\n}</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-jm-btn" class="btn btn-primary flex-1">⚡ Minify JS Code</button>
      </div>
    `;
  }

  function minifyJS(code) {
    return code
      .replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '$1')
      .replace(/\s+/g, ' ')
      .replace(/\s*([{}()=+\-*/;,:<>])\s*/g, '$1')
      .trim();
  }

  function calculate() {
    const rawCode = document.getElementById('jm-code') ? document.getElementById('jm-code').value : '';
    if (!rawCode.trim()) return;

    const minified = minifyJS(rawCode);
    if (out) out.value = minified;
    if (window.showToast) window.showToast('JS minified!', 'success');
  }

  const activeBtn = document.getElementById('calc-jm-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
