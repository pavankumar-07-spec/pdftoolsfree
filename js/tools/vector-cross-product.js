/**
 * Vector Cross Product Engine - B.Tech Level Math
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
        <button id="calc-cross-btn" class="btn btn-primary flex-1">✖️ Compute Cross Product</button>
      </div>
    `;
    inputA = new VectorInput('vector-a-box', { label: 'Vector A (u)', defaultDimension: 3 });
    inputB = new VectorInput('vector-b-box', { label: 'Vector B (v)', defaultDimension: 3 });
    inputA.setData([1, 2, 3]);
    inputB.setData([4, 5, 6]);
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
      u = parseVector(lines[0] || '1, 2, 3');
      v = parseVector(lines[1] || '4, 5, 6');
    }

    if (u.length !== 3 || v.length !== 3) {
      if (out) out.value = 'ERROR: Vector Cross Product requires 3D vectors [x, y, z].';
      return;
    }

    const cx = u[1] * v[2] - u[2] * v[1];
    const cy = u[2] * v[0] - u[0] * v[2];
    const cz = u[0] * v[1] - u[1] * v[0];
    const mag = Math.sqrt(cx*cx + cy*cy + cz*cz);

    let res = '--- VECTOR CROSS PRODUCT (u × v) ---nn';
    res += `u = [${u.join(', ')}]n`;
    res += `v = [${v.join(', ')}]nn`;
    res += `i component = (${u[1]}×${v[2]} - ${u[2]}×${v[1]}) = ${cx}n`;
    res += `j component = (${u[2]}×${v[0]} - ${u[0]}×${v[2]}) = ${cy}n`;
    res += `k component = (${u[0]}×${v[1]} - ${u[1]}×${v[0]}) = ${cz}nn`;
    res += `Result Vector (u × v) = [${cx}, ${cy}, ${cz}]n`;
    res += `Result Vector Notation = ${cx}i + ${cy}j + ${cz}kn`;
    res += `Magnitude ||u × v|| = ${mag.toFixed(4)}n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Cross product computed!', 'success');
  }

  const activeBtn = document.getElementById('calc-cross-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
