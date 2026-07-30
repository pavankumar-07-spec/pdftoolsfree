/**
 * Data Format Converter Engine (JSON <-> YAML <-> CSV)
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('dfc-input')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Target Conversion Mode:</label>
        <select id="dfc-mode" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
          <option value="json-to-csv">JSON Array -> CSV</option>
          <option value="json-to-yaml">JSON -> YAML</option>
          <option value="csv-to-json">CSV -> JSON</option>
        </select>
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input Data Payload:</label>
        <textarea id="dfc-input" class="form-input" style="width:100%;height:100px;padding:0.5rem;font-family:monospace;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">[{"id": 1, "name": "Pavan", "role": "Developer"}, {"id": 2, "name": "Rahul", "role": "Designer"}]</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-dfc-btn" class="btn btn-primary flex-1">🔄 Convert Data Format</button>
      </div>
    `;
  }

  function calculate() {
    const raw = document.getElementById('dfc-input') ? document.getElementById('dfc-input').value.trim() : '';
    const mode = document.getElementById('dfc-mode') ? document.getElementById('dfc-mode').value : 'json-to-csv';

    if (!raw) {
      if (out) out.value = 'ERROR: Please enter input data payload.';
      return;
    }

    try {
      if (mode === 'json-to-csv') {
        const arr = JSON.parse(raw);
        if (!Array.isArray(arr) || arr.length === 0) throw new Error('Expected a non-empty JSON array of objects.');
        const keys = Object.keys(arr[0]);
        let csv = keys.join(',') + 'n';
        arr.forEach(obj => {
          csv += keys.map(k => JSON.stringify(obj[k] || '')).join(',') + 'n';
        });
        if (out) out.value = csv.trim();
      } else if (mode === 'json-to-yaml') {
        const obj = JSON.parse(raw);
        let yaml = '';
        Object.entries(obj).forEach(([k, v]) => {
          yaml += `${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}n`;
        });
        if (out) out.value = yaml.trim();
      } else if (mode === 'csv-to-json') {
        const lines = raw.split('n').filter(l => l.trim());
        const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
        const json = lines.slice(1).map(line => {
          const vals = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
          const obj = {};
          headers.forEach((h, i) => obj[h] = vals[i] || '');
          return obj;
        });
        if (out) out.value = JSON.stringify(json, null, 2);
      }
      if (window.showToast) window.showToast('Data format converted!', 'success');
    } catch (err) {
      if (out) out.value = `ERROR: Conversion failed: ${err.message}`;
    }
  }

  const activeBtn = document.getElementById('calc-dfc-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
