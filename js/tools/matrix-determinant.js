/**
 * Matrix Determinant Engine - B.Tech Level Math
 */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof MatrixInput === 'undefined') return;

  const inputA = new MatrixInput('matrix-a-container', { label: 'Square Matrix A', defaultRows: 3, defaultCols: 3 });
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  function getDeterminant(M) {
    const n = M.length;
    if (n === 1) return { det: M[0][0], steps: 'det = ' + M[0][0] };
    if (n === 2) {
      const det = M[0][0] * M[1][1] - M[0][1] * M[1][0];
      const steps = 'det = (' + M[0][0] + ' × ' + M[1][1] + ') - (' + M[0][1] + ' × ' + M[1][0] + ') = ' + det;
      return { det, steps };
    }

    let totalDet = 0;
    let steps = 'Laplace Expansion along Row 1 for ' + n + 'x' + n + ' Matrix:n';

    for (let c = 0; c < n; c++) {
      const subMatrix = M.slice(1).map(row => row.filter((_, colIdx) => colIdx !== c));
      const subRes = getDeterminant(subMatrix);
      const sign = (c % 2 === 0) ? 1 : -1;
      const term = sign * M[0][c] * subRes.det;
      totalDet += term;

      steps += 'Term ' + (c+1) + ': (' + (sign > 0 ? '+' : '-') + M[0][c] + ') × [Subdeterminant ' + subRes.det + '] = ' + term + 'n';
    }

    steps += 'nFinal Determinant det(A) = ' + totalDet;
    return { det: totalDet, steps };
  }

  function solve() {
    const A = inputA.getData();
    if (A.length !== A[0].length) {
      if (out) out.value = 'ERROR: Determinant can only be calculated for square matrices (n x n).';
      return;
    }
    const res = getDeterminant(A);
    if (out) out.value = res.steps;
  }

  if (btn) btn.addEventListener('click', solve);
  solve();
});
