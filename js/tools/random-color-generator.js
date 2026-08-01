/**
 * Random Color Generator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('rc-qty')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Number of Colors to Generate:</label>
        <input type="number" id="rc-qty" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="5" min="1" max="20">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-rc-btn" class="btn btn-primary flex-1">🎨 Generate Random Palette</button>
      </div>
    `;
  }

  function calculate() {
    const qty = parseInt(document.getElementById('rc-qty')?.value || 5);

    const colors = [];
    for (let i = 0; i < qty; i++) {
      const hex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
      colors.push(hex);
    }

    let res = '--- RANDOM COLOR PALETTE GENERATED ---nn';
    colors.forEach((c, idx) => {
      res += `Color ${idx + 1}: ${c}n`;
    });

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Generated ${qty} random colors!`, 'success');
  }

  const activeBtn = document.getElementById('calc-rc-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
