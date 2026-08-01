/**
 * Sitemap XML Generator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('sm-urls')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">List of Page URLs (one per line):</label>
        <textarea id="sm-urls" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">https://pdftoolsfree.in/nhttps://pdftoolsfree.in/tools/matrix-calculator.htmlnhttps://pdftoolsfree.in/tools/age-calculator.html</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-sm-btn" class="btn btn-primary flex-1">🗺️ Generate XML Sitemap</button>
      </div>
    `;
  }

  function calculate() {
    const raw = (document.getElementById('sm-urls')?.value || '').trim();

    if (!raw) {
      if (out) out.value = '';
      return;
    }

    const urls = raw.split('n').map(u => u.trim()).filter(Boolean);
    const today = new Date().toISOString().substring(0, 10);

    let res = '<?xml version="1.0" encoding="UTF-8"?>n';
    res += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">n';

    urls.forEach(url => {
      res += '  <url>n';
      res += `    <loc>${url}</loc>n`;
      res += `    <lastmod>${today}</lastmod>n`;
      res += `    <changefreq>weekly</changefreq>n`;
      res += `    <priority>${url.endsWith('/') ? '1.0' : '0.8'}</priority>n`;
      res += '  </url>n';
    });

    res += '</urlset>';

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Sitemap generated for ${urls.length} URLs!`, 'success');
  }

  const activeBtn = document.getElementById('calc-sm-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
