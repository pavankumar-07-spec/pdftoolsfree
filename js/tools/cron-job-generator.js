/**
 * Cron Expression Generator & Explainer Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('cjg-freq')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Schedule Frequency:</label>
        <select id="cjg-freq" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
          <option value="5m">Every 5 Minutes (*/5 * * * *)</option>
          <option value="hourly">Every Hour at Minute 0 (0 * * * *)</option>
          <option value="daily">Every Day at Midnight (0 0 * * *)</option>
          <option value="weekly">Every Sunday at Midnight (0 0 * * 0)</option>
        </select>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-cjg-btn" class="btn btn-primary flex-1">⏱️ Generate Cron Expression</button>
      </div>
    `;
  }

  function calculate() {
    const freq = document.getElementById('cjg-freq') ? document.getElementById('cjg-freq').value : '5m';

    let cron = '*/5 * * * *';
    let desc = 'Runs every 5 minutes';

    if (freq === 'hourly') {
      cron = '0 * * * *';
      desc = 'Runs at minute 0 of every hour';
    } else if (freq === 'daily') {
      cron = '0 0 * * *';
      desc = 'Runs at 00:00 (midnight) every day';
    } else if (freq === 'weekly') {
      cron = '0 0 * * 0';
      desc = 'Runs at 00:00 (midnight) every Sunday';
    }

    let res = `--- CRON EXPRESSION GENERATOR REPORT ---nn`;
    res += `CRON STRING: "${cron}"n`;
    res += `SCHEDULE:    ${desc}nn`;

    res += `=== CRON FIELDS EXPLANATION ===n`;
    res += `┌───────────── minute (0 - 59)n`;
    res += `│ ┌─────────── hour (0 - 23)n`;
    res += `│ │ ┌───────── day of month (1 - 31)n`;
    res += `│ │ │ ┌─────── month (1 - 12)n`;
    res += `│ │ │ │ ┌───── day of week (0 - 6) (Sunday=0)n`;
    res += `${cron.padEnd(16)} (Expression)`;

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Cron: "${cron}"`, 'success');
  }

  const activeBtn = document.getElementById('calc-cjg-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
