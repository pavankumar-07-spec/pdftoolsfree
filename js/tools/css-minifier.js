/**
 * CSS Minifier Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('css-min-src')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Enter CSS Code:</label>
        <textarea id="css-min-src" class="form-input" style="width:100%;height:140px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text);font-family:monospace">body {n  margin: 0;n  padding: 0;n  background: #ffffff;n}n.container {n  max-width: 1200px;n}</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-cssmin-btn" class="btn btn-primary flex-1">⚡ Minify CSS</button>
      </div>
    `;
  }

  function calculate() {
    const raw = (document.getElementById('css-min-src')?.value || '').trim();

    if (!raw) {
      if (out) out.value = '';
      return;
    }

    const minified = raw
      .replace(/\/\*[\s\S]*?\*\//g, '') // remove comments
      .replace(/s+/g, ' ')
      .replace(/s*([{}:;,])s*/g, '$1')
      .replace(/;}/g, '}')
      .trim();

    const origBytes = new Blob([raw]).size;
    const minBytes = new Blob([minified]).size;
    const savings = (((origBytes - minBytes) / origBytes) * 100).toFixed(1);

    let res = `/* Minified CSS (Saved ${savings}% - ${origBytes}B -> ${minBytes}B) */n`;
    res += minified;

    if (out) out.value = res;
    if (window.showToast) window.showToast(`CSS Minified! Saved ${savings}%`, 'success');
  }

  const activeBtn = document.getElementById('calc-cssmin-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
