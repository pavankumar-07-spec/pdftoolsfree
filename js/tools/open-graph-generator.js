/**
 * Open Graph (OG) Meta Tag Generator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('og-title')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">og:title (Website Title):</label>
        <input type="text" id="og-title" class="form-input" value="FreeToolsPDF — 100% Free & Private Online PDF Tools" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">og:description (Meta Description):</label>
        <textarea id="og-desc" class="form-input" style="width:100%;height:70px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">Fast, free, and completely local browser-based PDF and math calculators without login.</textarea>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">og:url (Page Canonical URL):</label>
          <input type="text" id="og-url" class="form-input" value="https://pdftoolsfree.in/" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">og:type (Content Type):</label>
          <select id="og-type" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
            <option value="website">website</option>
            <option value="article">article</option>
            <option value="product">product</option>
            <option value="profile">profile</option>
          </select>
        </div>
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">og:image (Full Image URL):</label>
        <input type="text" id="og-image" class="form-input" value="https://pdftoolsfree.in/og-image.png" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-og-btn" class="btn btn-primary flex-1">🌐 Generate Open Graph Meta Tags</button>
      </div>
    `;
  }

  function calculate() {
    const title = document.getElementById('og-title') ? document.getElementById('og-title').value.trim() : '';
    const desc = document.getElementById('og-desc') ? document.getElementById('og-desc').value.trim() : '';
    const url = document.getElementById('og-url') ? document.getElementById('og-url').value.trim() : '';
    const type = document.getElementById('og-type') ? document.getElementById('og-type').value : 'website';
    const image = document.getElementById('og-image') ? document.getElementById('og-image').value.trim() : '';

    if (!title || !url) {
      if (out) out.value = 'ERROR: Please enter at least website title and URL.';
      return;
    }

    let tags = `<!-- Open Graph Meta Tags for Facebook, LinkedIn & Social Media -->n`;
    tags += `<meta property="og:type" content="${type}">n`;
    tags += `<meta property="og:title" content="${title}">n`;
    if (desc) tags += `<meta property="og:description" content="${desc}">n`;
    tags += `<meta property="og:url" content="${url}">n`;
    if (image) {
      tags += `<meta property="og:image" content="${image}">n`;
      tags += `<meta property="og:image:width" content="1200">n`;
      tags += `<meta property="og:image:height" content="630">n`;
    }

    if (out) out.value = tags;
    if (window.showToast) window.showToast('Open Graph meta tags generated!', 'success');
  }

  const activeBtn = document.getElementById('calc-og-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
