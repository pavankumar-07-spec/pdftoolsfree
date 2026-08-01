/**
 * SVG Compressor Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('sc-svg')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input SVG Markup:</label>
        <textarea id="sc-svg" class="form-input" style="width:100%;height:120px;padding:0.5rem;font-family:monospace;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)"><!-- Created with Inkscape -->n<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">n  <rect x="10" y="10" width="80" height="80" fill="#007ACC"/>n</svg></textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-sc-btn" class="btn btn-primary flex-1">⚡ Compress SVG</button>
      </div>
    `;
  }

  function compressSVG(svg) {
    return svg
      .replace(/<!--[sS]*?-->/g, '') // Strip comments
      .replace(/>s+</g, '><')          // Remove whitespace between tags
      .replace(/s{2,}/g, ' ')         // Collapse whitespace
      .trim();
  }

  function calculate() {
    const rawSvg = document.getElementById('sc-svg') ? document.getElementById('sc-svg').value : (document.getElementById('text-input') ? document.getElementById('text-input').value : '');

    if (!rawSvg.trim()) {
      if (out) out.value = 'ERROR: Please enter SVG code to compress.';
      return;
    }

    const minified = compressSVG(rawSvg);
    const origSize = new Blob([rawSvg]).size;
    const minSize = new Blob([minified]).size;
    const savedPct = origSize > 0 ? (((origSize - minSize) / origSize) * 100).toFixed(1) : 0;

    let res = `<!-- COMPRESSED SVG (Original: ${origSize}b, Compressed: ${minSize}b, Saved: ${savedPct}%) -->n`;
    res += minified;

    if (out) out.value = res;
    if (window.showToast) window.showToast(`SVG compressed by ${savedPct}%!`, 'success');
  }

  const activeBtn = document.getElementById('calc-sc-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
