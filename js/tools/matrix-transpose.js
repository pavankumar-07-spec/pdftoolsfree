/**
 * Matrix Transpose Engine - B.Tech Level Math
 */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof MatrixInput === 'undefined') return;

  const inputA = new MatrixInput('matrix-a-container', { label: 'Matrix A', defaultRows: 3, defaultCols: 3 });
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  function transpose() {
    const A = inputA.getData();
    const rows = A.length;
    const cols = A[0].length;

    const AT = Array.from({ length: cols }, () => Array(rows).fill(0));
    let steps = '--- MATRIX TRANSPOSE (Aᵀ) ---nOriginal Dimensions: (' + rows + ' x ' + cols + ') => Transposed Dimensions: (' + cols + ' x ' + rows + ')nn';

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        AT[c][r] = A[r][c];
        steps += 'A[' + (r+1) + '][' + (c+1) + '] (' + A[r][c] + ')  ==>  Aᵀ[' + (c+1) + '][' + (r+1) + '] (' + A[r][c] + ')n';
      }
    }

    steps += 'n=== TRANSPOSED MATRIX Aᵀ ===n';
    AT.forEach(row => steps += '[ ' + row.join(', ') + ' ]n');

    if (out) out.value = steps;
  }

  if (btn) btn.addEventListener('click', transpose);
  transpose();
});
