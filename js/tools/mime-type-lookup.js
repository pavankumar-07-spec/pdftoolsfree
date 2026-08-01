/**
 * MIME Type & Extension Lookup Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('mtl-query')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">File Extension or MIME Type (e.g. pdf, png, json, application/pdf):</label>
        <input type="text" id="mtl-query" class="form-input" value="pdf" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-mtl-btn" class="btn btn-primary flex-1">🔍 Lookup MIME Type</button>
      </div>
    `;
  }

  const mimeMap = [
    { ext: '.pdf', mime: 'application/pdf', category: 'Document' },
    { ext: '.json', mime: 'application/json', category: 'Data / Code' },
    { ext: '.html', mime: 'text/html', category: 'Web Page' },
    { ext: '.css', mime: 'text/css', category: 'Stylesheet' },
    { ext: '.js', mime: 'text/javascript', category: 'Script' },
    { ext: '.png', mime: 'image/png', category: 'Raster Image' },
    { ext: '.jpg / .jpeg', mime: 'image/jpeg', category: 'Raster Image' },
    { ext: '.webp', mime: 'image/webp', category: 'Modern Image' },
    { ext: '.svg', mime: 'image/svg+xml', category: 'Vector Graphic' },
    { ext: '.zip', mime: 'application/zip', category: 'Archive' },
    { ext: '.csv', mime: 'text/csv', category: 'Data' },
    { ext: '.mp3', mime: 'audio/mpeg', category: 'Audio' },
    { ext: '.mp4', mime: 'video/mp4', category: 'Video' }
  ];

  function calculate() {
    const query = document.getElementById('mtl-query') ? document.getElementById('mtl-query').value.trim().toLowerCase() : '';

    let res = `--- MIME TYPE & EXTENSION LOOKUP ---nn`;

    const matches = mimeMap.filter(m => m.ext.toLowerCase().includes(query) || m.mime.toLowerCase().includes(query));

    if (matches.length === 0) {
      res += `No MIME types matching "${query}".`;
    } else {
      matches.forEach(m => {
        res += `=== ${m.ext.toUpperCase()} ===n`;
        res += `MIME Type: ${m.mime}n`;
        res += `Category:  ${m.category}nn`;
      });
    }

    if (out) out.value = res;
    if (window.showToast) window.showToast('MIME type details retrieved!', 'success');
  }

  const activeBtn = document.getElementById('calc-mtl-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
