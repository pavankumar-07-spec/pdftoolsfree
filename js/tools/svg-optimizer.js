/**
 * SVG Optimizer Engine (Alias)
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('so-svg')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input SVG Code:</label>
        <textarea id="so-svg" class="form-input" style="width:100%;height:120px;padding:0.5rem;font-family:monospace;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)"><svg width="60" height="60"><circle cx="30" cy="30" r="25" fill="#22c55e"/></svg></textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-so-btn" class="btn btn-primary flex-1">⚡ Optimize SVG</button>
      </div>
    `;
  }

  function optimizeSVG(svg) {
    return svg
      .replace(/<!--[sS]*?-->/g, '')
      .replace(/>s+</g, '><')
      .replace(/s{2,}/g, ' ')
      .trim();
  }

  function calculate() {
    const rawSvg = document.getElementById('so-svg') ? document.getElementById('so-svg').value : (document.getElementById('text-input') ? document.getElementById('text-input').value : '');

    if (!rawSvg.trim()) {
      if (out) out.value = 'ERROR: Please enter SVG code.';
      return;
    }

    const optimized = optimizeSVG(rawSvg);

    if (out) out.value = optimized;
    if (window.showToast) window.showToast('SVG code optimized!', 'success');
  }

  const activeBtn = document.getElementById('calc-so-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
