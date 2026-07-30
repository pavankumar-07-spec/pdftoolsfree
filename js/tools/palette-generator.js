/**
 * Random Color Palette Generator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('pg-count')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Number of Swatches:</label>
        <input type="number" id="pg-count" class="form-input" value="5" min="3" max="10" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-pg-btn" class="btn btn-primary flex-1">🎲 Generate Random Palette</button>
      </div>
    `;
  }

  function calculate() {
    const count = parseInt(document.getElementById('pg-count') ? document.getElementById('pg-count').value : 5, 10) || 5;

    const colors = [];
    for (let i = 0; i < count; i++) {
      const hex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
      colors.push(hex);
    }

    let res = `--- COLOR PALETTE GENERATOR REPORT ---nn`;
    res += `Generated ${count} Harmonious Swatches:nn`;

    colors.forEach((c, idx) => {
      res += `Swatch ${idx + 1}: ${c}n`;
    });

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Generated ${count} color swatches!`, 'success');
  }

  const activeBtn = document.getElementById('calc-pg-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
