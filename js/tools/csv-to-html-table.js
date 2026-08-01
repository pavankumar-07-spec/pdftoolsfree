/**
 * Csv To Html Table Engine - Exact Tool Output
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputEl = document.getElementById('csv-input');
  const classIn = document.getElementById('table-class');
  const headerIn = document.getElementById('has-header');
  const btn = document.getElementById('generate-btn');
  const copyBtn = document.getElementById('copy-btn');
  const out = document.getElementById('main-output');

  function convertCsvToHtmlTable() {
    const raw = inputEl ? inputEl.value : '';
    if (!raw.trim()) { if (out) out.value = ''; return; }

    const cls = classIn ? classIn.value : 'table';
    const useHeader = !headerIn || headerIn.value === 'yes';

    const lines = raw.split('n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return;

    let html = `<table class="${cls}">n`;

    lines.forEach((line, idx) => {
      const cols = line.split(',').map(c => c.replace(/^"|"$/g, '').trim());
      if (idx === 0 && useHeader) {
        html += '  <thead>n    <tr>n';
        cols.forEach(c => { html += `      <th>${escapeHtml(c)}</th>n`; });
        html += '    </tr>n  </thead>n  <tbody>n';
      } else {
        if (idx === 0) html += '  <tbody>n';
        html += '    <tr>n';
        cols.forEach(c => { html += `      <td>${escapeHtml(c)}</td>n`; });
        html += '    </tr>n';
      }
    });

    html += '  </tbody>n</table>';

    if (out) out.value = html;
    if (window.showToast) window.showToast('CSV converted to HTML Table!', 'success');
  }

  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  [inputEl, classIn, headerIn].forEach(el => { if (el) el.addEventListener('input', convertCsvToHtmlTable); });
  if (btn) btn.addEventListener('click', convertCsvToHtmlTable);
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(out ? out.value : '').then(() => {
        if (window.showToast) window.showToast('Copied HTML Table code!', 'success');
      });
    });
  }

  if (inputEl && inputEl.value) convertCsvToHtmlTable();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});