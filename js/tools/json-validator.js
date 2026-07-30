/**
 * JSON Validator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('json-src')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Enter JSON String:</label>
        <textarea id="json-src" class="form-input" style="width:100%;height:140px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text);font-family:monospace">{n  "site": "FreeToolsPDF",n  "tools": 407,n  "status": "online"n}</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-json-btn" class="btn btn-primary flex-1">✔️ Validate & Format JSON</button>
      </div>
    `;
  }

  function calculate() {
    const raw = document.getElementById('json-src') ? document.getElementById('json-src').value : '';

    if (!raw.trim()) {
      if (out) out.value = 'ERROR: Please enter JSON content.';
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      const formatted = JSON.stringify(parsed, null, 2);

      let res = '✅ VALID JSONnn';
      res += 'Formatted JSON:n';
      res += formatted;

      if (out) out.value = res;
      if (window.showToast) window.showToast('JSON is 100% valid!', 'success');
    } catch (err) {
      let res = '❌ INVALID JSON SYNTAX ERRORnn';
      res += `Error Message: ${err.message}nn`;
      res += `Input snippet:n${raw}`;

      if (out) out.value = res;
      if (window.showToast) window.showToast('JSON syntax error detected!', 'error');
    }
  }

  const activeBtn = document.getElementById('calc-json-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
