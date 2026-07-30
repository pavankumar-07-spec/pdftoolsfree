/**
 * Unicode Inspector Engine (Alias)
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('ui-str')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input String:</label>
        <input type="text" id="ui-str" class="form-input" value="⚡ FreeToolsPDF 📄" style="width:100%;padding:0.5rem;font-size:1.1rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-ui-btn" class="btn btn-primary flex-1">🔍 Inspect Unicode</button>
      </div>
    `;
  }

  function calculate() {
    const str = document.getElementById('ui-str') ? document.getElementById('ui-str').value : '';

    if (!str) {
      if (out) out.value = 'ERROR: Please enter a string to inspect.';
      return;
    }

    let res = `--- UNICODE INSPECTOR REPORT ---nn`;
    res += `Input Text: "${str}"n`;
    res += `Code Point Count: ${Array.from(str).length}nn`;

    res += `=== CODE POINTS ===n`;
    Array.from(str).forEach((char, idx) => {
      const cp = char.codePointAt(0);
      res += `${idx + 1}. '${char}' -> U+${cp.toString(16).toUpperCase().padStart(4, '0')} (${cp})n`;
    });

    if (out) out.value = res;
    if (window.showToast) window.showToast('Unicode inspected!', 'success');
  }

  const activeBtn = document.getElementById('calc-ui-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
