/**
 * Meta Tag Generator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('meta-title')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Site Title:</label>
        <input type="text" id="meta-title" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="Free Online PDF & Developer Tools | FreeToolsPDF">
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Site Description:</label>
        <textarea id="meta-desc" class="form-input" style="width:100%;height:60px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">407+ free online tools for PDF processing, B.Tech engineering math, converters, and developer utilities. 100% client-side privacy.</textarea>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Keywords (comma separated):</label>
          <input type="text" id="meta-keys" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="pdf tools, online calculators, matrix solver, converters">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Author:</label>
          <input type="text" id="meta-author" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="FreeToolsPDF">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-meta-btn" class="btn btn-primary flex-1">🏷️ Generate HTML Meta Tags</button>
      </div>
    `;
  }

  function calculate() {
    const title = (document.getElementById('meta-title')?.value || '').trim();
    const desc = (document.getElementById('meta-desc')?.value || '').trim();
    const keys = (document.getElementById('meta-keys')?.value || '').trim();
    const author = (document.getElementById('meta-author')?.value || '').trim();

    let res = '<!-- HTML Meta Tags -->n';
    res += `<title>${title}</title>n`;
    res += `<meta name="title" content="${title}">n`;
    res += `<meta name="description" content="${desc}">n`;
    if (keys) res += `<meta name="keywords" content="${keys}">n`;
    if (author) res += `<meta name="author" content="${author}">n`;
    res += `<meta name="viewport" content="width=device-width, initial-scale=1.0">nn`;

    res += '<!-- Open Graph / Facebook -->n';
    res += `<meta property="og:type" content="website">n`;
    res += `<meta property="og:title" content="${title}">n`;
    res += `<meta property="og:description" content="${desc}">nn`;

    res += '<!-- Twitter -->n';
    res += `<meta property="twitter:card" content="summary_large_image">n`;
    res += `<meta property="twitter:title" content="${title}">n`;
    res += `<meta property="twitter:description" content="${desc}">n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Meta tags generated!', 'success');
  }

  const activeBtn = document.getElementById('calc-meta-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
