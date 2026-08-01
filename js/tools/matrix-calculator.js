/**
 * Matrix Calculator Engine - B.Tech Level Math
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  if (typeof MatrixInput === 'undefined') return;

  const inputA = new MatrixInput('matrix-a-container', { label: 'Matrix A', defaultRows: 3, defaultCols: 3 });
  const inputB = new MatrixInput('matrix-b-container', { label: 'Matrix B', defaultRows: 3, defaultCols: 3 });
  const opSelect = document.getElementById('matrix-operation');
  const btn = document.getElementById('generate-btn');
  const clearBtn = document.getElementById('clear-btn');
  const out = document.getElementById('main-output');

  function calculate() {
    const A = inputA.getData();
    const B = inputB.getData();
    const op = opSelect ? opSelect.value : 'add';

    let result = [];
    let steps = '';

    if (op === 'add' || op === 'sub') {
      if (A.length !== B.length || A[0].length !== B[0].length) {
        if (out) out.value = 'ERROR: Addition and Subtraction require matrices of identical dimensions.';
        if (window.showToast) window.showToast('Matrix dimensions mismatch!', 'error');
        return;
      }
      const rows = A.length;
      const cols = A[0].length;
      result = Array.from({ length: rows }, () => Array(cols).fill(0));

      steps += '--- MATRIX ' + (op === 'add' ? 'ADDITION (A + B)' : 'SUBTRACTION (A - B)') + ' ---nn';
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (op === 'add') {
            result[r][c] = A[r][c] + B[r][c];
            steps += 'Cell (' + (r+1) + ',' + (c+1) + '): ' + A[r][c] + ' + ' + B[r][c] + ' = ' + result[r][c] + 'n';
          } else {
            result[r][c] = A[r][c] - B[r][c];
            steps += 'Cell (' + (r+1) + ',' + (c+1) + '): ' + A[r][c] + ' - ' + B[r][c] + ' = ' + result[r][c] + 'n';
          }
        }
      }
    } else if (op === 'mult') {
      if (A[0].length !== B.length) {
        if (out) out.value = 'ERROR: Multiplication requires Cols(A) [' + A[0].length + '] == Rows(B) [' + B.length + '].';
        if (window.showToast) window.showToast('Matrix multiplication size error!', 'error');
        return;
      }
      const rowsA = A.length;
      const colsA = A[0].length;
      const colsB = B[0].length;
      result = Array.from({ length: rowsA }, () => Array(colsB).fill(0));

      steps += '--- MATRIX MULTIPLICATION (A × B) ---n';
      steps += 'Matrix A (' + rowsA + 'x' + colsA + ') × Matrix B (' + colsA + 'x' + colsB + ') => Result (' + rowsA + 'x' + colsB + ')nn';

      for (let r = 0; r < rowsA; r++) {
        for (let c = 0; c < colsB; c++) {
          let sum = 0;
          let terms = [];
          for (let k = 0; k < colsA; k++) {
            const prod = A[r][k] * B[k][c];
            sum += prod;
            terms.push('(' + A[r][k] + ' × ' + B[k][c] + ')');
          }
          result[r][c] = sum;
          steps += 'C[' + (r+1) + '][' + (c+1) + '] = ' + terms.join(' + ') + ' = ' + sum + 'n';
        }
      }
    }

    steps += 'n=== RESULT MATRIX ===n';
    result.forEach(row => {
      steps += '[ ' + row.map(n => Number.isInteger(n) ? n : n.toFixed(4)).join(', ') + ' ]n';
    });

    if (out) out.value = steps;
    if (window.showToast) window.showToast('Matrix operation completed!', 'success');
  }

  if (btn) btn.addEventListener('click', calculate);
  if (clearBtn) clearBtn.addEventListener('click', () => {
    inputA.setData([[0,0,0],[0,0,0],[0,0,0]]);
    inputB.setData([[0,0,0],[0,0,0],[0,0,0]]);
    if (out) out.value = '';
  });

  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
