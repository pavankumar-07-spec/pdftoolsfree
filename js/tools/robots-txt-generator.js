/**
 * Robots.txt Generator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('robots-domain')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Site Domain URL:</label>
        <input type="text" id="robots-domain" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="https://pdftoolsfree.in">
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Allow Search Engines:</label>
          <select id="robots-allow" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
            <option value="allow" selected>Allow All Robots</option>
            <option value="disallow">Disallow All Robots</option>
          </select>
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Crawl Delay (Seconds):</label>
          <input type="number" id="robots-delay" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="0" min="0">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-robots-btn" class="btn btn-primary flex-1">🤖 Generate robots.txt</button>
      </div>
    `;
  }

  function calculate() {
    const domain = (document.getElementById('robots-domain')?.value || 'https://pdftoolsfree.in').replace(/\/$/, '');
    const allow = document.getElementById('robots-allow')?.value || 'allow';
    const delay = parseInt(document.getElementById('robots-delay')?.value || 0);

    let res = 'User-agent: *n';

    if (allow === 'disallow') {
      res += 'Disallow: /n';
    } else {
      res += 'Disallow: /admin/n';
      res += 'Disallow: /private/n';
      res += 'Allow: /n';
    }

    if (delay > 0) {
      res += `Crawl-delay: ${delay}n`;
    }

    res += `nSitemap: ${domain}/sitemap.xmln`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('robots.txt file generated!', 'success');
  }

  const activeBtn = document.getElementById('calc-robots-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
