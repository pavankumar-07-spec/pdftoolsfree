document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const out = document.getElementById('main-output');

  if (inputsContainer) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:1rem;margin-bottom:1rem">
        <div><label class="form-label">Work (min)</label><input type="number" id="pomo-work" class="form-input" value="25" min="1" max="120"></div>
        <div><label class="form-label">Short Break (min)</label><input type="number" id="pomo-sbreak" class="form-input" value="5" min="1" max="60"></div>
        <div><label class="form-label">Long Break (min)</label><input type="number" id="pomo-lbreak" class="form-input" value="15" min="1" max="60"></div>
        <div><label class="form-label">Target Sessions</label><input type="number" id="pomo-sessions" class="form-input" value="4" min="1" max="12"></div>
      </div>
      <div style="display:flex;gap:0.75rem">
        <button id="pomo-start-btn" class="btn btn-primary flex-1">⏱️ Start Timer</button>
        <button id="pomo-reset-btn" class="btn btn-secondary">🔄 Reset</button>
      </div>
    `;
  }

  let timer = null, secondsLeft = 1500, isRunning = false, sessionCount = 0;

  function updateDisplay(label) {
    const m = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
    const s = (secondsLeft % 60).toString().padStart(2, '0');
    if (out) {
      out.value = `--- POMODORO TIMER STATUS ---
Status: ${label}
Time Remaining: ${m}:${s}
Completed Sessions: ${sessionCount}`;
    }
  }

  document.getElementById('pomo-start-btn')?.addEventListener('click', () => {
    if (isRunning) {
      clearInterval(timer);
      isRunning = false;
      document.getElementById('pomo-start-btn').textContent = '▶️ Resume Timer';
      updateDisplay('PAUSED');
      return;
    }
    const workMin = parseInt(document.getElementById('pomo-work')?.value || 25, 10);
    if (!isRunning && secondsLeft === 1500) secondsLeft = workMin * 60;
    isRunning = true;
    document.getElementById('pomo-start-btn').textContent = '⏸️ Pause Timer';
    timer = setInterval(() => {
      if (secondsLeft > 0) {
        secondsLeft--;
        updateDisplay('RUNNING (Focus Work Session)');
      } else {
        clearInterval(timer);
        isRunning = false;
        sessionCount++;
        if (window.showToast) window.showToast('Pomodoro session complete! Take a break 🎉', 'success');
        updateDisplay('COMPLETED SESSION!');
        document.getElementById('pomo-start-btn').textContent = '⏱️ Start Next Session';
      }
    }, 1000);
  });

  document.getElementById('pomo-reset-btn')?.addEventListener('click', () => {
    clearInterval(timer);
    isRunning = false;
    const workMin = parseInt(document.getElementById('pomo-work')?.value || 25, 10);
    secondsLeft = workMin * 60;
    document.getElementById('pomo-start-btn').textContent = '⏱️ Start Timer';
    updateDisplay('READY');
  });

  updateDisplay('READY');
});