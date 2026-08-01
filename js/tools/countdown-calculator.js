/**
 * Countdown & Date Delta Calculator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('cd-target-date')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Event Name (Optional):</label>
        <input type="text" id="cd-event-name" class="form-input" value="New Year / Target Milestone" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Target Date:</label>
          <input type="date" id="cd-target-date" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Target Time:</label>
          <input type="time" id="cd-target-time" class="form-input" value="00:00" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-cd-btn" class="btn btn-primary flex-1">⏳ Calculate Countdown</button>
      </div>
    `;

    // Set default target date to 30 days from now
    const d = new Date();
    d.setDate(d.getDate() + 30);
    document.getElementById('cd-target-date').value = d.toISOString().split('T')[0];
  }

  function calculate() {
    const eventName = document.getElementById('cd-event-name') ? document.getElementById('cd-event-name').value : 'Target Date';
    const targetDateStr = document.getElementById('cd-target-date') ? document.getElementById('cd-target-date').value : '';
    const targetTimeStr = document.getElementById('cd-target-time') ? document.getElementById('cd-target-time').value : '00:00';

    if (!targetDateStr) {
      if (out) out.value = 'ERROR: Please select a target date.';
      return;
    }

    const target = new Date(`${targetDateStr}T${targetTimeStr}:00`);
    const now = new Date();

    const diffMs = target - now;
    const isPast = diffMs < 0;
    const absDiff = Math.abs(diffMs);

    const seconds = Math.floor((absDiff / 1000) % 60);
    const minutes = Math.floor((absDiff / (1000 * 60)) % 60);
    const hours = Math.floor((absDiff / (1000 * 60 * 60)) % 24);
    const totalDays = Math.floor(absDiff / (1000 * 60 * 60 * 24));
    const totalHours = Math.floor(absDiff / (1000 * 60 * 60));
    const totalMinutes = Math.floor(absDiff / (1000 * 60));
    const totalSeconds = Math.floor(absDiff / 1000);

    const weeks = Math.floor(totalDays / 7);
    const remDays = totalDays % 7;

    let res = `--- COUNTDOWN & TIME BREAKDOWN ---nn`;
    res += `Event: ${eventName}n`;
    res += `Current Time: ${now.toLocaleString()}n`;
    res += `Target Time:  ${target.toLocaleString()}nn`;

    res += isPast ? `Status: ⏰ EVENT PASSED (${totalDays} days ago)nn` : `Status: ⏳ TIME REMAININGnn`;

    res += `=== TIME DIFFERENCE ===n`;
    res += `${totalDays} Days, ${hours} Hours, ${minutes} Minutes, ${seconds} Secondsn`;
    res += `(${weeks} Weeks and ${remDays} Days)nn`;

    res += `=== TOTAL UNITS ===n`;
    res += `Total Hours:   ${totalHours.toLocaleString()} hrsn`;
    res += `Total Minutes: ${totalMinutes.toLocaleString()} minsn`;
    res += `Total Seconds: ${totalSeconds.toLocaleString()} secsn`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Countdown calculated!', 'success');
  }

  const activeBtn = document.getElementById('calc-cd-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
