/**
 * Upgraded Real Matrix Inverse Engine
 * Self-contained 2x2 and 3x3 matrix inverse solver (A⁻¹) using the adjugate method.
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('inv-size-select')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label">Select Square Matrix Dimension</label>
        <select id="inv-size-select" class="form-input">
          <option value="2x2">2x2 Matrix Inverse</option>
          <option value="3x3" selected>3x3 Matrix Inverse</option>
        </select>
      </div>
      <div style="margin-bottom:1.5rem">
        <h4 style="margin:0 0 0.5rem;font-size:0.9rem">Square Matrix A</h4>
        <div id="inv-matrix-grid" style="display:grid;gap:0.5rem;max-width:300px"></div>
      </div>
      <div class="flex gap-3 mt-4">
        <button id="calc-inv-btn" type="button" class="btn btn-primary flex-1">📐 Calculate Matrix Inverse (A⁻¹)</button>
      </div>
    `;
  }

  function renderGrid() {
    const size = document.getElementById('inv-size-select')?.value || '3x3';
    const n = size === '3x3' ? 3 : 2;

    const grid = document.getElementById('inv-matrix-grid');
    if (grid) {
      grid.style.gridTemplateColumns = `repeat(${n}, 1fr)`;

      let html = '';
      const defaultValues = [
        [1, 2, 3],
        [0, 1, 4],
        [5, 6, 0]
      ];

      for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
          html += `<input type="number" id="inv_${r}_${c}" class="form-input" value="${defaultValues[r][c]}" style="text-align:center">`;
        }
      }
      grid.innerHTML = html;
    }
  }

  function det2(m) { return m[0][0] * m[1][1] - m[0][1] * m[1][0]; }

  function getDet(M) {
    const n = M.length;
    if (n === 1) return M[0][0];
    if (n === 2) return det2(M);
    let d = 0;
    for (let c = 0; c < n; c++) {
      const sub = M.slice(1).map(r => r.filter((_, col) => col !== c));
      d += ((c % 2 === 0 ? 1 : -1) * M[0][c] * getDet(sub));
    }
    return d;
  }

  function computeInverse() {
    const size = document.getElementById('inv-size-select')?.value || '3x3';
    const n = size === '3x3' ? 3 : 2;

    const A = [];
    for (let r = 0; r < n; r++) {
      A[r] = [];
      for (let c = 0; c < n; c++) {
        A[r][c] = parseFloat(document.getElementById(`inv_${r}_${c}`)?.value || 0);
      }
    }

    const d = getDet(A);
    let report = `==========================================================
               MATRIX INVERSE ENGINE (A⁻¹)
==========================================================
Dimensions: (${n}x${n})
Determinant det(A) = ${d}

`;

    if (Math.abs(d) < 1e-12) {
      report += `⚠️ MATRIX IS SINGULAR (det(A) = 0)\nResult: Inverse matrix A⁻¹ does NOT exist!`;
      if (out) out.value = report;
      if (window.showToast) window.showToast('Matrix is singular! det(A) = 0', 'error');
      return;
    }

    if (n === 2) {
      const inv = [
        [A[1][1] / d, -A[0][1] / d],
        [-A[1][0] / d, A[0][0] / d]
      ];
      report += `INVERSE MATRIX A⁻¹ = (1/det) × [[d, -b], [-c, a]]:\n`;
      inv.forEach(r => {
        report += `  [ ${r.map(v => Number.isInteger(v) ? v : v.toFixed(4)).join(',\t')} ]\n`;
      });
    } else {
      // 3x3 Cofactors & Adjugate
      const cofactors = Array.from({ length: n }, () => Array(n).fill(0));
      for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
          const sub = A.filter((_, rowIdx) => rowIdx !== r).map(row => row.filter((_, colIdx) => colIdx !== c));
          const subDet = getDet(sub);
          const sign = ((r + c) % 2 === 0) ? 1 : -1;
          cofactors[r][c] = sign * subDet;
        }
      }

      const adj = Array.from({ length: n }, () => Array(n).fill(0));
      for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
          adj[r][c] = cofactors[c][r];
        }
      }

      const inv = Array.from({ length: n }, () => Array(n).fill(0));
      for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
          inv[r][c] = adj[r][c] / d;
        }
      }

      report += `ADJUGATE MATRIX adj(A):\n`;
      adj.forEach(r => report += `  [ ${r.join(',\t')} ]\n`);
      report += `\nINVERSE MATRIX A⁻¹ = (1/det) × adj(A):\n`;
      inv.forEach(r => {
        report += `  [ ${r.map(v => Number.isInteger(v) ? v : v.toFixed(4)).join(',\t')} ]\n`;
      });
    }

    report += `==========================================================`;

    if (out) out.value = report;
    if (window.showToast) window.showToast('Matrix inverse calculated!', 'success');
  }

  const select = document.getElementById('inv-size-select');
  if (select) select.onchange = renderGrid;

  const activeBtn = document.getElementById('calc-inv-btn') || btn;
  if (activeBtn) activeBtn.onclick = () => computeInverse();

  renderGrid();
  computeInverse();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
