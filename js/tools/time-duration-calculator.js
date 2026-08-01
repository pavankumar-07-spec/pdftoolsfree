/**
 * Time Duration & Interval Calculator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('tdc-t1')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Start Time:</label>
          <input type="time" id="tdc-t1" class="form-input" value="09:15" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">End Time:</label>
          <input type="time" id="tdc-t2" class="form-input" value="17:45" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-tdc-btn" class="btn btn-primary flex-1">⏱️ Calculate Elapsed Time</button>
      </div>
    `;
  }

  function calculate() {
    const t1 = document.getElementById('tdc-t1') ? document.getElementById('tdc-t1').value : '09:15';
    const t2 = document.getElementById('tdc-t2') ? document.getElementById('tdc-t2').value : '17:45';

    const [h1, m1] = t1.split(':').map(Number);
    const [h2, m2] = t2.split(':').map(Number);

    let startMins = h1 * 60 + m1;
    let endMins = h2 * 60 + m2;
    if (endMins < startMins) endMins += 24 * 60;

    const diff = endMins - startMins;
    const hours = Math.floor(diff / 60);
    const mins = diff % 60;

    let res = `--- TIME DURATION CALCULATOR REPORT ---nn`;
    res += `Start Time: ${t1}n`;
    res += `End Time:   ${t2}nn`;
    res += `=== ELAPSED DURATION ===n`;
    res += `${hours} Hours, ${mins} Minutes (${diff} Total Minutes)n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Duration: ${hours}h ${mins}m`, 'success');
  }

  const activeBtn = document.getElementById('calc-tdc-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
