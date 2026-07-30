/**
 * Vector Dot Product Engine - B.Tech Level Math
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
        <button id="calc-dot-btn" class="btn btn-primary flex-1">📊 Compute Dot Product</button>
      </div>
    `;
    inputA = new VectorInput('vector-a-box', { label: 'Vector A (u)', defaultDimension: 3 });
    inputB = new VectorInput('vector-b-box', { label: 'Vector B (v)', defaultDimension: 3 });
    inputA.setData([2, 3, 4]);
    inputB.setData([5, 6, 7]);
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
      u = parseVector(lines[0] || '2, 3, 4');
      v = parseVector(lines[1] || '5, 6, 7');
    }

    if (u.length === 0 || v.length === 0 || u.length !== v.length) {
      if (out) out.value = 'ERROR: Vectors must have equal dimension.';
      return;
    }

    let dot = 0;
    let terms = [];
    for (let i = 0; i < u.length; i++) {
      const prod = u[i] * v[i];
      dot += prod;
      terms.push(`(${u[i]} × ${v[i]})`);
    }

    let res = '--- VECTOR DOT PRODUCT (u · v) ---nn';
    res += `u = [${u.join(', ')}]n`;
    res += `v = [${v.join(', ')}]nn`;
    res += `Formula: u · v = ${terms.join(' + ')}n`;
    res += `Result (Scalar): ${dot}n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Dot product computed!', 'success');
  }

  const activeBtn = document.getElementById('calc-dot-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
