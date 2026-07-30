/**
 * Tsv To Csv Converter Engine - Exact Tool Output
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputEl = document.getElementById('tsv-input');
  const btn = document.getElementById('generate-btn');
  const copyBtn = document.getElementById('copy-btn');
  const out = document.getElementById('main-output');

  function convertTsvToCsv() {
    const raw = inputEl ? inputEl.value : '';
    if (!raw.trim()) { if (out) out.value = ''; return; }

    const lines = raw.split('n');
    const csvLines = lines.map(line => {
      const fields = line.split('t');
      return fields.map(field => {
        let f = field.trim();
        if (f.includes(',') || f.includes('"') || f.includes('n')) {
          f = '"' + f.replace(/"/g, '""') + '"';
        }
        return f;
      }).join(',');
    });

    const csvOutput = csvLines.join('n');
    if (out) out.value = csvOutput;
    if (window.showToast) window.showToast('TSV converted to CSV!', 'success');
  }

  if (inputEl) inputEl.addEventListener('input', convertTsvToCsv);
  if (btn) btn.addEventListener('click', convertTsvToCsv);
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(out ? out.value : '').then(() => {
        if (window.showToast) window.showToast('Copied CSV to clipboard!', 'success');
      });
    });
  }

  if (inputEl && inputEl.value) convertTsvToCsv();
});