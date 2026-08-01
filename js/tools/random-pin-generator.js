/**
 * Random PIN Generator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('pin-len')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">PIN Length:</label>
          <select id="pin-len" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
            <option value="4" selected>4-Digit PIN</option>
            <option value="6">6-Digit PIN</option>
            <option value="8">8-Digit PIN</option>
          </select>
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Quantity:</label>
          <input type="number" id="pin-qty" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="10" min="1" max="50">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-pin-btn" class="btn btn-primary flex-1">🔢 Generate PIN Numbers</button>
      </div>
    `;
  }

  function calculate() {
    const len = parseInt(document.getElementById('pin-len')?.value || 4);
    const qty = parseInt(document.getElementById('pin-qty')?.value || 10);

    const pins = [];
    for (let i = 0; i < qty; i++) {
      let pin = '';
      for (let j = 0; j < len; j++) {
        pin += Math.floor(Math.random() * 10);
      }
      pins.push(pin);
    }

    let res = '--- GENERATED PIN CODES ---nn';
    res += pins.join('n');

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Generated ${qty} PINs!`, 'success');
  }

  const activeBtn = document.getElementById('calc-pin-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
