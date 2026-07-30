/**
 * Website Favicon Extractor Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('fe-url')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Website Domain / URL:</label>
        <input type="text" id="fe-url" class="form-input" value="https://pdftoolsfree.in" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-fe-btn" class="btn btn-primary flex-1">🌐 Extract Favicon</button>
      </div>
    `;
  }

  function calculate() {
    let url = document.getElementById('fe-url') ? document.getElementById('fe-url').value.trim() : 'https://pdftoolsfree.in';
    if (!url.startsWith('http')) url = 'https://' + url;

    try {
      const domain = new URL(url).hostname;
      const googleFaviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

      let res = `--- FAVICON EXTRACTOR REPORT ---nn`;
      res += `Domain: ${domain}nn`;
      res += `=== EXTRACTED FAVICON URL (128x128) ===n`;
      res += `${googleFaviconUrl}n`;

      if (out) out.value = res;
      if (window.showToast) window.showToast(`Extracted favicon for ${domain}!`, 'success');
    } catch (e) {
      if (out) out.value = 'ERROR: Invalid website URL.';
    }
  }

  const activeBtn = document.getElementById('calc-fe-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
