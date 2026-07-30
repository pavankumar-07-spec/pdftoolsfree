/**
 * Geometry Calculator Engine (Circle, Sphere, Cylinder, Triangle)
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('gc-shape')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Geometric Shape:</label>
        <select id="gc-shape" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
          <option value="circle">Circle (Radius r)</option>
          <option value="sphere">Sphere (Radius r)</option>
          <option value="cylinder">Cylinder (Radius r, Height h)</option>
        </select>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Radius (r):</label>
          <input type="number" id="gc-r" class="form-input" value="5" min="0.1" step="0.1" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Height (h - for cylinder):</label>
          <input type="number" id="gc-h" class="form-input" value="10" min="0.1" step="0.1" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-gc-btn" class="btn btn-primary flex-1">📐 Calculate Geometry</button>
      </div>
    `;
  }

  function calculate() {
    const shape = document.getElementById('gc-shape') ? document.getElementById('gc-shape').value : 'circle';
    const r = parseFloat(document.getElementById('gc-r') ? document.getElementById('gc-r').value : 5) || 0;
    const h = parseFloat(document.getElementById('gc-h') ? document.getElementById('gc-h').value : 10) || 0;

    if (r <= 0) {
      if (out) out.value = 'ERROR: Please enter a valid radius.';
      return;
    }

    let res = `--- GEOMETRY CALCULATOR REPORT ---nn`;
    res += `Selected Shape: ${shape.toUpperCase()}n`;
    res += `Radius (r):     ${r}n`;
    if (shape === 'cylinder') res += `Height (h):     ${h}n`;
    res += `n=== COMPUTED PROPERTIES ===n`;

    if (shape === 'circle') {
      const area = Math.PI * r * r;
      const circumference = 2 * Math.PI * r;
      res += `Area:          ${area.toFixed(4)} sq unitsn`;
      res += `Circumference: ${circumference.toFixed(4)} unitsn`;
    } else if (shape === 'sphere') {
      const vol = (4 / 3) * Math.PI * Math.pow(r, 3);
      const surfaceArea = 4 * Math.PI * r * r;
      res += `Volume:       ${vol.toFixed(4)} cubic unitsn`;
      res += `Surface Area: ${surfaceArea.toFixed(4)} sq unitsn`;
    } else if (shape === 'cylinder') {
      const vol = Math.PI * r * r * h;
      const surfaceArea = 2 * Math.PI * r * h + 2 * Math.PI * r * r;
      res += `Volume:       ${vol.toFixed(4)} cubic unitsn`;
      res += `Surface Area: ${surfaceArea.toFixed(4)} sq unitsn`;
    }

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Geometry calculated for ${shape}!`, 'success');
  }

  const activeBtn = document.getElementById('calc-gc-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
