/**
 * Goal Progress Tracker Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('gt-current')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Current Completed Value:</label>
          <input type="number" id="gt-current" class="form-input" value="165" min="0" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Total Goal Target:</label>
          <input type="number" id="gt-target" class="form-input" value="274" min="1" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-gt-btn" class="btn btn-primary flex-1">📊 Calculate Goal Progress</button>
      </div>
    `;
  }

  function calculate() {
    const cur = parseFloat(document.getElementById('gt-current') ? document.getElementById('gt-current').value : 165) || 0;
    const target = parseFloat(document.getElementById('gt-target') ? document.getElementById('gt-target').value : 274) || 1;

    const pct = Math.min(100, Math.max(0, (cur / target) * 100));
    const remaining = Math.max(0, target - cur);

    const filledBars = Math.round(pct / 5);
    const emptyBars = 20 - filledBars;
    const progressBar = '█'.repeat(filledBars) + '░'.repeat(emptyBars);

    let res = `--- GOAL PROGRESS TRACKER REPORT ---nn`;
    res += `Current Progress: ${cur} / ${target}n`;
    res += `Percentage:       ${pct.toFixed(1)}%n`;
    res += `Remaining Target: ${remaining}nn`;

    res += `=== PROGRESS VISUALIZATION ===n`;
    res += `[${progressBar}] ${pct.toFixed(1)}%n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Progress: ${pct.toFixed(1)}% completed!`, 'success');
  }

  const activeBtn = document.getElementById('calc-gt-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
