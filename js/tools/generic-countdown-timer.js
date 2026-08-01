/**
 * Generic Countdown Timer Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('gct-hours')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Hours:</label>
          <input type="number" id="gct-hours" class="form-input" value="1" min="0" max="72" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Minutes:</label>
          <input type="number" id="gct-mins" class="form-input" value="30" min="0" max="59" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Seconds:</label>
          <input type="number" id="gct-secs" class="form-input" value="0" min="0" max="59" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-gct-btn" class="btn btn-primary flex-1">⏱️ Initialize Countdown</button>
      </div>
    `;
  }

  function calculate() {
    const hours = parseInt(document.getElementById('gct-hours') ? document.getElementById('gct-hours').value : 1, 10) || 0;
    const mins = parseInt(document.getElementById('gct-mins') ? document.getElementById('gct-mins').value : 30, 10) || 0;
    const secs = parseInt(document.getElementById('gct-secs') ? document.getElementById('gct-secs').value : 0, 10) || 0;

    const totalSeconds = hours * 3600 + mins * 60 + secs;

    let res = `--- GENERIC COUNTDOWN TIMER REPORT ---nn`;
    res += `Configured Duration: ${hours}h ${mins}m ${secs}s (${totalSeconds.toLocaleString()} total seconds)n`;
    res += `[ ⏳ ${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')} ]n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Timer configured for ${hours}h ${mins}m`, 'success');
  }

  const activeBtn = document.getElementById('calc-gct-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
