/**
 * CSS Box Shadow Generator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('bs-x')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Horizontal Offset (X px):</label>
          <input type="number" id="bs-x" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="0">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Vertical Offset (Y px):</label>
          <input type="number" id="bs-y" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="10">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Blur Radius (px):</label>
          <input type="number" id="bs-blur" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="25">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Spread Radius (px):</label>
          <input type="number" id="bs-spread" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="0">
        </div>
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Shadow Color & Opacity:</label>
        <input type="text" id="bs-color" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="rgba(0, 0, 0, 0.15)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-bs-btn" class="btn btn-primary flex-1">📦 Generate Box Shadow CSS</button>
      </div>
    `;
  }

  function calculate() {
    const x = parseInt(document.getElementById('bs-x')?.value || 0);
    const y = parseInt(document.getElementById('bs-y')?.value || 10);
    const blur = parseInt(document.getElementById('bs-blur')?.value || 25);
    const spread = parseInt(document.getElementById('bs-spread')?.value || 0);
    const color = document.getElementById('bs-color')?.value || 'rgba(0, 0, 0, 0.15)';

    const css = `box-shadow: ${x}px ${y}px ${blur}px ${spread}px ${color};`;

    let res = '/* --- CSS BOX SHADOW RULE --- */nn';
    res += css + 'n';
    res += `-webkit-box-shadow: ${x}px ${y}px ${blur}px ${spread}px ${color};n`;
    res += `-moz-box-shadow: ${x}px ${y}px ${blur}px ${spread}px ${color};n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Box shadow generated!', 'success');
  }

  const activeBtn = document.getElementById('calc-bs-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
