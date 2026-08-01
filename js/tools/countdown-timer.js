/**
 * Countdown Timer Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('ct-mins')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Minutes:</label>
          <input type="number" id="ct-mins" class="form-input" value="25" min="0" max="300" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Seconds:</label>
          <input type="number" id="ct-secs" class="form-input" value="0" min="0" max="59" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-ct-btn" class="btn btn-primary flex-1">⏱️ Initialize Timer</button>
      </div>
    `;
  }

  function calculate() {
    const mins = parseInt(document.getElementById('ct-mins') ? document.getElementById('ct-mins').value : 25, 10) || 0;
    const secs = parseInt(document.getElementById('ct-secs') ? document.getElementById('ct-secs').value : 0, 10) || 0;

    const totalSeconds = mins * 60 + secs;

    let res = `--- COUNTDOWN TIMER CONFIGURATION ---nn`;
    res += `Timer Duration: ${mins} minutes, ${secs} seconds (${totalSeconds} total seconds)n`;
    res += `Status: ⏱️ TIMER READYnn`;
    res += `[ ⏳ ${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')} ]n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Timer set for ${mins}m ${secs}s!`, 'success');
  }

  const activeBtn = document.getElementById('calc-ct-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
