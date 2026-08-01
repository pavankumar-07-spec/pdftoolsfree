/**
 * Upgraded Live Interactive Pomodoro Focus Timer Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('pomo-display')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:1rem;margin-bottom:1.5rem">
        <div><label class="form-label">Focus Work (min)</label><input type="number" id="pomo-work" class="form-input" value="25" min="1" max="120"></div>
        <div><label class="form-label">Short Break (min)</label><input type="number" id="pomo-sbreak" class="form-input" value="5" min="1" max="60"></div>
        <div><label class="form-label">Long Break (min)</label><input type="number" id="pomo-lbreak" class="form-input" value="15" min="1" max="60"></div>
        <div><label class="form-label">Target Sessions</label><input type="number" id="pomo-sessions" class="form-input" value="4" min="1" max="12"></div>
      </div>
      <div style="text-align:center;margin-bottom:1.5rem">
        <div id="pomo-mode-badge" style="font-size:0.9rem;font-weight:700;letter-spacing:1px;color:var(--primary);margin-bottom:0.5rem;text-transform:uppercase">🎯 Focus Mode</div>
        <div id="pomo-display" style="font-size:3.5rem;font-weight:800;font-family:monospace;margin-bottom:1rem;color:var(--text);background:var(--surface-2);padding:1.5rem;border-radius:var(--radius-md);border:1px solid var(--border)">25:00</div>
        <div style="display:flex;gap:0.75rem;justify-content:center">
          <button id="pomo-start-btn" type="button" class="btn btn-primary" style="padding:0.75rem 1.5rem;font-weight:700">▶️ Start Session</button>
          <button id="pomo-reset-btn" type="button" class="btn btn-secondary" style="padding:0.75rem 1.5rem;font-weight:700">🔄 Reset</button>
        </div>
      </div>
    `;
  }

  let timer = null;
  let secondsLeft = 1500;
  let isRunning = false;
  let mode = 'work'; // 'work' | 'break'
  let completedSessions = 0;

  function playAudioChime() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 587.33; // D5 note
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch(e) {}
  }

  function updateDisplay() {
    const m = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
    const s = (secondsLeft % 60).toString().padStart(2, '0');

    const disp = document.getElementById('pomo-display');
    if (disp) disp.textContent = `${m}:${s}`;

    const badge = document.getElementById('pomo-mode-badge');
    if (badge) {
      badge.textContent = mode === 'work' ? '🎯 Focus Work Mode' : '☕ Rest & Break Time';
      badge.style.color = mode === 'work' ? 'var(--primary)' : '#22c55e';
    }

    if (out) {
      out.value = `==========================================================
                POMODORO FOCUS TIMER STATUS
==========================================================
Current Mode:        ${mode === 'work' ? '🎯 FOCUS WORK' : '☕ SHORT BREAK'}
Timer Status:        ${isRunning ? '🟢 TICKING' : '⏸️ PAUSED'}
Time Remaining:      ${m}:${s}
Completed Sessions:  ${completedSessions} Focus Cycles
==========================================================`;
    }
  }

  const startBtn = document.getElementById('pomo-start-btn');
  if (startBtn) {
    startBtn.onclick = () => {
      if (isRunning) {
        clearInterval(timer);
        isRunning = false;
        startBtn.textContent = '▶️ Resume Session';
        updateDisplay();
        if (window.showToast) window.showToast('⏸️ Pomodoro paused', 'warning');
        return;
      }

      const workMin = parseInt(document.getElementById('pomo-work')?.value || 25, 10);
      const breakMin = parseInt(document.getElementById('pomo-sbreak')?.value || 5, 10);

      if (secondsLeft === 0) {
        secondsLeft = (mode === 'work' ? workMin : breakMin) * 60;
      }

      isRunning = true;
      startBtn.textContent = '⏸️ Pause Session';

      timer = setInterval(() => {
        if (secondsLeft > 0) {
          secondsLeft--;
          updateDisplay();
        } else {
          clearInterval(timer);
          isRunning = false;
          playAudioChime();

          if (mode === 'work') {
            completedSessions++;
            mode = 'break';
            secondsLeft = breakMin * 60;
            if (window.showToast) window.showToast('🎉 Work session complete! Take a break', 'success');
          } else {
            mode = 'work';
            secondsLeft = workMin * 60;
            if (window.showToast) window.showToast('⚡ Break over! Ready for next session', 'info');
          }

          startBtn.textContent = '▶️ Start Next Phase';
          updateDisplay();
        }
      }, 1000);
    };
  }

  const resetBtn = document.getElementById('pomo-reset-btn');
  if (resetBtn) {
    resetBtn.onclick = () => {
      clearInterval(timer);
      isRunning = false;
      mode = 'work';
      const workMin = parseInt(document.getElementById('pomo-work')?.value || 25, 10);
      secondsLeft = workMin * 60;
      if (startBtn) startBtn.textContent = '▶️ Start Session';
      updateDisplay();
      if (window.showToast) window.showToast('🔄 Timer reset', 'info');
    };
  }

  if (btn) btn.style.display = 'none';
  updateDisplay();
});