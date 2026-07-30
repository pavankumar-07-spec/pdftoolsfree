/**
 * CSS Gradient Generator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('grad-c1')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Color 1 (Hex):</label>
          <input type="text" id="grad-c1" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="#6366f1">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Color 2 (Hex):</label>
          <input type="text" id="grad-c2" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="#a855f7">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Angle (Deg):</label>
          <input type="number" id="grad-angle" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="135" min="0" max="360">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-grad-btn" class="btn btn-primary flex-1">🌈 Generate Gradient CSS</button>
      </div>
    `;
  }

  function calculate() {
    const c1 = document.getElementById('grad-c1')?.value || '#6366f1';
    const c2 = document.getElementById('grad-c2')?.value || '#a855f7';
    const angle = parseInt(document.getElementById('grad-angle')?.value || 135);

    const css = `background: linear-gradient(${angle}deg, ${c1}, ${c2});`;

    let res = '/* --- CSS LINEAR GRADIENT --- */nn';
    res += css + 'n';
    res += `background: -webkit-linear-gradient(${angle}deg, ${c1}, ${c2});n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Gradient generated!', 'success');
  }

  const activeBtn = document.getElementById('calc-grad-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
