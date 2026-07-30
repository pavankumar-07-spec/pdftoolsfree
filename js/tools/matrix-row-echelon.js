/**
 * Matrix Row Echelon Form (REF & RREF) Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof MatrixInput === 'undefined') return;

  const inputA = new MatrixInput('matrix-a-container', { label: 'Matrix A', defaultRows: 3, defaultCols: 3 });
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  function rref() {
    const M = inputA.getData().map(r => [...r]);
    const rows = M.length;
    const cols = M[0].length;

    let steps = '--- REDUCED ROW ECHELON FORM (RREF) COMPUTATION ---nn';
    let lead = 0;

    for (let r = 0; r < rows; r++) {
      if (cols <= lead) break;
      let i = r;
      while (Math.abs(M[i][lead]) < 1e-10) {
        i++;
        if (rows === i) {
          i = r;
          lead++;
          if (cols === lead) break;
        }
      }
      if (cols === lead) break;

      if (i !== r) {
        [M[i], M[r]] = [M[r], M[i]];
        steps += 'Swap Row ' + (r+1) + ' with Row ' + (i+1) + 'n';
      }

      let val = M[r][lead];
      if (Math.abs(val) > 1e-10 && Math.abs(val - 1) > 1e-10) {
        steps += 'Scale Row ' + (r+1) + ' by 1 / (' + val.toFixed(3) + ')n';
        for (let j = 0; j < cols; j++) M[r][j] /= val;
      }

      for (let k = 0; k < rows; k++) {
        if (k !== r) {
          let factor = M[k][lead];
          if (Math.abs(factor) > 1e-10) {
            steps += 'R' + (k+1) + ' = R' + (k+1) + ' - (' + factor.toFixed(3) + ') * R' + (r+1) + 'n';
            for (let j = 0; j < cols; j++) M[k][j] -= factor * M[r][j];
          }
        }
      }
      lead++;
    }

    steps += 'n=== REDUCED ROW ECHELON FORM (RREF) ===n';
    M.forEach(r => steps += '[ ' + r.map(v => Math.abs(v) < 1e-10 ? 0 : (Number.isInteger(v) ? v : v.toFixed(4))).join(', ') + ' ]n');

    if (out) out.value = steps;
  }

  if (btn) btn.addEventListener('click', rref);
  rref();
});
