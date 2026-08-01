/**
 * Percentage Increase / Decrease Calculator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('pid-initial')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Initial Value ($/₹):</label>
          <input type="number" id="pid-initial" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="150">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Final Value ($/₹):</label>
          <input type="number" id="pid-final" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="210">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-pid-btn" class="btn btn-primary flex-1">📈 Calculate Percentage Change</button>
      </div>
    `;
  }

  function calculate() {
    const v1 = parseFloat(document.getElementById('pid-initial')?.value || 0);
    const v2 = parseFloat(document.getElementById('pid-final')?.value || 0);

    if (isNaN(v1) || isNaN(v2) || v1 === 0) {
      if (out) out.value = 'ERROR: Enter valid initial and final numbers.';
      return;
    }

    const diff = v2 - v1;
    const pctChange = ((diff / Math.abs(v1)) * 100).toFixed(2);
    const isIncrease = diff >= 0;

    let res = '--- PERCENTAGE CHANGE ANALYSIS ---nn';
    res += `Initial Value: ${v1}n`;
    res += `Final Value:   ${v2}n`;
    res += `Absolute Delta: ${diff > 0 ? '+' : ''}${diff}nn`;
    res += `Percentage Change: ${isIncrease ? '+' : ''}${pctChange}%n`;
    res += `Result: ${isIncrease ? 'INCREASE 📈' : 'DECREASE 📉'}n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Change: ${pctChange}%`, isIncrease ? 'success' : 'info');
  }

  const activeBtn = document.getElementById('calc-pid-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
