/**
 * Vector Addition & Subtraction Engine - B.Tech Level Math
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  let inputA, inputB;

  if (typeof VectorInput !== 'undefined' && inputsContainer) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div id="vector-a-box"></div>
        <div id="vector-b-box"></div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-add-sub-btn" class="btn btn-primary flex-1">➕ Compute Sum & Difference</button>
      </div>
    `;
    inputA = new VectorInput('vector-a-box', { label: 'Vector A (u)', defaultDimension: 3 });
    inputB = new VectorInput('vector-b-box', { label: 'Vector B (v)', defaultDimension: 3 });
    inputA.setData([5, -2, 4]);
    inputB.setData([1, 7, -3]);
  }

  function parseVector(str) {
    if (!str) return [];
    return str.replace(/[^d.,-]/g, ' ').trim().split(/s+/).map(Number).filter(n => !isNaN(n));
  }

  function calculate() {
    let u = [], v = [];
    if (inputA && inputB) {
      u = inputA.getData();
      v = inputB.getData();
    } else {
      const textInput = document.getElementById('text-input');
      const lines = textInput ? textInput.value.split('n') : [];
      u = parseVector(lines[0] || '5, -2, 4');
      v = parseVector(lines[1] || '1, 7, -3');
    }

    if (u.length === 0 || v.length === 0 || u.length !== v.length) {
      if (out) out.value = 'ERROR: Vectors u and v must have equal dimensions.';
      return;
    }

    const sum = u.map((val, i) => val + v[i]);
    const diffAB = u.map((val, i) => val - v[i]);
    const diffBA = v.map((val, i) => val - u[i]);

    let res = '--- VECTOR ADDITION & SUBTRACTION ---nn';
    res += `Vector u = [${u.join(', ')}]n`;
    res += `Vector v = [${v.join(', ')}]nn`;
    res += `1. Addition (u + v):n`;
    res += `   [${u.map((val, i) => `${val}+(${v[i]})`).join(', ')}] = [${sum.join(', ')}]nn`;
    res += `2. Subtraction (u - v):n`;
    res += `   [${u.map((val, i) => `${val}-(${v[i]})`).join(', ')}] = [${diffAB.join(', ')}]nn`;
    res += `3. Subtraction (v - u):n`;
    res += `   [${v.map((val, i) => `${val}-(${u[i]})`).join(', ')}] = [${diffBA.join(', ')}]n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Vector operations completed!', 'success');
  }

  const activeBtn = document.getElementById('calc-add-sub-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
