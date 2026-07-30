/**
 * Online Stopwatch Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('sw-display')) {
    inputsContainer.innerHTML = `
      <div style="text-align:center;margin-bottom:1rem">
        <div id="sw-display" style="font-size:2.5rem;font-weight:700;font-family:monospace;margin-bottom:1rem;color:var(--primary)">00:00:00.000</div>
        <div style="display:flex;gap:0.5rem;justify-content:center">
          <button id="sw-start" class="btn btn-primary">▶️ Start / Pause</button>
          <button id="sw-lap" class="btn btn-secondary">🚩 Lap</button>
          <button id="sw-reset" class="btn btn-secondary">🔄 Reset</button>
        </div>
      </div>
    `;
  }

  let startTime = 0;
  let elapsedTime = 0;
  let timerInterval = null;
  let isRunning = false;
  let laps = [];

  function updateDisplay() {
    const totalMs = elapsedTime + (isRunning ? (Date.now() - startTime) : 0);
    const ms = Math.floor(totalMs % 1000).toString().padStart(3, '0');
    const sec = Math.floor((totalMs / 1000) % 60).toString().padStart(2, '0');
    const min = Math.floor((totalMs / (1000 * 60)) % 60).toString().padStart(2, '0');
    const hrs = Math.floor(totalMs / (1000 * 60 * 60)).toString().padStart(2, '0');

    const disp = document.getElementById('sw-display');
    if (disp) disp.textContent = `${hrs}:${min}:${sec}.${ms}`;
  }

  function renderLaps() {
    if (!out) return;
    let res = '--- STOPWATCH LAP TIMES ---nn';
    if (laps.length === 0) {
      res += 'No laps recorded yet.';
    } else {
      laps.forEach((l, idx) => {
        res += `Lap ${idx + 1}: ${l}n`;
      });
    }
    out.value = res;
  }

  document.getElementById('sw-start')?.addEventListener('click', () => {
    if (!isRunning) {
      startTime = Date.now();
      timerInterval = setInterval(updateDisplay, 10);
      isRunning = true;
    } else {
      elapsedTime += Date.now() - startTime;
      clearInterval(timerInterval);
      isRunning = false;
    }
  });

  document.getElementById('sw-lap')?.addEventListener('click', () => {
    const disp = document.getElementById('sw-display');
    if (disp && isRunning) {
      laps.push(disp.textContent);
      renderLaps();
    }
  });

  document.getElementById('sw-reset')?.addEventListener('click', () => {
    clearInterval(timerInterval);
    isRunning = false;
    startTime = 0;
    elapsedTime = 0;
    laps = [];
    updateDisplay();
    renderLaps();
  });

  if (btn) btn.style.display = 'none';
  renderLaps();
});
