/**
 * Vector Angle Engine - B.Tech Level Math
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
        <button id="calc-angle-btn" class="btn btn-primary flex-1">📐 Calculate Vector Angle</button>
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

    if (u.length === 0 || v.length === 0 || u.length !== v.length) {
      if (out) out.value = 'ERROR: Please provide two vectors of equal dimension (e.g. 2D or 3D).';
      return;
    }

    let dot = 0, magU = 0, magV = 0;
    for (let i = 0; i < u.length; i++) {
      dot += u[i] * v[i];
      magU += u[i] * u[i];
      magV += v[i] * v[i];
    }
    magU = Math.sqrt(magU);
    magV = Math.sqrt(magV);

    if (magU === 0 || magV === 0) {
      if (out) out.value = 'ERROR: Magnitude of vector cannot be zero.';
      return;
    }

    let cosTheta = dot / (magU * magV);
    cosTheta = Math.max(-1, Math.min(1, cosTheta)); // Clamp to [-1, 1]
    const rad = Math.acos(cosTheta);
    const deg = rad * (180 / Math.PI);

    let res = '--- VECTOR ANGLE CALCULATION ---nn';
    res += `Vector A (u) = [${u.join(', ')}]n`;
    res += `Vector B (v) = [${v.join(', ')}]nn`;
    res += `Dot Product (u · v) = ${dot.toFixed(4)}n`;
    res += `||u|| = ${magU.toFixed(4)}n`;
    res += `||v|| = ${magV.toFixed(4)}n`;
    res += `cos(θ) = ${cosTheta.toFixed(6)}nn`;
    res += `Angle θ (Degrees) = ${deg.toFixed(4)}°n`;
    res += `Angle θ (Radians) = ${rad.toFixed(4)} radn`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Vector angle calculated!', 'success');
  }

  const activeBtn = document.getElementById('calc-angle-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
