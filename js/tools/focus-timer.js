/**
 * Focus & Pomodoro Productivity Timer Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('ft-work')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Focus Work Session (Minutes):</label>
          <input type="number" id="ft-work" class="form-input" value="25" min="5" max="120" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Short Break (Minutes):</label>
          <input type="number" id="ft-break" class="form-input" value="5" min="1" max="30" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-ft-btn" class="btn btn-primary flex-1">🎯 Start Focus Session</button>
      </div>
    `;
  }

  function calculate() {
    const work = parseInt(document.getElementById('ft-work') ? document.getElementById('ft-work').value : 25, 10) || 25;
    const breakMins = parseInt(document.getElementById('ft-break') ? document.getElementById('ft-break').value : 5, 10) || 5;

    let res = `--- FOCUS TIMER INITIALIZATION ---nn`;
    res += `Work Duration:  ${work} Minutesn`;
    res += `Break Duration: ${breakMins} Minutesnn`;
    res += `Status: 🎯 FOCUS SESSION ACTIVEn`;
    res += `[ ⏳ ${work.toString().padStart(2, '0')}:00 ] Deep Work Mode Enabled.n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Focus session started: ${work} mins`, 'success');
  }

  const activeBtn = document.getElementById('calc-ft-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
