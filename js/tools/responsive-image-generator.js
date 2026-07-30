/**
 * Responsive Image HTML Markup Generator Engine (<picture> & srcset)
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('rig-src')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Base Image URL / File Name:</label>
        <input type="text" id="rig-src" class="form-input" value="hero-banner.jpg" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Alt Text:</label>
        <input type="text" id="rig-alt" class="form-input" value="Responsive Hero Banner" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-rig-btn" class="btn btn-primary flex-1">🖼️ Generate Responsive Image HTML</button>
      </div>
    `;
  }

  function calculate() {
    const src = document.getElementById('rig-src') ? document.getElementById('rig-src').value.trim() : 'hero-banner.jpg';
    const alt = document.getElementById('rig-alt') ? document.getElementById('rig-alt').value.trim() : 'Responsive Image';

    const baseName = src.replace(/.[^/.]+$/, "");
    const ext = src.split('.').pop() || 'jpg';

    let html = `<!-- Responsive Image HTML5 <picture> Element -->n`;
    html += `<picture>n`;
    html += `  <source media="(min-width: 1200px)" srcset="${baseName}-xl.webp 1200w" type="image/webp">n`;
    html += `  <source media="(min-width: 768px)" srcset="${baseName}-md.webp 768w" type="image/webp">n`;
    html += `  <source srcset="${baseName}-sm.webp 480w" type="image/webp">n`;
    html += `  <img src="${src}" alt="${alt}" loading="lazy" decoding="async" width="1200" height="630" class="img-fluid">n`;
    html += `</picture>`;

    if (out) out.value = html;
    if (window.showToast) window.showToast('Responsive image HTML generated!', 'success');
  }

  const activeBtn = document.getElementById('calc-rig-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
