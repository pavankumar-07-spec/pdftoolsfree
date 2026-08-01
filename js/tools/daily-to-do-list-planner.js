/**
 * Daily To-Do List Planner Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('dtd-items')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">To-Do Items (Line separated):</label>
        <textarea id="dtd-items" class="form-input" style="width:100%;height:120px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">Complete B.Tech Math AssignmentnReview PDF Tool Engine updatesnSubmit weekly status report</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-dtd-btn" class="btn btn-primary flex-1">📝 Generate To-Do List</button>
      </div>
    `;
  }

  function calculate() {
    const text = document.getElementById('dtd-items') ? document.getElementById('dtd-items').value : (document.getElementById('text-input') ? document.getElementById('text-input').value : '');

    if (!text.trim()) {
      if (out) out.value = 'ERROR: Please enter to-do items.';
      return;
    }

    const items = text.split('n').filter(i => i.trim().length > 0);

    let res = `--- DAILY TO-DO LIST ---nn`;
    res += `Total Items: ${items.length}nn`;

    items.forEach((item, idx) => {
      res += `☐ ${idx + 1}. ${item}n`;
    });

    if (out) out.value = res;
    if (window.showToast) window.showToast('To-do list generated!', 'success');
  }

  const activeBtn = document.getElementById('calc-dtd-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
