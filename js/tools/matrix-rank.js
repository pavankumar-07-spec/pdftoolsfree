/**
 * Matrix Rank Engine - B.Tech Level Math
 */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof MatrixInput === 'undefined') return;

  const inputA = new MatrixInput('matrix-a-container', { label: 'Matrix A', defaultRows: 3, defaultCols: 3 });
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  function calculateRank() {
    const origA = inputA.getData();
    const rows = origA.length;
    const cols = origA[0].length;
    const M = origA.map(r => [...r]);

    let steps = '--- MATRIX RANK COMPUTATION VIA GAUSSIAN ELIMINATION ---n';

    let rank = 0;
    let row = 0;

    for (let col = 0; col < cols && row < rows; col++) {
      let pivot = row;
      for (let i = row + 1; i < rows; i++) {
        if (Math.abs(M[i][col]) > Math.abs(M[pivot][col])) {
          pivot = i;
        }
      }

      if (Math.abs(M[pivot][col]) < 1e-10) continue;

      if (pivot !== row) {
        [M[row], M[pivot]] = [M[pivot], M[row]];
        steps += 'Swap Row ' + (row+1) + ' with Row ' + (pivot+1) + 'n';
      }

      const pivotVal = M[row][col];
      for (let i = row + 1; i < rows; i++) {
        const factor = M[i][col] / pivotVal;
        if (Math.abs(factor) > 1e-10) {
          steps += 'R' + (i+1) + ' = R' + (i+1) + ' - (' + factor.toFixed(2) + ') * R' + (row+1) + 'n';
          for (let j = col; j < cols; j++) {
            M[i][j] -= factor * M[row][j];
          }
        }
      }
      row++;
      rank++;
    }

    steps += 'n=== ROW ECHELON FORM ===n';
    M.forEach(r => steps += '[ ' + r.map(v => Math.abs(v) < 1e-10 ? 0 : v.toFixed(3)).join(', ') + ' ]n');
    steps += 'nNumber of Non-Zero Rows = ' + rank + 'nFINAL RANK Rank(A) = ' + rank;

    if (out) out.value = steps;
  }

  if (btn) btn.addEventListener('click', calculateRank);
  calculateRank();
});
