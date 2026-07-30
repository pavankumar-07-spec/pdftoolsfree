/**
 * Pomodoro Study Timer Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('pst-cycles')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Study (Mins):</label>
          <input type="number" id="pst-study" class="form-input" value="25" min="15" max="60" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Break (Mins):</label>
          <input type="number" id="pst-break" class="form-input" value="5" min="1" max="30" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Cycles:</label>
          <input type="number" id="pst-cycles" class="form-input" value="4" min="1" max="10" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-pst-btn" class="btn btn-primary flex-1">🍅 Start Pomodoro Study Session</button>
      </div>
    `;
  }

  function calculate() {
    const study = parseInt(document.getElementById('pst-study') ? document.getElementById('pst-study').value : 25, 10) || 25;
    const breakMins = parseInt(document.getElementById('pst-break') ? document.getElementById('pst-break').value : 5, 10) || 5;
    const cycles = parseInt(document.getElementById('pst-cycles') ? document.getElementById('pst-cycles').value : 4, 10) || 4;

    const totalStudyTime = study * cycles;
    const totalBreakTime = breakMins * (cycles - 1);
    const totalTime = totalStudyTime + totalBreakTime;

    let res = `--- POMODORO STUDY TIMER PLAN ---nn`;
    res += `Study Block:   ${study} minsn`;
    res += `Break Block:   ${breakMins} minsn`;
    res += `Total Cycles:  ${cycles} Pomodorosnn`;

    res += `=== TIME SUMMARY ===n`;
    res += `Total Study Time: ${totalStudyTime} mins (${(totalStudyTime / 60).toFixed(1)} hrs)n`;
    res += `Total Break Time: ${totalBreakTime} minsn`;
    res += `Total Session:    ${totalTime} mins (${(totalTime / 60).toFixed(1)} hrs)n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Pomodoro session: ${cycles} cycles (${totalTime} mins)`, 'success');
  }

  const activeBtn = document.getElementById('calc-pst-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
