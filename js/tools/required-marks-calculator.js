/**
 * Real Client-Side Required Marks Calculator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('rmc-curr')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Current Grade (%):</label>
          <input type="number" id="rmc-curr" class="form-input" value="82" min="0" max="100" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Desired Target Grade (%):</label>
          <input type="number" id="rmc-target" class="form-input" value="90" min="0" max="100" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Final Test Weight (%):</label>
        <input type="number" id="rmc-weight" class="form-input" value="25" min="1" max="100" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-rmc-btn" class="btn btn-primary flex-1">🎯 Calculate Required Test Score</button>
      </div>
    `;
  }

  function calculate() {
    const current = parseFloat(document.getElementById('rmc-curr') ? document.getElementById('rmc-curr').value : 82) || 0;
    const target = parseFloat(document.getElementById('rmc-target') ? document.getElementById('rmc-target').value : 90) || 0;
    const weight = parseFloat(document.getElementById('rmc-weight') ? document.getElementById('rmc-weight').value : 25) || 25;

    const needed = (target - (current * (1 - weight / 100))) / (weight / 100);

    let res = `--- REQUIRED MARKS CALCULATOR REPORT ---nn`;
    res += `Current Overall Score: ${current}%n`;
    res += `Target Course Score:   ${target}%n`;
    res += `Final Exam Weight:     ${weight}%nn`;
    res += `MINIMUM MARKS REQUIRED: ${needed.toFixed(2)}%nn`;
    res += `Status: ${needed > 100 ? '⚠️ Exceeds 100%. Needs extra credit.' : '✅ Target score achievable.'}`;

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Required Marks: ${needed.toFixed(1)}%`, 'success');
  }

  const activeBtn = document.getElementById('calc-rmc-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});