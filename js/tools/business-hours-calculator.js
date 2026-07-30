/**
 * Business Hours Calculator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('bh-start-time')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Start Time:</label>
          <input type="time" id="bh-start-time" class="form-input" value="09:00" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">End Time:</label>
          <input type="time" id="bh-end-time" class="form-input" value="17:00" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Unpaid Break Duration (Minutes):</label>
        <input type="number" id="bh-break" class="form-input" value="30" min="0" max="180" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-bh-btn" class="btn btn-primary flex-1">⏰ Calculate Shift Hours</button>
      </div>
    `;
  }

  function calculate() {
    const sTime = document.getElementById('bh-start-time') ? document.getElementById('bh-start-time').value : '09:00';
    const eTime = document.getElementById('bh-end-time') ? document.getElementById('bh-end-time').value : '17:00';
    const breakMins = parseInt(document.getElementById('bh-break') ? document.getElementById('bh-break').value : 30, 10) || 0;

    const [sH, sM] = sTime.split(':').map(Number);
    const [eH, eM] = eTime.split(':').map(Number);

    let startMins = sH * 60 + sM;
    let endMins = eH * 60 + eM;
    if (endMins < startMins) endMins += 24 * 60; // Overnight shift

    const totalMins = endMins - startMins;
    const netMins = Math.max(0, totalMins - breakMins);

    const netHours = (netMins / 60).toFixed(2);
    const weeklyHours = (netMins * 5 / 60).toFixed(2);

    let res = `--- BUSINESS HOURS & SHIFT CALCULATOR ---nn`;
    res += `Shift Start: ${sTime}n`;
    res += `Shift End:   ${eTime}n`;
    res += `Break Time:  ${breakMins} minsnn`;

    res += `=== NET WORKING HOURS ===n`;
    res += `Daily Paid Work Hours:  ${netHours} hours (${Math.floor(netMins / 60)}h ${netMins % 60}m)n`;
    res += `Weekly Paid Work (5-day): ${weeklyHours} hours / weekn`;

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Daily Shift: ${netHours} hours`, 'success');
  }

  const activeBtn = document.getElementById('calc-bh-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
