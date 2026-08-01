/**
 * Upgraded Real Matrix Transposition Engine
 * Self-contained 2x2 and 3x3 matrix input grid builder with real-time Aᵀ transposition calculations.
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('trans-size-select')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label">Select Matrix Dimension</label>
        <select id="trans-size-select" class="form-input">
          <option value="2x2">2x2 Matrix Transposition</option>
          <option value="3x3" selected>3x3 Matrix Transposition</option>
        </select>
      </div>
      <div style="margin-bottom:1.5rem">
        <h4 style="margin:0 0 0.5rem;font-size:0.9rem">Original Matrix A</h4>
        <div id="trans-matrix-grid" style="display:grid;gap:0.5rem;max-width:300px"></div>
      </div>
      <div class="flex gap-3 mt-4">
        <button id="calc-trans-btn" type="button" class="btn btn-primary flex-1">📐 Transpose Matrix (A → Aᵀ)</button>
      </div>
    `;
  }

  function renderGrid() {
    const size = document.getElementById('trans-size-select')?.value || '3x3';
    const n = size === '3x3' ? 3 : 2;

    const grid = document.getElementById('trans-matrix-grid');
    if (grid) {
      grid.style.gridTemplateColumns = `repeat(${n}, 1fr)`;

      let html = '';
      const defaultValues = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
      ];

      for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
          html += `<input type="number" id="tr_${r}_${c}" class="form-input" value="${defaultValues[r][c]}" style="text-align:center">`;
        }
      }
      grid.innerHTML = html;
    }
  }

  function computeTranspose() {
    const size = document.getElementById('trans-size-select')?.value || '3x3';
    const n = size === '3x3' ? 3 : 2;

    const A = [];
    for (let r = 0; r < n; r++) {
      A[r] = [];
      for (let c = 0; c < n; c++) {
        A[r][c] = parseFloat(document.getElementById(`tr_${r}_${c}`)?.value || 0);
      }
    }

    const AT = Array.from({ length: n }, () => Array(n).fill(0));
    let report = `==========================================================
               MATRIX TRANSPOSITION (Aᵀ)
==========================================================
Original Dimensions: (${n}x${n}) → Transposed Dimensions: (${n}x${n})

ORIGINAL MATRIX A:
`;
    A.forEach(row => {
      report += `  [ ${row.join(',\t')} ]\n`;
    });

    report += `\nROW TO COLUMN MAPPING (A[i][j] → Aᵀ[j][i]):\n`;
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        AT[c][r] = A[r][c];
        report += `• A[${r + 1},${c + 1}] (${A[r][c]})  ➜  Aᵀ[${c + 1},${r + 1}] (${A[r][c]})\n`;
      }
    }

    report += `\n==========================================================\nTRANSPOSED MATRIX Aᵀ:\n`;
    AT.forEach(row => {
      report += `  [ ${row.join(',\t')} ]\n`;
    });
    report += `==========================================================`;

    if (out) out.value = report;
    if (window.showToast) window.showToast('Matrix transposed to Aᵀ!', 'success');
  }

  const select = document.getElementById('trans-size-select');
  if (select) select.onchange = renderGrid;

  const activeBtn = document.getElementById('calc-trans-btn') || btn;
  if (activeBtn) activeBtn.onclick = () => computeTranspose();

  renderGrid();
  computeTranspose();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
