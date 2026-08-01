/**
 * Upgraded Real Matrix Determinant Engine
 * Self-contained 2x2 and 3x3 matrix determinant solver (|A|) using Laplace cofactor expansion.
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('det-size-select')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label">Select Square Matrix Dimension</label>
        <select id="det-size-select" class="form-input">
          <option value="2x2">2x2 Matrix Determinant</option>
          <option value="3x3" selected>3x3 Matrix Determinant</option>
        </select>
      </div>
      <div style="margin-bottom:1.5rem">
        <h4 style="margin:0 0 0.5rem;font-size:0.9rem">Square Matrix A</h4>
        <div id="det-matrix-grid" style="display:grid;gap:0.5rem;max-width:300px"></div>
      </div>
      <div class="flex gap-3 mt-4">
        <button id="calc-det-btn" type="button" class="btn btn-primary flex-1">📐 Calculate Determinant |A|</button>
      </div>
    `;
  }

  function renderGrid() {
    const size = document.getElementById('det-size-select')?.value || '3x3';
    const n = size === '3x3' ? 3 : 2;

    const grid = document.getElementById('det-matrix-grid');
    if (grid) {
      grid.style.gridTemplateColumns = `repeat(${n}, 1fr)`;

      let html = '';
      const defaultValues = [
        [3, 8, 1],
        [4, 6, 2],
        [7, 9, 5]
      ];

      for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
          html += `<input type="number" id="det_${r}_${c}" class="form-input" value="${defaultValues[r][c]}" style="text-align:center">`;
        }
      }
      grid.innerHTML = html;
    }
  }

  function computeDeterminant() {
    const size = document.getElementById('det-size-select')?.value || '3x3';
    const n = size === '3x3' ? 3 : 2;

    const M = [];
    for (let r = 0; r < n; r++) {
      M[r] = [];
      for (let c = 0; c < n; c++) {
        M[r][c] = parseFloat(document.getElementById(`det_${r}_${c}`)?.value || 0);
      }
    }

    let report = `==========================================================
              MATRIX DETERMINANT CALCULATOR
==========================================================
Matrix Size: (${n}x${n})

INPUT MATRIX A:
`;
    M.forEach(row => {
      report += `  [ ${row.join(',\t')} ]\n`;
    });

    report += `\nCOFACTOR EXPANSION ALONG ROW 1:\n`;

    let det = 0;
    if (n === 2) {
      const a = M[0][0], b = M[0][1], c = M[1][0], d = M[1][1];
      det = (a * d) - (b * c);
      report += `|A| = (a × d) - (b × c)\n`;
      report += `    = (${a} × ${d}) - (${b} × ${c})\n`;
      report += `    = ${a*d} - ${b*c} = ${det}\n`;
    } else {
      // 3x3 Determinant
      const a = M[0][0], b = M[0][1], c = M[0][2];
      const subA = M[1][1] * M[2][2] - M[1][2] * M[2][1];
      const subB = M[1][0] * M[2][2] - M[1][2] * M[2][0];
      const subC = M[1][0] * M[2][1] - M[1][1] * M[2][0];

      det = a * subA - b * subB + c * subC;

      report += `• Term 1 (+${a}): ${a} × (${M[1][1]}×${M[2][2]} - ${M[1][2]}×${M[2][1]}) = ${a} × (${subA}) = ${a * subA}\n`;
      report += `• Term 2 (-${b}): -${b} × (${M[1][0]}×${M[2][2]} - ${M[1][2]}×${M[2][0]}) = -${b} × (${subB}) = ${-b * subB}\n`;
      report += `• Term 3 (+${c}): ${c} × (${M[1][0]}×${M[2][1]} - ${M[1][1]}×${M[2][0]}) = ${c} × (${subC}) = ${c * subC}\n`;
    }

    report += `\n==========================================================\nDETERMINANT RESULT: det(A) = |A| = ${det}\n==========================================================`;

    if (out) out.value = report;
    if (window.showToast) window.showToast(`det(A) = ${det}`, 'success');
  }

  const select = document.getElementById('det-size-select');
  if (select) select.onchange = renderGrid;

  const activeBtn = document.getElementById('calc-det-btn') || btn;
  if (activeBtn) activeBtn.onclick = () => computeDeterminant();

  renderGrid();
  computeDeterminant();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
