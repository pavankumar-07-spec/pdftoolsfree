/**
 * CSV Table Viewer Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('cv-csv')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input CSV Text:</label>
        <textarea id="cv-csv" class="form-input" style="width:100%;height:100px;padding:0.5rem;font-family:monospace;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">Name,Age,Department,StatusnPavan,24,Engineering,ActivenAnanya,26,Marketing,Active</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-cv-btn" class="btn btn-primary flex-1">📋 Render CSV Grid View</button>
      </div>
    `;
  }

  function calculate() {
    const csv = document.getElementById('cv-csv') ? document.getElementById('cv-csv').value : (document.getElementById('text-input') ? document.getElementById('text-input').value : '');

    if (!csv.trim()) {
      if (out) out.value = 'ERROR: Please enter CSV data.';
      return;
    }

    const lines = csv.split('n').filter(l => l.trim());
    if (lines.length === 0) return;

    const headers = lines[0].split(',').map(h => h.trim());
    const dataRows = lines.slice(1).map(r => r.split(',').map(c => c.trim()));

    let res = `--- CSV GRID TABLE VIEWER ---nn`;
    res += `Columns (${headers.length}): [ ${headers.join(' | ')} ]n`;
    res += `Data Rows: ${dataRows.length}nn`;

    res += `=== ASCII TABLE REPRESENTATION ===n`;
    res += `| ${headers.map(h => h.padEnd(14)).join(' | ')} |n`;
    res += `|${headers.map(() => '-'.repeat(16)).join('|')}|n`;

    dataRows.forEach(row => {
      res += `| ${row.map(cell => cell.padEnd(14)).join(' | ')} |n`;
    });

    if (out) out.value = res;
    if (window.showToast) window.showToast(`CSV rendered (${dataRows.length} data rows)!`, 'success');
  }

  const activeBtn = document.getElementById('calc-cv-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
