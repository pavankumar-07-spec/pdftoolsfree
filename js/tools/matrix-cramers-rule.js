/**
 * Matrix Cramers Rule Solver Engine - B.Tech Level Math
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  let inputA;

  if (typeof MatrixInput !== 'undefined' && inputsContainer) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <div id="cramer-matrix-box"></div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-cramer-btn" class="btn btn-primary flex-1">📊 Solve via Cramers Rule</button>
      </div>
    `;
    inputA = new MatrixInput('cramer-matrix-box', { label: 'Augmented System Matrix [A | B] (3x4)', defaultRows: 3, defaultCols: 4 });
    inputA.setData([
      [2, 1, -1, 8],
      [-3, -1, 2, -11],
      [-2, 1, 2, -3]
    ]);
  }

  function det2(m) {
    return m[0][0]*m[1][1] - m[0][1]*m[1][0];
  }

  function det3(m) {
    return m[0][0]*(m[1][1]*m[2][2] - m[1][2]*m[2][1])
         - m[0][1]*(m[1][0]*m[2][2] - m[1][2]*m[2][0])
         + m[0][2]*(m[1][0]*m[2][1] - m[1][1]*m[2][0]);
  }

  function calculate() {
    if (!inputA) return;
    const data = inputA.getData();
    const rows = data.length;
    const cols = data[0].length;

    if (cols !== rows + 1 || (rows !== 2 && rows !== 3)) {
      if (out) out.value = "ERROR: Cramers Rule solver supports 2x3 or 3x4 augmented matrices [A | B].";
      return;
    }

    // Extract Coefficient Matrix A and Constants B
    const A = data.map(r => r.slice(0, rows));
    const B = data.map(r => r[rows]);

    const detA = rows === 2 ? det2(A) : det3(A);

    let res = "--- CRAMER'S RULE SOLVER ---nn";
    res += `System Matrix A:n${A.map(r => '[ ' + r.join(', ') + ' ]').join('n')}nn`;
    res += `Constants Vector B: [ ${B.join(', ')} ]nn`;
    res += `Determinant det(A) = ${detA}nn`;

    if (detA === 0) {
      res += 'ERROR: det(A) = 0. The system does NOT have a unique solution (Inconsistent or Infinite solutions).n';
      if (out) out.value = res;
      return;
    }

    const vars = rows === 2 ? ['x', 'y'] : ['x', 'y', 'z'];
    const solutions = [];

    for (let i = 0; i < rows; i++) {
      // Create Ai by replacing column i with B
      const Ai = A.map((row, rIdx) => {
        const copy = [...row];
        copy[i] = B[rIdx];
        return copy;
      });

      const detAi = rows === 2 ? det2(Ai) : det3(Ai);
      const val = detAi / detA;
      solutions.push(val);

      res += `det(A_${vars[i]}) = ${detAi}n`;
      res += `${vars[i]} = det(A_${vars[i]}) / det(A) = ${detAi} / ${detA} = ${val.toFixed(4)}nn`;
    }

    res += '=== FINAL SOLUTION ===n';
    vars.forEach((vName, idx) => {
      res += `${vName} = ${solutions[idx].toFixed(4)}n`;
    });

    if (out) out.value = res;
    if (window.showToast) window.showToast('Cramers Rule solved successfully!', 'success');
  }

  const activeBtn = document.getElementById('calc-cramer-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  if (inputA) calculate();
});
