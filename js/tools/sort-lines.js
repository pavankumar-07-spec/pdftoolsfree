/**
 * Sort Lines Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('sl-text')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input Lines:</label>
        <textarea id="sl-text" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">BanananApplenCherrynDate</textarea>
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Sort Order:</label>
        <select id="sl-order" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
          <option value="asc">Alphabetical (A -> Z)</option>
          <option value="desc">Reverse Alphabetical (Z -> A)</option>
          <option value="length-asc">By Line Length (Shortest First)</option>
          <option value="length-desc">By Line Length (Longest First)</option>
        </select>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-sl-btn" class="btn btn-primary flex-1">🔤 Sort Lines</button>
      </div>
    `;
  }

  function calculate() {
    const text = document.getElementById('sl-text') ? document.getElementById('sl-text').value : (document.getElementById('text-input') ? document.getElementById('text-input').value : '');
    const order = document.getElementById('sl-order') ? document.getElementById('sl-order').value : 'asc';

    if (!text) {
      if (out) out.value = 'ERROR: Please enter lines to sort.';
      return;
    }

    const lines = text.split('n');

    lines.sort((a, b) => {
      if (order === 'asc') return a.localeCompare(b);
      if (order === 'desc') return b.localeCompare(a);
      if (order === 'length-asc') return a.length - b.length;
      if (order === 'length-desc') return b.length - a.length;
      return 0;
    });

    if (out) out.value = lines.join('n');
    if (window.showToast) window.showToast('Lines sorted successfully!', 'success');
  }

  const activeBtn = document.getElementById('calc-sl-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
