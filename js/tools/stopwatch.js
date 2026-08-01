/**
 * Upgraded Real-Time Live Stopwatch Engine with Lap Split Recording
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('sw-display')) {
    inputsContainer.innerHTML = `
      <div style="text-align:center;margin-bottom:1.5rem">
        <div id="sw-display" style="font-size:3rem;font-weight:800;font-family:monospace;margin-bottom:1rem;color:var(--primary);letter-spacing:1px;background:var(--surface-2);padding:1.5rem;border-radius:var(--radius-md);border:1px solid var(--border)">00:00:00.000</div>
        <div style="display:flex;gap:0.75rem;justify-content:center">
          <button id="sw-start" type="button" class="btn btn-primary" style="padding:0.75rem 1.5rem;font-weight:700">▶️ Start / Pause</button>
          <button id="sw-lap" type="button" class="btn btn-secondary" style="padding:0.75rem 1.5rem;font-weight:700">🚩 Lap Split</button>
          <button id="sw-reset" type="button" class="btn btn-secondary" style="padding:0.75rem 1.5rem;font-weight:700">🔄 Reset</button>
        </div>
      </div>
    `;
  }

  let startTime = 0;
  let elapsedTime = 0;
  let timerInterval = null;
  let isRunning = false;
  let laps = [];

  function formatTime(totalMs) {
    const ms = Math.floor(totalMs % 1000).toString().padStart(3, '0');
    const sec = Math.floor((totalMs / 1000) % 60).toString().padStart(2, '0');
    const min = Math.floor((totalMs / (1000 * 60)) % 60).toString().padStart(2, '0');
    const hrs = Math.floor(totalMs / (1000 * 60 * 60)).toString().padStart(2, '0');
    return `${hrs}:${min}:${sec}.${ms}`;
  }

  function updateDisplay() {
    const totalMs = elapsedTime + (isRunning ? (Date.now() - startTime) : 0);
    const timeFormatted = formatTime(totalMs);

    const disp = document.getElementById('sw-display');
    if (disp) disp.textContent = timeFormatted;
  }

  function renderLaps() {
    if (!out) return;
    const totalMs = elapsedTime + (isRunning ? (Date.now() - startTime) : 0);
    let res = `==========================================================
                ONLINE STOPWATCH & LAP SPLITS
==========================================================
Current Time:    ${formatTime(totalMs)}
Timer Status:    ${isRunning ? '🟢 RUNNING' : '⏸️ PAUSED'}
Total Laps:      ${laps.length}

LAP SPLIT RECORDS:
`;

    if (laps.length === 0) {
      res += `No lap splits recorded yet. Click "🚩 Lap Split" while running.\n`;
    } else {
      laps.forEach((l, idx) => {
        res += `• Lap ${(idx + 1).toString().padStart(2, '0')} : ${l.splitTime} (Split: +${l.diff})\n`;
      });
    }

    res += `\n==========================================================`;
    out.value = res;
  }

  const startBtn = document.getElementById('sw-start');
  if (startBtn) {
    startBtn.onclick = () => {
      if (!isRunning) {
        startTime = Date.now();
        timerInterval = setInterval(() => {
          updateDisplay();
        }, 10);
        isRunning = true;
        if (window.showToast) window.showToast('⏱️ Stopwatch started!', 'info');
      } else {
        elapsedTime += Date.now() - startTime;
        clearInterval(timerInterval);
        isRunning = false;
        if (window.showToast) window.showToast('⏸️ Stopwatch paused', 'warning');
      }
      renderLaps();
    };
  }

  const lapBtn = document.getElementById('sw-lap');
  if (lapBtn) {
    lapBtn.onclick = () => {
      if (isRunning) {
        const totalMs = elapsedTime + (Date.now() - startTime);
        const lastMs = laps.length > 0 ? laps[laps.length - 1].rawMs : 0;
        const diffMs = totalMs - lastMs;

        laps.push({
          splitTime: formatTime(totalMs),
          diff: formatTime(diffMs),
          rawMs: totalMs
        });

        if (window.showToast) window.showToast(`🚩 Lap ${laps.length} recorded!`, 'success');
        renderLaps();
      }
    };
  }

  const resetBtn = document.getElementById('sw-reset');
  if (resetBtn) {
    resetBtn.onclick = () => {
      clearInterval(timerInterval);
      isRunning = false;
      startTime = 0;
      elapsedTime = 0;
      laps = [];
      updateDisplay();
      renderLaps();
      if (window.showToast) window.showToast('🔄 Stopwatch reset', 'info');
    };
  }

  if (btn) btn.style.display = 'none';
  updateDisplay();
  renderLaps();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
