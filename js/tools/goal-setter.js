/**
 * SMART Goal Setter Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('gs-title')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Goal Title:</label>
        <input type="text" id="gs-title" class="form-input" value="Complete B.Tech Math & Developer Tools Platform" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Measurable Target Metric:</label>
        <input type="text" id="gs-metric" class="form-input" value="Replace 100% of 274 dummy scripts with functional client-side JS" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-gs-btn" class="btn btn-primary flex-1">🎯 Define SMART Goal</button>
      </div>
    `;
  }

  function calculate() {
    const title = document.getElementById('gs-title') ? document.getElementById('gs-title').value : '';
    const metric = document.getElementById('gs-metric') ? document.getElementById('gs-metric').value : '';

    if (!title) {
      if (out) out.value = 'ERROR: Please enter a goal title.';
      return;
    }

    let res = `--- SMART GOAL SETTER REPORT ---nn`;
    res += `Goal Title: ${title}nn`;
    res += `=== S.M.A.R.T. FRAMEWORK BREAKDOWN ===n`;
    res += `• Specific:   ${title}n`;
    res += `• Measurable: ${metric || 'Progress tracked in percentage completion'}n`;
    res += `• Achievable: Broken down into modular sub-tasksn`;
    res += `• Relevant:   High value product improvementn`;
    res += `• Time-bound: Target completion schedule definedn`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('SMART Goal defined!', 'success');
  }

  const activeBtn = document.getElementById('calc-gs-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
