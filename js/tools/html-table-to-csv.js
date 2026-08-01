/**
 * Html Table To Csv Engine - Exact Tool Output
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputEl = document.getElementById('html-input');
  const btn = document.getElementById('generate-btn');
  const copyBtn = document.getElementById('copy-btn');
  const out = document.getElementById('main-output');

  function convertHtmlTableToCsv() {
    const raw = inputEl ? inputEl.value : '';
    if (!raw.trim()) { if (out) out.value = ''; return; }

    const parser = new DOMParser();
    const doc = parser.parseFromString(raw, 'text/html');
    const table = doc.querySelector('table');

    if (!table) {
      if (out) out.value = '❌ No HTML <table> element found in input.';
      return;
    }

    const rows = [...table.querySelectorAll('tr')];
    const csvLines = rows.map(tr => {
      const cells = [...tr.querySelectorAll('th, td')];
      return cells.map(td => {
        let text = td.textContent.trim();
        if (text.includes(',') || text.includes('"') || text.includes('\n')) {
          text = '"' + text.replace(/"/g, '""') + '"';
        }
        return text;
      }).join(',');
    });

    const csvResult = csvLines.join('\n');

    if (out) out.value = csvResult;
    if (window.showToast) window.showToast('HTML Table converted to CSV!', 'success');
  }

  if (inputEl) inputEl.addEventListener('input', convertHtmlTableToCsv);
  if (btn) btn.addEventListener('click', convertHtmlTableToCsv);
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(out ? out.value : '').then(() => {
        if (window.showToast) window.showToast('Copied CSV to clipboard!', 'success');
      });
    });
  }

  if (inputEl && inputEl.value) convertHtmlTableToCsv();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});