/**
 * Vector Dot Product (A · B) Engine
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
        <button id="calc-vec-btn" type="button" class="btn btn-primary flex-1">📐 Compute Vector Dot Product (A · B)</button>
      </div>
    `;
  }

  function compute() {
    
    const a = (document.getElementById('v-a')?.value || '1, 2, 3').split(',').map(n => parseFloat(n.trim()) || 0);
    const b = (document.getElementById('v-b')?.value || '4, 5, 6').split(',').map(n => parseFloat(n.trim()) || 0);
    const dot = a.reduce((sum, val, i) => sum + val * (b[i] || 0), 0);
    let res = '==========================================================\n             VECTOR DOT PRODUCT (A · B)\n==========================================================\nVector A = [' + a.join(', ') + ']\nVector B = [' + b.join(', ') + ']\n\nDot Product (A · B) = ' + dot + '\n==========================================================';
    if (out) out.value = res;
    if (window.showToast) window.showToast('Dot product = ' + dot, 'success');
    
  }

  const activeBtn = document.getElementById('calc-vec-btn') || btn;
  if (activeBtn) activeBtn.onclick = () => compute();

  compute();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
