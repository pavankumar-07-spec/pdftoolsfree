/**
 * Timetable & Class Schedule Planner Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('ttp-slots')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Class Schedule Slots (Day - Subject - Room, one per line):</label>
        <textarea id="ttp-slots" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">Monday 09:00 AM - Engineering Math - Hall AnMonday 11:00 AM - Data Structures - Lab 2nTuesday 10:00 AM - Discrete Math - Room 101</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-ttp-btn" class="btn btn-primary flex-1">📅 Format Class Timetable</button>
      </div>
    `;
  }

  function calculate() {
    const text = document.getElementById('ttp-slots') ? document.getElementById('ttp-slots').value : '';

    if (!text.trim()) {
      if (out) out.value = 'ERROR: Please enter schedule slots.';
      return;
    }

    const slots = text.split('n').filter(s => s.trim());

    let res = `--- CLASS TIMETABLE PLANNER ---nn`;
    res += `Total Scheduled Slots: ${slots.length}nn`;

    res += `=== WEEKLY CLASS SCHEDULE ===n`;
    slots.forEach((s, i) => {
      res += `[ Slot #${i + 1} ] ${s}n`;
    });

    if (out) out.value = res;
    if (window.showToast) window.showToast('Class timetable formatted!', 'success');
  }

  const activeBtn = document.getElementById('calc-ttp-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
