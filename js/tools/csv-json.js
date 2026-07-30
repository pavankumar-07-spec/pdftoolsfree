/**
 * CSV to JSON & JSON to CSV Converter Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('cj-text')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input CSV Content:</label>
        <textarea id="cj-text" class="form-input" style="width:100%;height:120px;padding:0.5rem;font-family:monospace;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">name,age,citynAlice,30,New YorknBob,25,LondonnCharlie,35,Tokyo</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-cj-btn" class="btn btn-primary flex-1">📊 Convert CSV to JSON</button>
      </div>
    `;
  }

  function csvToJson(csv) {
    const lines = csv.trim().split('n');
    if (lines.length === 0) return [];
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const result = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      const currentline = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      const obj = {};
      headers.forEach((h, idx) => {
        let val = currentline[idx] || '';
        if (!isNaN(val) && val !== '') val = Number(val);
        obj[h] = val;
      });
      result.push(obj);
    }
    return result;
  }

  function calculate() {
    const text = document.getElementById('cj-text') ? document.getElementById('cj-text').value : (document.getElementById('text-input') ? document.getElementById('text-input').value : '');

    if (!text.trim()) {
      if (out) out.value = 'ERROR: Please enter CSV text to convert.';
      return;
    }

    try {
      const jsonArr = csvToJson(text);
      const res = JSON.stringify(jsonArr, null, 2);

      if (out) out.value = res;
      if (window.showToast) window.showToast(`CSV converted to JSON (${jsonArr.length} rows)!`, 'success');
    } catch (err) {
      if (out) out.value = `ERROR converting CSV to JSON: ${err.message}`;
    }
  }

  const activeBtn = document.getElementById('calc-cj-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
