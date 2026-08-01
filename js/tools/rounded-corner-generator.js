/**
 * CSS Border Radius & Rounded Corner Generator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('rcg-tl')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Top-Left Radius (px):</label>
          <input type="number" id="rcg-tl" class="form-input" value="12" min="0" max="100" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Top-Right Radius (px):</label>
          <input type="number" id="rcg-tr" class="form-input" value="12" min="0" max="100" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Bottom-Right Radius (px):</label>
          <input type="number" id="rcg-br" class="form-input" value="12" min="0" max="100" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Bottom-Left Radius (px):</label>
          <input type="number" id="rcg-bl" class="form-input" value="12" min="0" max="100" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-rcg-btn" class="btn btn-primary flex-1">🎨 Generate Border-Radius CSS</button>
      </div>
    `;
  }

  function calculate() {
    const tl = parseInt(document.getElementById('rcg-tl') ? document.getElementById('rcg-tl').value : 12, 10) || 0;
    const tr = parseInt(document.getElementById('rcg-tr') ? document.getElementById('rcg-tr').value : 12, 10) || 0;
    const br = parseInt(document.getElementById('rcg-br') ? document.getElementById('rcg-br').value : 12, 10) || 0;
    const bl = parseInt(document.getElementById('rcg-bl') ? document.getElementById('rcg-bl').value : 12, 10) || 0;

    let css = `/* CSS border-radius */n`;
    if (tl === tr && tr === br && br === bl) {
      css += `border-radius: ${tl}px;`;
    } else {
      css += `border-radius: ${tl}px ${tr}px ${br}px ${bl}px;`;
    }

    if (out) out.value = css;
    if (window.showToast) window.showToast('Border-radius CSS rules generated!', 'success');
  }

  const activeBtn = document.getElementById('calc-rcg-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
