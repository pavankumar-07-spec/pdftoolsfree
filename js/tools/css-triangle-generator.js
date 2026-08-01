/**
 * CSS Triangle Generator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('ctg-dir')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Direction:</label>
          <select id="ctg-dir" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
            <option value="up">Up ▲</option>
            <option value="down">Down ▼</option>
            <option value="left">Left ◄</option>
            <option value="right">Right ►</option>
            <option value="top-left">Top-Left ◤</option>
            <option value="top-right">Top-Right ◥</option>
            <option value="bottom-left">Bottom-Left ◣</option>
            <option value="bottom-right">Bottom-Right ◢</option>
          </select>
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Triangle Color:</label>
          <input type="color" id="ctg-color" class="form-input" value="#FF5A1F" style="width:100%;height:40px;padding:0.25rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2)">
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Width (px):</label>
          <input type="number" id="ctg-width" class="form-input" value="40" min="5" max="500" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Height (px):</label>
          <input type="number" id="ctg-height" class="form-input" value="40" min="5" max="500" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-ctg-btn" class="btn btn-primary flex-1">📐 Generate CSS Triangle</button>
      </div>
    `;
  }

  function calculate() {
    const dir = document.getElementById('ctg-dir') ? document.getElementById('ctg-dir').value : 'up';
    const color = document.getElementById('ctg-color') ? document.getElementById('ctg-color').value : '#FF5A1F';
    const w = parseInt(document.getElementById('ctg-width') ? document.getElementById('ctg-width').value : 40, 10) || 40;
    const h = parseInt(document.getElementById('ctg-height') ? document.getElementById('ctg-height').value : 40, 10) || 40;

    let borders = '';
    const halfW = w / 2;
    const halfH = h / 2;

    switch (dir) {
      case 'up':
        borders = `width: 0;nheight: 0;nborder-left: ${halfW}px solid transparent;nborder-right: ${halfW}px solid transparent;nborder-bottom: ${h}px solid ${color};`;
        break;
      case 'down':
        borders = `width: 0;nheight: 0;nborder-left: ${halfW}px solid transparent;nborder-right: ${halfW}px solid transparent;nborder-top: ${h}px solid ${color};`;
        break;
      case 'left':
        borders = `width: 0;nheight: 0;nborder-top: ${halfH}px solid transparent;nborder-bottom: ${halfH}px solid transparent;nborder-right: ${w}px solid ${color};`;
        break;
      case 'right':
        borders = `width: 0;nheight: 0;nborder-top: ${halfH}px solid transparent;nborder-bottom: ${halfH}px solid transparent;nborder-left: ${w}px solid ${color};`;
        break;
      case 'top-left':
        borders = `width: 0;nheight: 0;nborder-top: ${h}px solid ${color};nborder-right: ${w}px solid transparent;`;
        break;
      case 'top-right':
        borders = `width: 0;nheight: 0;nborder-top: ${h}px solid ${color};nborder-left: ${w}px solid transparent;`;
        break;
      case 'bottom-left':
        borders = `width: 0;nheight: 0;nborder-bottom: ${h}px solid ${color};nborder-right: ${w}px solid transparent;`;
        break;
      case 'bottom-right':
        borders = `width: 0;nheight: 0;nborder-bottom: ${h}px solid ${color};nborder-left: ${w}px solid transparent;`;
        break;
    }

    let css = `.css-triangle {n${borders}n}`;

    if (out) out.value = css;
    if (window.showToast) window.showToast('CSS triangle code generated!', 'success');
  }

  const activeBtn = document.getElementById('calc-ctg-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
