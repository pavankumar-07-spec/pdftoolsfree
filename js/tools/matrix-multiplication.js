/**
 * Upgraded Real Matrix Multiplication Engine
 * Self-contained 2x2, 3x3 matrix input grid builder with step-by-step dot product calculation.
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('mat-size-select')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label">Select Matrix Dimension</label>
        <select id="mat-size-select" class="form-input">
          <option value="2x2" selected>2x2 Matrix Multiplication</option>
          <option value="3x3">3x3 Matrix Multiplication</option>
        </select>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-bottom:1.5rem">
        <div>
          <h4 style="margin:0 0 0.5rem;font-size:0.9rem">Matrix A</h4>
          <div id="matrix-a-grid" style="display:grid;gap:0.5rem"></div>
        </div>
        <div>
          <h4 style="margin:0 0 0.5rem;font-size:0.9rem">Matrix B</h4>
          <div id="matrix-b-grid" style="display:grid;gap:0.5rem"></div>
        </div>
      </div>
      <div class="flex gap-3 mt-4">
        <button id="calc-mat-btn" type="button" class="btn btn-primary flex-1">📐 Calculate Matrix Product (A × B)</button>
      </div>
    `;
  }

  function renderGrids() {
    const size = document.getElementById('mat-size-select')?.value || '2x2';
    const n = size === '3x3' ? 3 : 2;

    const gridA = document.getElementById('matrix-a-grid');
    const gridB = document.getElementById('matrix-b-grid');

    if (gridA && gridB) {
      gridA.style.gridTemplateColumns = `repeat(${n}, 1fr)`;
      gridB.style.gridTemplateColumns = `repeat(${n}, 1fr)`;

      let htmlA = '', htmlB = '';
      let defaultValA = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
      let defaultValB = [[9, 8, 7], [6, 5, 4], [3, 2, 1]];

      for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
          htmlA += `<input type="number" id="a_${r}_${c}" class="form-input" value="${defaultValA[r][c]}" style="text-align:center">`;
          htmlB += `<input type="number" id="b_${r}_${c}" class="form-input" value="${defaultValB[r][c]}" style="text-align:center">`;
        }
      }
      gridA.innerHTML = htmlA;
      gridB.innerHTML = htmlB;
    }
  }

  function computeMultiplication() {
    const size = document.getElementById('mat-size-select')?.value || '2x2';
    const n = size === '3x3' ? 3 : 2;

    const A = [];
    const B = [];

    for (let r = 0; r < n; r++) {
      A[r] = [];
      B[r] = [];
      for (let c = 0; c < n; c++) {
        A[r][c] = parseFloat(document.getElementById(`a_${r}_${c}`)?.value || 0);
        B[r][c] = parseFloat(document.getElementById(`b_${r}_${c}`)?.value || 0);
      }
    }

    const C = Array.from({ length: n }, () => Array(n).fill(0));
    let steps = `==========================================================
             MATRIX MULTIPLICATION ENGINE
==========================================================
Dimensions: (${n}x${n}) × (${n}x${n}) → Result (${n}x${n})

STEP-BY-STEP DOT PRODUCT CALCULATIONS:\n`;

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        let sum = 0;
        let terms = [];
        for (let k = 0; k < n; k++) {
          const val = A[i][k] * B[k][j];
          sum += val;
          terms.push(`(${A[i][k]} × ${B[k][j]})`);
        }
        C[i][j] = sum;
        steps += `• C[${i + 1},${j + 1}] = ${terms.join(' + ')} = ${sum}\n`;
      }
    }

    steps += `\n==========================================================\nRESULTANT MATRIX C (A × B):\n`;
    C.forEach(row => {
      steps += `  [ ${row.map(v => Number.isInteger(v) ? v : v.toFixed(4)).join(',\t')} ]\n`;
    });
    steps += `==========================================================`;

    if (out) out.value = steps;
    if (window.showToast) window.showToast('Matrix multiplication calculated!', 'success');
  }

  const select = document.getElementById('mat-size-select');
  if (select) select.onchange = renderGrids;

  const activeBtn = document.getElementById('calc-mat-btn') || btn;
  if (activeBtn) activeBtn.onclick = () => computeMultiplication();

  renderGrids();
  computeMultiplication();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
