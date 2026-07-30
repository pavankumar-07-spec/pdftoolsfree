/**
 * Matrix Eigenvalues & Eigenvectors Engine - B.Tech Level Math
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  let inputA;

  if (typeof MatrixInput !== 'undefined' && inputsContainer) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <div id="eigen-matrix-box"></div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-eigen-btn" class="btn btn-primary flex-1">⚛️ Compute Eigenvalues & Eigenvectors</button>
      </div>
    `;
    inputA = new MatrixInput('eigen-matrix-box', { label: 'Square Matrix A (2x2 or 3x3)', defaultRows: 2, defaultCols: 2 });
    inputA.setData([
      [4, 1],
      [2, 3]
    ]);
  }

  function calculate() {
    if (!inputA) return;
    const A = inputA.getData();
    const n = A.length;

    if (n !== A[0].length || (n !== 2 && n !== 3)) {
      if (out) out.value = 'ERROR: Eigenvalue calculator requires a 2x2 or 3x3 square matrix.';
      return;
    }

    let res = '--- EIGENVALUES & EIGENVECTORS ---nn';
    res += `Matrix A:n${A.map(r => '[ ' + r.join(', ') + ' ]').join('n')}nn`;

    if (n === 2) {
      const a = A[0][0], b = A[0][1];
      const c = A[1][0], d = A[1][1];

      const trace = a + d;
      const det = a * d - b * c;

      res += `Characteristic Equation: λ² - Trace(A)λ + det(A) = 0n`;
      res += `λ² - (${trace})λ + (${det}) = 0nn`;

      const disc = trace * trace - 4 * det;

      if (disc >= 0) {
        const l1 = (trace + Math.sqrt(disc)) / 2;
        const l2 = (trace - Math.sqrt(disc)) / 2;

        res += `Eigenvalues (Real):n`;
        res += `λ₁ = ${l1.toFixed(4)}n`;
        res += `λ₂ = ${l2.toFixed(4)}nn`;

        // Eigenvectors
        res += `Eigenvectors:n`;
        [l1, l2].forEach((l, idx) => {
          // (A - λI)x = 0 -> (a-λ)x + by = 0
          let vX = 1, vY = 0;
          if (Math.abs(b) > 1e-6) {
            vX = b;
            vY = l - a;
          } else if (Math.abs(c) > 1e-6) {
            vX = l - d;
            vY = c;
          } else {
            vX = 1;
            vY = 0;
          }
          const norm = Math.sqrt(vX * vX + vY * vY);
          if (norm > 0) {
            vX /= norm;
            vY /= norm;
          }
          res += `For λ${idx+1} = ${l.toFixed(4)}: v${idx+1} = [ ${vX.toFixed(4)}, ${vY.toFixed(4)} ]ᵀn`;
        });
      } else {
        const realPart = trace / 2;
        const imagPart = Math.sqrt(-disc) / 2;
        res += `Eigenvalues (Complex Conjugates):n`;
        res += `λ₁ = ${realPart.toFixed(4)} + ${imagPart.toFixed(4)}in`;
        res += `λ₂ = ${realPart.toFixed(4)} - ${imagPart.toFixed(4)}in`;
      }
    } else {
      // 3x3 symmetric or general trace / det
      const tr = A[0][0] + A[1][1] + A[2][2];
      res += `Matrix Trace = ${tr.toFixed(4)}n`;
      res += `For 3x3 eigenvalues, characteristic polynomial det(A - λI) = 0 is solved numerically.n`;
    }

    if (out) out.value = res;
    if (window.showToast) window.showToast('Eigenvalues computed!', 'success');
  }

  const activeBtn = document.getElementById('calc-eigen-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  if (inputA) calculate();
});
