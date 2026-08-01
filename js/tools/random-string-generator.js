/**
 * Random String Generator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('rs-len')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">String Length:</label>
          <input type="number" id="rs-len" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="16" min="4" max="128">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Quantity:</label>
          <input type="number" id="rs-qty" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="5" min="1" max="50">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-rs-btn" class="btn btn-primary flex-1">🎲 Generate Random Strings</button>
      </div>
    `;
  }

  function calculate() {
    const len = parseInt(document.getElementById('rs-len')?.value || 16);
    const qty = parseInt(document.getElementById('rs-qty')?.value || 5);

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=';
    const list = [];

    for (let i = 0; i < qty; i++) {
      let str = '';
      for (let j = 0; j < len; j++) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      list.push(str);
    }

    let res = '--- RANDOM STRINGS GENERATED ---nn';
    res += list.join('n');

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Generated ${qty} random strings!`, 'success');
  }

  const activeBtn = document.getElementById('calc-rs-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
