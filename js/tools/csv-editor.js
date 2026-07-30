/**
 * CSV Data Editor & Formatter Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('ce-csv')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input CSV Text:</label>
        <textarea id="ce-csv" class="form-input" style="width:100%;height:100px;padding:0.5rem;font-family:monospace;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">id,name,role,cityn1,Pavan,Developer,Hyderabadn2,Rahul,Designer,Bangalore</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-ce-btn" class="btn btn-primary flex-1">📊 Format & Clean CSV</button>
      </div>
    `;
  }

  function calculate() {
    const csv = document.getElementById('ce-csv') ? document.getElementById('ce-csv').value : (document.getElementById('text-input') ? document.getElementById('text-input').value : '');

    if (!csv.trim()) {
      if (out) out.value = 'ERROR: Please enter CSV data.';
      return;
    }

    const lines = csv.split('n').filter(l => l.trim());

    let res = `--- CSV DATA EDITOR REPORT ---nn`;
    res += `Total Rows:    ${lines.length}n`;
    res += `Header Row:    "${lines[0]}"nn`;

    res += `=== FORMATTED CLEAN CSV ===n`;
    res += lines.join('n');

    if (out) out.value = res;
    if (window.showToast) window.showToast(`CSV formatted (${lines.length} rows)!`, 'success');
  }

  const activeBtn = document.getElementById('calc-ce-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
