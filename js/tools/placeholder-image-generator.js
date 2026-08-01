/**
 * Placeholder Image SVG/Canvas Generator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('pig-w')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Width (px):</label>
          <input type="number" id="pig-w" class="form-input" value="600" min="10" max="2000" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Height (px):</label>
          <input type="number" id="pig-h" class="form-input" value="400" min="10" max="2000" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Background Color:</label>
          <input type="color" id="pig-bg" class="form-input" value="#cccccc" style="width:100%;height:40px;padding:0.25rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Text Color:</label>
          <input type="color" id="pig-fg" class="form-input" value="#333333" style="width:100%;height:40px;padding:0.25rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2)">
        </div>
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Custom Text (Optional):</label>
        <input type="text" id="pig-text" class="form-input" value="600x400" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-pig-btn" class="btn btn-primary flex-1">🖼️ Generate SVG Placeholder</button>
      </div>
    `;
  }

  function calculate() {
    const w = parseInt(document.getElementById('pig-w') ? document.getElementById('pig-w').value : 600, 10) || 600;
    const h = parseInt(document.getElementById('pig-h') ? document.getElementById('pig-h').value : 400, 10) || 400;
    const bg = document.getElementById('pig-bg') ? document.getElementById('pig-bg').value : '#cccccc';
    const fg = document.getElementById('pig-fg') ? document.getElementById('pig-fg').value : '#333333';
    const customText = document.getElementById('pig-text') ? document.getElementById('pig-text').value.trim() : `${w}x${h}`;

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">n  <rect width="100%" height="100%" fill="${bg}"/>n  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="${Math.max(12, Math.round(w / 16))}" font-weight="bold" fill="${fg}">${customText}</text>n</svg>`;

    if (out) out.value = svg;
    if (window.showToast) window.showToast(`Placeholder SVG generated (${w}x${h})!`, 'success');
  }

  const activeBtn = document.getElementById('calc-pig-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
