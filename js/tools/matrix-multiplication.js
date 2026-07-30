/**
 * Matrix Multiplication Engine - B.Tech Level Math
 */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof MatrixInput === 'undefined') return;

  const inputA = new MatrixInput('matrix-a-container', { label: 'Matrix A', defaultRows: 2, defaultCols: 3 });
  const inputB = new MatrixInput('matrix-b-container', { label: 'Matrix B', defaultRows: 3, defaultCols: 2 });
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  function multiply() {
    const A = inputA.getData();
    const B = inputB.getData();

    if (A[0].length !== B.length) {
      if (out) out.value = 'ERROR: Cannot multiply. Columns of A [' + A[0].length + '] must equal Rows of B [' + B.length + '].';
      return;
    }

    const rowsA = A.length;
    const colsA = A[0].length;
    const colsB = B[0].length;
    const C = Array.from({ length: rowsA }, () => Array(colsB).fill(0));

    let steps = '--- MATRIX MULTIPLICATION STEP-BY-STEP ---n';
    steps += 'Dimensions: (' + rowsA + 'x' + colsA + ') × (' + colsA + 'x' + colsB + ') => Result (' + rowsA + 'x' + colsB + ')nn';

    for (let i = 0; i < rowsA; i++) {
      for (let j = 0; j < colsB; j++) {
        let sum = 0;
        let terms = [];
        for (let k = 0; k < colsA; k++) {
          const val = A[i][k] * B[k][j];
          sum += val;
          terms.push(A[i][k] + '*' + B[k][j]);
        }
        C[i][j] = sum;
        steps += 'Row ' + (i+1) + ' × Col ' + (j+1) + ': ' + terms.join(' + ') + ' = ' + sum + 'n';
      }
    }

    steps += 'n=== RESULTANT MATRIX C ===n';
    C.forEach(row => {
      steps += '[ ' + row.map(v => Number.isInteger(v) ? v : v.toFixed(4)).join(', ') + ' ]n';
    });

    if (out) out.value = steps;
  }

  if (btn) btn.addEventListener('click', multiply);
  multiply();
});
