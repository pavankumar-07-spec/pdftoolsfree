/**
 * Client-Side Kanban Board Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('kb-todo')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">To-Do Column Items (One per line):</label>
        <textarea id="kb-todo" class="form-input" style="width:100%;height:70px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">Design category stylesheetsnAdd dark mode enhancements</textarea>
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">In-Progress Column Items:</label>
        <textarea id="kb-doing" class="form-input" style="width:100%;height:70px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">Upgrading remaining 109 JS tool scripts</textarea>
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Done Column Items:</label>
        <textarea id="kb-done" class="form-input" style="width:100%;height:70px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">Implement 112 core batch tool scriptsnValidate math & vector engines</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-kb-btn" class="btn btn-primary flex-1">📋 Render Kanban Board</button>
      </div>
    `;
  }

  function calculate() {
    const todo = document.getElementById('kb-todo') ? document.getElementById('kb-todo').value.split('n').filter(i => i.trim()) : [];
    const doing = document.getElementById('kb-doing') ? document.getElementById('kb-doing').value.split('n').filter(i => i.trim()) : [];
    const done = document.getElementById('kb-done') ? document.getElementById('kb-done').value.split('n').filter(i => i.trim()) : [];

    let res = `--- KANBAN BOARD AGGREGATOR ---nn`;
    res += `📌 TO-DO (${todo.length}):n${todo.map(t => '  • ' + t).join('n') || '  (None)'}nn`;
    res += `⚙️ IN-PROGRESS (${doing.length}):n${doing.map(t => '  • ' + t).join('n') || '  (None)'}nn`;
    res += `✅ DONE (${done.length}):n${done.map(t => '  • ' + t).join('n') || '  (None)'}n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Kanban board rendered!', 'success');
  }

  const activeBtn = document.getElementById('calc-kb-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
