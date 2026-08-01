/**
 * Vector Addition & Subtraction Engine
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
        <button id="calc-vec-btn" type="button" class="btn btn-primary flex-1">📐 Compute Vector Addition & Subtraction</button>
      </div>
    `;
  }

  function compute() {
    
    const a = (document.getElementById('v-a')?.value || '1, 2, 3').split(',').map(n => parseFloat(n.trim()) || 0);
    const b = (document.getElementById('v-b')?.value || '4, 5, 6').split(',').map(n => parseFloat(n.trim()) || 0);
    const add = a.map((val, i) => val + (b[i] || 0));
    const sub = a.map((val, i) => val - (b[i] || 0));
    let res = '==========================================================\n             VECTOR ADDITION & SUBTRACTION\n==========================================================\nVector A = [' + a.join(', ') + ']\nVector B = [' + b.join(', ') + ']\n\nVector A + B = [' + add.join(', ') + ']\nVector A - B = [' + sub.join(', ') + ']\n==========================================================';
    if (out) out.value = res;
    if (window.showToast) window.showToast('Vector calculation complete!', 'success');
    
  }

  const activeBtn = document.getElementById('calc-vec-btn') || btn;
  if (activeBtn) activeBtn.onclick = () => compute();

  compute();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
