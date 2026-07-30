/**
 * Task Tracker Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('tt-tasks')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Tasks (Format: Task Name | Status | Priority, one per line):</label>
        <textarea id="tt-tasks" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">Build 274 JS engines | Done | HighnDesign category CSS themes | In Progress | MediumnValidate flagship layouts | To Do | Low</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-tt-btn" class="btn btn-primary flex-1">📋 Render Task Summary</button>
      </div>
    `;
  }

  function calculate() {
    const text = document.getElementById('tt-tasks') ? document.getElementById('tt-tasks').value : '';

    if (!text.trim()) {
      if (out) out.value = 'ERROR: Please enter task entries.';
      return;
    }

    const lines = text.split('n').filter(l => l.trim());

    let res = `--- TASK TRACKER SUMMARY ---nn`;
    res += `Total Tasks Tracked: ${lines.length}nn`;

    lines.forEach((line, idx) => {
      const parts = line.split('|').map(s => s.trim());
      const name = parts[0] || 'Task';
      const status = parts[1] || 'Pending';
      const priority = parts[2] || 'Normal';
      res += `${idx + 1}. [${status.toUpperCase()}] ${name} (Priority: ${priority})n`;
    });

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Tracked ${lines.length} tasks!`, 'success');
  }

  const activeBtn = document.getElementById('calc-tt-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
