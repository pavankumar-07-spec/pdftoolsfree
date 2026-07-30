/**
 * Vector Magnitude & Normalization Engine - B.Tech Level Math
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  let inputV;

  if (typeof VectorInput !== 'undefined' && inputsContainer) {
    inputsContainer.innerHTML = `
      <div style="max-width:400px;margin-bottom:1rem">
        <div id="vector-v-box"></div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-norm-btn" class="btn btn-primary flex-1">📏 Compute Magnitude & Unit Vector</button>
      </div>
    `;
    inputV = new VectorInput('vector-v-box', { label: 'Input Vector (v)', defaultDimension: 3 });
    inputV.setData([3, 4, 12]);
  }

  function parseVector(str) {
    if (!str) return [];
    return str.replace(/[^d.,-]/g, ' ').trim().split(/s+/).map(Number).filter(n => !isNaN(n));
  }

  function calculate() {
    let v = [];
    if (inputV) {
      v = inputV.getData();
    } else {
      const textInput = document.getElementById('text-input');
      v = parseVector(textInput ? textInput.value : '3, 4, 12');
    }

    if (v.length === 0) {
      if (out) out.value = 'ERROR: Please enter a valid vector.';
      return;
    }

    let sumSq = 0;
    const squares = v.map(x => {
      const sq = x * x;
      sumSq += sq;
      return `${x}²`;
    });
    const mag = Math.sqrt(sumSq);

    if (mag === 0) {
      if (out) out.value = 'ERROR: Magnitude is 0 (Zero vector cannot be normalized).';
      return;
    }

    const unitVector = v.map(x => (x / mag).toFixed(6));

    let res = '--- VECTOR MAGNITUDE & NORMALIZATION ---nn';
    res += `Vector v = [${v.join(', ')}]nn`;
    res += `Formula: ||v|| = √(${squares.join(' + ')})n`;
    res += `||v|| = √(${sumSq}) = ${mag.toFixed(6)}nn`;
    res += `Normalized Unit Vector (v̂ = v / ||v||):n`;
    res += `v̂ = [${unitVector.join(', ')}]n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Magnitude & Unit Vector computed!', 'success');
  }

  const activeBtn = document.getElementById('calc-norm-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
