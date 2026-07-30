/**
 * Linear Equations Solver Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof MatrixInput === 'undefined') return;
  const inputA = new MatrixInput('matrix-a-container', { label: 'Augmented System Matrix [A | B] (3x4)', defaultRows: 3, defaultCols: 4 });
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  function solve() {
    const M = inputA.getData().map(r => [...r]);
    const n = M.length;
    const cols = M[0].length;

    let res = `--- LINEAR SYSTEM GAUSSIAN ELIMINATION ---nn`;

    // Elimination
    for (let i = 0; i < n; i++) {
      let maxEl = Math.abs(M[i][i]);
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(M[k][i]) > maxEl) {
          maxEl = Math.abs(M[k][i]);
          maxRow = k;
        }
      }
      for (let k = i; k < cols; k++) {
        const tmp = M[maxRow][k];
        M[maxRow][k] = M[i][k];
        M[i][k] = tmp;
      }
      if (Math.abs(M[i][i]) < 1e-10) {
        if (out) out.value = res + 'ERROR: System matrix is singular or has non-unique solutions.';
        return;
      }

      for (let k = i + 1; k < n; k++) {
        const c = -M[k][i] / M[i][i];
        for (let j = i; j < cols; j++) {
          if (i === j) M[k][j] = 0;
          else M[k][j] += c * M[i][j];
        }
      }
    }

    // Back substitution
    const x = Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      x[i] = M[i][n] / M[i][i];
      for (let k = i - 1; k >= 0; k--) {
        M[k][n] -= M[k][i] * x[i];
      }
    }

    res += '=== SYSTEM SOLUTIONS ===n';
    x.forEach((val, idx) => {
      res += `Variable x${idx+1} = ${val.toFixed(4)}n`;
    });
    if (out) out.value = res;
  }

  if (btn) btn.addEventListener('click', solve);
  solve();
});
