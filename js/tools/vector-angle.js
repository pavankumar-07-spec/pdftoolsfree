/**
 * Angle Between Vectors (θ) Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('v-a')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem">
        <div>
          <label class="form-label">Vector A (x, y, z)</label>
          <input type="text" id="v-a" class="form-input" value="1, 2, 3">
        </div>
        <div>
          <label class="form-label">Vector B (x, y, z)</label>
          <input type="text" id="v-b" class="form-input" value="4, 5, 6">
        </div>
      </div>
      <div class="flex gap-3 mt-4">
        <button id="calc-vec-btn" type="button" class="btn btn-primary flex-1">📐 Compute Angle Between Vectors (θ)</button>
      </div>
    `;
  }

  function compute() {
    
    const a = (document.getElementById('v-a')?.value || '1, 0, 0').split(',').map(n => parseFloat(n.trim()) || 0);
    const b = (document.getElementById('v-b')?.value || '0, 1, 0').split(',').map(n => parseFloat(n.trim()) || 0);
    const dot = a.reduce((sum, val, i) => sum + val * (b[i] || 0), 0);
    const magA = Math.sqrt(a.reduce((sum, n) => sum + n * n, 0));
    const magB = Math.sqrt(b.reduce((sum, n) => sum + n * n, 0));
    const cosTheta = (magA * magB) > 0 ? Math.max(-1, Math.min(1, dot / (magA * magB))) : 0;
    const rad = Math.acos(cosTheta);
    const deg = (rad * 180) / Math.PI;
    let res = '==========================================================\n             ANGLE BETWEEN VECTORS (θ)\n==========================================================\nVector A = [' + a.join(', ') + ']\nVector B = [' + b.join(', ') + ']\n\nAngle (θ) = ' + deg.toFixed(2) + '° (' + rad.toFixed(4) + ' radians)\ncos(θ) = ' + cosTheta.toFixed(4) + '\n==========================================================';
    if (out) out.value = res;
    if (window.showToast) window.showToast('Angle θ = ' + deg.toFixed(1) + '°', 'success');
    
  }

  const activeBtn = document.getElementById('calc-vec-btn') || btn;
  if (activeBtn) activeBtn.onclick = () => compute();

  compute();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
