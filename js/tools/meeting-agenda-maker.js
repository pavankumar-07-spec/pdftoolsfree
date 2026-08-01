/**
 * Meeting Agenda Maker Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('mam-title')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Meeting Title:</label>
        <input type="text" id="mam-title" class="form-input" value="Sprint Sync & Architecture Review" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Agenda Topics (Line separated):</label>
        <textarea id="mam-items" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">10 mins - Intro & Status Updatesn20 mins - Platform Tool Engine Upgradesn15 mins - Q&A & Action Items</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-mam-btn" class="btn btn-primary flex-1">📋 Format Meeting Agenda</button>
      </div>
    `;
  }

  function calculate() {
    const title = document.getElementById('mam-title') ? document.getElementById('mam-title').value : 'Meeting Agenda';
    const text = document.getElementById('mam-items') ? document.getElementById('mam-items').value : '';

    const items = text.split('n').filter(i => i.trim());

    let res = `--- MEETING AGENDA: ${title.toUpperCase()} ---nn`;
    res += `Date: ${new Date().toLocaleDateString()}n`;
    res += `Total Topics: ${items.length}nn`;

    res += `=== AGENDA TIMELINE ===n`;
    items.forEach((item, idx) => {
      res += `${idx + 1}. ${item}n`;
    });

    if (out) out.value = res;
    if (window.showToast) window.showToast('Meeting agenda formatted!', 'success');
  }

  const activeBtn = document.getElementById('calc-mam-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
