/**
 * Excel / TSV / Copy-Pasted Spreadsheet to JSON Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('ej-text')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Paste Excel / TSV Spreadsheet Data (Tab-Separated):</label>
        <textarea id="ej-text" class="form-input" style="width:100%;height:120px;padding:0.5rem;font-family:monospace;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">IDtProducttPricetInStockn101tLaptopt999.99ttruen102tMouset25.50ttruen103tKeyboardt45.00tfalse</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-ej-btn" class="btn btn-primary flex-1">📊 Convert Spreadsheet to JSON</button>
      </div>
    `;
  }

  function excelToJson(tsvStr) {
    const lines = tsvStr.trim().split('n');
    if (lines.length === 0) return [];
    // Tab or multiple spaces delimiter
    const headers = lines[0].split(/t/).map(h => h.trim());
    const result = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      const cells = lines[i].split(/t/).map(c => c.trim());
      const obj = {};
      headers.forEach((h, idx) => {
        let val = cells[idx] || '';
        if (val.toLowerCase() === 'true') val = true;
        else if (val.toLowerCase() === 'false') val = false;
        else if (!isNaN(val) && val !== '') val = Number(val);
        obj[h] = val;
      });
      result.push(obj);
    }
    return result;
  }

  function calculate() {
    const text = document.getElementById('ej-text') ? document.getElementById('ej-text').value : (document.getElementById('text-input') ? document.getElementById('text-input').value : '');

    if (!text.trim()) {
      if (out) out.value = 'ERROR: Please paste Excel / TSV data.';
      return;
    }

    try {
      const jsonArr = excelToJson(text);
      const res = JSON.stringify(jsonArr, null, 2);

      if (out) out.value = res;
      if (window.showToast) window.showToast(`Excel data converted to JSON (${jsonArr.length} items)!`, 'success');
    } catch (err) {
      if (out) out.value = `ERROR converting Excel data: ${err.message}`;
    }
  }

  const activeBtn = document.getElementById('calc-ej-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
