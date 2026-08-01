/**
 * Daily Schedule & Routine Planner Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('dp-tasks')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Daily Schedule / Tasks (One per line):</label>
        <textarea id="dp-tasks" class="form-input" style="width:100%;height:120px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">08:00 AM - Morning Workout & Meditationn09:30 AM - Core Development & Coding Sessionn01:00 PM - Lunch & Restn02:30 PM - Code Review & Documentationn06:00 PM - Evening Walk & Relaxation</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-dp-btn" class="btn btn-primary flex-1">📅 Format Daily Plan</button>
      </div>
    `;
  }

  function calculate() {
    const text = document.getElementById('dp-tasks') ? document.getElementById('dp-tasks').value : (document.getElementById('text-input') ? document.getElementById('text-input').value : '');

    if (!text.trim()) {
      if (out) out.value = 'ERROR: Please enter daily schedule tasks.';
      return;
    }

    const lines = text.split('n').filter(l => l.trim().length > 0);

    let res = `--- DAILY ROUTINE & SCHEDULE PLANNER ---nn`;
    res += `Date: ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}n`;
    res += `Total Scheduled Tasks: ${lines.length}nn`;

    res += `=== TODAY'S TIMELINE ===n`;
    lines.forEach((line, idx) => {
      res += `[ ] ${idx + 1}. ${line}n`;
    });

    if (out) out.value = res;
    if (window.showToast) window.showToast('Daily schedule formatted!', 'success');
  }

  const activeBtn = document.getElementById('calc-dp-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
