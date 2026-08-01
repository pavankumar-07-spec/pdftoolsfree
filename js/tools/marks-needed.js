/**
 * Real Client-Side Target Marks Needed Calculator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('mn-curr')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Current Average Score (%):</label>
          <input type="number" id="mn-curr" class="form-input" value="78" min="0" max="100" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Target Final Grade (%):</label>
          <input type="number" id="mn-target" class="form-input" value="85" min="0" max="100" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Final Exam Weight (% of course):</label>
        <input type="number" id="mn-weight" class="form-input" value="30" min="1" max="100" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-mn-btn" class="btn btn-primary flex-1">🎯 Calculate Needed Marks</button>
      </div>
    `;
  }

  function calculate() {
    const current = parseFloat(document.getElementById('mn-curr') ? document.getElementById('mn-curr').value : 78) || 0;
    const target = parseFloat(document.getElementById('mn-target') ? document.getElementById('mn-target').value : 85) || 0;
    const weight = parseFloat(document.getElementById('mn-weight') ? document.getElementById('mn-weight').value : 30) || 30;

    const currentWeight = (100 - weight) / 100;
    const finalWeight = weight / 100;

    const needed = (target - (current * currentWeight)) / finalWeight;

    let res = `--- TARGET MARKS NEEDED CALCULATOR REPORT ---nn`;
    res += `Current Grade:     ${current}%n`;
    res += `Target Final Grade:${target}%n`;
    res += `Final Exam Weight: ${weight}%nn`;
    res += `REQUIRED SCORE ON FINAL EXAM: ${needed.toFixed(2)}%nn`;

    if (needed > 100) {
      res += `Status: ⚠️ You need over 100% on final exam to reach target grade. Extra credit required.`;
    } else if (needed <= 0) {
      res += `Status: 🎉 You have already guaranteed target grade regardless of final exam!`;
    } else {
      res += `Status: ✅ Achieve at least ${needed.toFixed(1)}% on final exam to secure your target grade.`;
    }

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Needed on Final: ${needed.toFixed(1)}%`, needed > 100 ? 'warning' : 'success');
  }

  const activeBtn = document.getElementById('calc-mn-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});