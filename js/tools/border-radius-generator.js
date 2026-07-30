/**
 * CSS Border Radius Generator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('br-tl')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Top-Left (px):</label>
          <input type="number" id="br-tl" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="15" min="0" max="200">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Top-Right (px):</label>
          <input type="number" id="br-tr" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="15" min="0" max="200">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Bottom-Right (px):</label>
          <input type="number" id="br-br" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="15" min="0" max="200">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Bottom-Left (px):</label>
          <input type="number" id="br-bl" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="15" min="0" max="200">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-br-btn" class="btn btn-primary flex-1">🖼️ Generate Border Radius CSS</button>
      </div>
    `;
  }

  function calculate() {
    const tl = parseInt(document.getElementById('br-tl')?.value || 0);
    const tr = parseInt(document.getElementById('br-tr')?.value || 0);
    const brVal = parseInt(document.getElementById('br-br')?.value || 0);
    const bl = parseInt(document.getElementById('br-bl')?.value || 0);

    const css = `border-radius: ${tl}px ${tr}px ${brVal}px ${bl}px;`;

    let res = '/* --- CSS BORDER RADIUS RULE --- */nn';
    res += css + 'n';
    res += `-webkit-border-radius: ${tl}px ${tr}px ${brVal}px ${bl}px;n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Border radius generated!', 'success');
  }

  const activeBtn = document.getElementById('calc-br-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
