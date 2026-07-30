/**
 * Weekly Schedule & Task Planner Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('wp-tasks')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Weekly Goals / Milestones (One per line):</label>
        <textarea id="wp-tasks" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">Monday: Finalize 100% JS Tool Engine UpgradesnTuesday: Design & Test Category Scoped StylesheetsnWednesday: Audit & Validate All Tool Page ShellsnThursday: Performance & Lighthouse OptimizationnFriday: Release Sprint Demo</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-wp-btn" class="btn btn-primary flex-1">📅 Format Weekly Plan</button>
      </div>
    `;
  }

  function calculate() {
    const text = document.getElementById('wp-tasks') ? document.getElementById('wp-tasks').value : '';

    if (!text.trim()) {
      if (out) out.value = 'ERROR: Please enter weekly planner items.';
      return;
    }

    const items = text.split('n').filter(i => i.trim());

    let res = `--- WEEKLY GOALS & SCHEDULE PLANNER ---nn`;
    res += `Total Weekly Tasks: ${items.length}nn`;
    res += `=== WEEKLY OVERVIEW ===n`;

    items.forEach((item, idx) => {
      res += `[ ] ${item}n`;
    });

    if (out) out.value = res;
    if (window.showToast) window.showToast('Weekly plan formatted!', 'success');
  }

  const activeBtn = document.getElementById('calc-wp-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
