/**
 * Vector Projection Engine - B.Tech Level Math
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
        <button id="calc-proj-btn" class="btn btn-primary flex-1">🎯 Compute Vector Projection (u onto v)</button>
      </div>
    `;
    inputA = new VectorInput('vector-a-box', { label: 'Vector A (u)', defaultDimension: 3 });
    inputB = new VectorInput('vector-b-box', { label: 'Target Vector B (v)', defaultDimension: 3 });
    inputA.setData([3, 4, 0]);
    inputB.setData([1, 0, 0]);
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
      u = parseVector(lines[0] || '3, 4, 0');
      v = parseVector(lines[1] || '1, 0, 0');
    }

    if (u.length === 0 || v.length === 0 || u.length !== v.length) {
      if (out) out.value = 'ERROR: Vectors u and v must have equal dimensions.';
      return;
    }

    let dot = 0, magVSq = 0;
    for (let i = 0; i < u.length; i++) {
      dot += u[i] * v[i];
      magVSq += v[i] * v[i];
    }
    const magV = Math.sqrt(magVSq);

    if (magVSq === 0) {
      if (out) out.value = 'ERROR: Target vector v cannot be zero vector.';
      return;
    }

    const scalarProj = dot / magV;
    const factor = dot / magVSq;
    const vecProj = v.map(val => val * factor);

    let res = '--- VECTOR PROJECTION (proj_v u) ---nn';
    res += `Vector u = [${u.join(', ')}]n`;
    res += `Vector v = [${v.join(', ')}]nn`;
    res += `Dot Product (u · v) = ${dot}n`;
    res += `||v||² = ${magVSq}n`;
    res += `||v|| = ${magV.toFixed(4)}nn`;
    res += `Scalar Projection (comp_v u) = (u · v) / ||v|| = ${scalarProj.toFixed(6)}nn`;
    res += `Vector Projection (proj_v u) = ((u · v) / ||v||²) * v:n`;
    res += `proj_v u = [${vecProj.map(n => n.toFixed(6)).join(', ')}]n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Vector projection calculated!', 'success');
  }

  const activeBtn = document.getElementById('calc-proj-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
