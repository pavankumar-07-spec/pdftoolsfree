document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('js-src')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Enter JavaScript Code:</label>
        <textarea id="js-src" class="form-input" style="width:100%;height:140px;padding:0.5rem;font-family:monospace;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">function greet(name) {\n  console.log("Hello, " + name);\n}</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-jsmin-btn" class="btn btn-primary flex-1">⚡ Minify JavaScript</button>
      </div>
    `;
  }

  function minifyJS(code) {
    return code
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/[^\n]*/g, '')
      .replace(/\s*([{}();,=+\-*\/><&|])\s*/g, '$1')
      .trim();
  }

  function calculate() {
    const raw = (document.getElementById('js-src')?.value || '').trim();
    if (!raw) return;

    const minified = minifyJS(raw);
    if (out) out.value = minified;
    if (window.showToast) window.showToast('JS Minified!', 'success');
  }

  const activeBtn = document.getElementById('calc-jsmin-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
