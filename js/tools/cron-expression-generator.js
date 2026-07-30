/**
 * Cron Expression Generator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('cron-min')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Minute (0-59 or *):</label>
          <input type="text" id="cron-min" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="0">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Hour (0-23 or *):</label>
          <input type="text" id="cron-hr" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="12">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Day of Month (1-31 or *):</label>
          <input type="text" id="cron-dom" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="*">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Month (1-12 or *):</label>
          <input type="text" id="cron-mon" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="*">
        </div>
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Day of Week (0-6 Sun-Sat or *):</label>
        <input type="text" id="cron-dow" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="1-5">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-cron-btn" class="btn btn-primary flex-1">⚙️ Generate Cron Expression</button>
      </div>
    `;
  }

  function calculate() {
    const min = (document.getElementById('cron-min')?.value || '*').trim();
    const hr = (document.getElementById('cron-hr')?.value || '*').trim();
    const dom = (document.getElementById('cron-dom')?.value || '*').trim();
    const mon = (document.getElementById('cron-mon')?.value || '*').trim();
    const dow = (document.getElementById('cron-dow')?.value || '*').trim();

    const cronExpr = `${min} ${hr} ${dom} ${mon} ${dow}`;

    let res = '--- CRON EXPRESSION GENERATOR ---nn';
    res += `Cron Syntax: ${cronExpr}nn`;
    res += `Explanation:n`;
    res += `- Minute: ${min}n`;
    res += `- Hour: ${hr}n`;
    res += `- Day of Month: ${dom}n`;
    res += `- Month: ${mon}n`;
    res += `- Day of Week: ${dow}n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Cron expression generated!', 'success');
  }

  const activeBtn = document.getElementById('calc-cron-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
