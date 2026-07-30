/**
 * Twitter / X Card Meta Tag Generator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('tc-card-type')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">twitter:card (Card Format):</label>
          <select id="tc-card-type" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
            <option value="summary_large_image">summary_large_image (Large Banner Image)</option>
            <option value="summary">summary (Small Square Image)</option>
            <option value="app">app (Mobile App Banner)</option>
            <option value="player">player (Video Player Media)</option>
          </select>
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">twitter:site (@Username):</label>
          <input type="text" id="tc-site-handle" class="form-input" value="@PavanB4588" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">twitter:title:</label>
        <input type="text" id="tc-title" class="form-input" value="FreeToolsPDF — 100% Free & Private Online PDF Tools" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">twitter:description:</label>
        <textarea id="tc-desc" class="form-input" style="width:100%;height:70px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">Fast, free, and private client-side PDF and math tools for students and professionals.</textarea>
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">twitter:image (Image URL):</label>
        <input type="text" id="tc-image" class="form-input" value="https://pdftoolsfree.in/og-image.png" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-tcg-btn" class="btn btn-primary flex-1">🐦 Generate Twitter Card Meta Tags</button>
      </div>
    `;
  }

  function calculate() {
    const cardType = document.getElementById('tc-card-type') ? document.getElementById('tc-card-type').value : 'summary_large_image';
    const site = document.getElementById('tc-site-handle') ? document.getElementById('tc-site-handle').value.trim() : '';
    const title = document.getElementById('tc-title') ? document.getElementById('tc-title').value.trim() : '';
    const desc = document.getElementById('tc-desc') ? document.getElementById('tc-desc').value.trim() : '';
    const image = document.getElementById('tc-image') ? document.getElementById('tc-image').value.trim() : '';

    if (!title) {
      if (out) out.value = 'ERROR: Please enter a Twitter title.';
      return;
    }

    let tags = `<!-- Twitter / X Card Meta Tags -->n`;
    tags += `<meta name="twitter:card" content="${cardType}">n`;
    if (site) {
      tags += `<meta name="twitter:site" content="${site}">n`;
      tags += `<meta name="twitter:creator" content="${site}">n`;
    }
    tags += `<meta name="twitter:title" content="${title}">n`;
    if (desc) tags += `<meta name="twitter:description" content="${desc}">n`;
    if (image) tags += `<meta name="twitter:image" content="${image}">n`;

    if (out) out.value = tags;
    if (window.showToast) window.showToast('Twitter Card meta tags generated!', 'success');
  }

  const activeBtn = document.getElementById('calc-tcg-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
