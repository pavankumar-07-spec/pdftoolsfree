/**
 * Shift Duration Calculator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('sdc-start')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Shift Start Time:</label>
          <input type="time" id="sdc-start" class="form-input" value="08:00" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Shift End Time:</label>
          <input type="time" id="sdc-end" class="form-input" value="16:30" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-sdc-btn" class="btn btn-primary flex-1">⏱️ Calculate Shift Duration</button>
      </div>
    `;
  }

  function calculate() {
    const sTime = document.getElementById('sdc-start') ? document.getElementById('sdc-start').value : '08:00';
    const eTime = document.getElementById('sdc-end') ? document.getElementById('sdc-end').value : '16:30';

    const [sH, sM] = sTime.split(':').map(Number);
    const [eH, eM] = eTime.split(':').map(Number);

    let startMins = sH * 60 + sM;
    let endMins = eH * 60 + eM;
    if (endMins < startMins) endMins += 24 * 60; // Overnight shift

    const diffMins = endMins - startMins;
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;

    let res = `--- SHIFT DURATION CALCULATOR REPORT ---nn`;
    res += `Start Time: ${sTime}n`;
    res += `End Time:   ${eTime}nn`;
    res += `=== TOTAL DURATION ===n`;
    res += `${hours} Hours, ${mins} Minutes (${(diffMins / 60).toFixed(2)} total hours)n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Shift duration: ${hours}h ${mins}m`, 'success');
  }

  const activeBtn = document.getElementById('calc-sdc-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
