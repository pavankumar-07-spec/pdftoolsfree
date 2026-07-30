/**
 * HTML Minifier Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('hm-html')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input HTML Code:</label>
        <textarea id="hm-html" class="form-input" style="width:100%;height:140px;padding:0.5rem;font-family:monospace;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)"><!-- Page Header -->
<div class="header">
  <h1> Welcome to FreeToolsPDF </h1>
  <p> Fast, local, private client-side tools. </p>
</div></textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-hm-btn" class="btn btn-primary flex-1">⚡ Minify HTML Code</button>
      </div>
    `;
  }

  function minifyHTML(html) {
    return html
      // Remove HTML comments <!-- ... -->
      .replace(/<!--[sS]*?-->/g, '')
      // Collapse whitespace between tags
      .replace(/>s+</g, '><')
      // Collapse multiple whitespace inside tags/text to single space
      .replace(/s{2,}/g, ' ')
      // Trim leading and trailing whitespace
      .trim();
  }

  function calculate() {
    const rawHTML = document.getElementById('hm-html') ? document.getElementById('hm-html').value : (document.getElementById('text-input') ? document.getElementById('text-input').value : '');

    if (!rawHTML.trim()) {
      if (out) out.value = 'ERROR: Please enter HTML code to minify.';
      return;
    }

    const minified = minifyHTML(rawHTML);
    const origSize = new Blob([rawHTML]).size;
    const minSize = new Blob([minified]).size;
    const saved = Math.max(0, origSize - minSize);
    const savedPct = origSize > 0 ? ((saved / origSize) * 100).toFixed(1) : 0;

    let res = `<!-- MINIFIED HTML OUTPUT (Original: ${origSize}b, Minified: ${minSize}b, Saved: ${savedPct}%) -->n`;
    res += minified;

    if (out) out.value = res;
    if (window.showToast) window.showToast(`HTML Minified! Reduced size by ${savedPct}%`, 'success');
  }

  const activeBtn = document.getElementById('calc-hm-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
