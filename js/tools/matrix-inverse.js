/**
 * Matrix Inverse Engine - B.Tech Level Math
 */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof MatrixInput === 'undefined') return;

  const inputA = new MatrixInput('matrix-a-container', { label: 'Square Matrix A', defaultRows: 3, defaultCols: 3 });
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  function det2(m) { return m[0][0]*m[1][1] - m[0][1]*m[1][0]; }

  function getDet(M) {
    const n = M.length;
    if (n === 1) return M[0][0];
    if (n === 2) return det2(M);
    let d = 0;
    for (let c = 0; c < n; c++) {
      const sub = M.slice(1).map(r => r.filter((_, col) => col !== c));
      d += ((c % 2 === 0 ? 1 : -1) * M[0][c] * getDet(sub));
    }
    return d;
  }

  function computeInverse() {
    const A = inputA.getData();
    const n = A.length;

    if (n !== A[0].length) {
      if (out) out.value = 'ERROR: Only square matrices have an inverse.';
      return;
    }

    const d = getDet(A);
    let steps = '--- MATRIX INVERSE COMPUTATION ---nDeterminant det(A) = ' + d + 'nn';

    if (Math.abs(d) < 1e-12) {
      steps += 'Result: MATRIX IS SINGULAR (det(A) = 0). Inverse does not exist!';
      if (out) out.value = steps;
      return;
    }

    if (n === 2) {
      const inv = [
        [A[1][1]/d, -A[0][1]/d],
        [-A[1][0]/d, A[0][0]/d]
      ];
      steps += 'Formula for 2x2: (1/det) * [[d, -b], [-c, a]]nn=== INVERSE MATRIX A⁻¹ ===n';
      inv.forEach(r => steps += '[ ' + r.map(v => v.toFixed(4)).join(', ') + ' ]n');
      if (out) out.value = steps;
      return;
    }

    // Cofactor matrix & Adjugate
    const cofactors = Array.from({ length: n }, () => Array(n).fill(0));
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        const sub = A.filter((_, rowIdx) => rowIdx !== r).map(row => row.filter((_, colIdx) => colIdx !== c));
        const subDet = getDet(sub);
        const sign = ((r + c) % 2 === 0) ? 1 : -1;
        cofactors[r][c] = sign * subDet;
      }
    }

    // Adjugate is transpose of cofactor
    const adj = Array.from({ length: n }, () => Array(n).fill(0));
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        adj[r][c] = cofactors[c][r];
      }
    }

    const inv = Array.from({ length: n }, () => Array(n).fill(0));
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        inv[r][c] = adj[r][c] / d;
      }
    }

    steps += '=== ADJUGATE MATRIX adj(A) ===n';
    adj.forEach(r => steps += '[ ' + r.join(', ') + ' ]n');
    steps += 'n=== INVERSE MATRIX A⁻¹ = (1/det)*adj(A) ===n';
    inv.forEach(r => steps += '[ ' + r.map(v => v.toFixed(4)).join(', ') + ' ]n');

    if (out) out.value = steps;
  }

  if (btn) btn.addEventListener('click', computeInverse);
  computeInverse();
});
