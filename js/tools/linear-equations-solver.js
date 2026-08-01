/**
 * Linear Equations Solver Engine (2x2 and 3x3 Systems via Cramer's Rule)
 */
document.addEventListener('DOMContentLoaded', () => {
  const ic = document.getElementById('tool-inputs-container');
  const out = document.getElementById('main-output');
  if (ic && !document.getElementById('les-size')) {
    ic.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label">System Size</label>
        <select id="les-size" class="form-input"><option value="2" selected>2×2 System</option><option value="3">3×3 System</option></select>
      </div>
      <div id="les-grid" style="margin-bottom:1.5rem"></div>
      <button id="calc-les-btn" class="btn btn-primary" style="width:100%">📐 Solve System (Cramer's Rule)</button>
    `;
    buildGrid();
  }
  function buildGrid() {
    const n = parseInt(document.getElementById('les-size')?.value || '2');
    const g = document.getElementById('les-grid');
    if (!g) return;
    const defaults2 = [[2,1,5],[1,3,10]];
    const defaults3 = [[1,1,1,6],[0,2,5,14],[2,5,-1,3]];
    const defs = n === 3 ? defaults3 : defaults2;
    let html = '<p style="font-size:0.85rem;margin-bottom:0.5rem;color:var(--text-secondary)">Enter augmented matrix [A|b]:</p>';
    html += '<div style="display:grid;grid-template-columns:repeat(' + (n+1) + ',1fr);gap:0.5rem;max-width:400px">';
    for (let r = 0; r < n; r++) {
      for (let c = 0; c <= n; c++) {
        html += '<input type="number" id="les_' + r + '_' + c + '" class="form-input" value="' + defs[r][c] + '" style="text-align:center">';
      }
    }
    html += '</div>';
    g.innerHTML = html;
  }
  function solve() {
    try {
      const n = parseInt(document.getElementById('les-size')?.value || '2');
      const A = [], b = [];
      for (let r = 0; r < n; r++) {
        A[r] = [];
        for (let c = 0; c < n; c++) A[r][c] = parseFloat(document.getElementById('les_' + r + '_' + c)?.value) || 0;
        b[r] = parseFloat(document.getElementById('les_' + r + '_' + n)?.value) || 0;
      }
      function det2(m) { return m[0][0]*m[1][1] - m[0][1]*m[1][0]; }
      function det3(m) { return m[0][0]*(m[1][1]*m[2][2]-m[1][2]*m[2][1]) - m[0][1]*(m[1][0]*m[2][2]-m[1][2]*m[2][0]) + m[0][2]*(m[1][0]*m[2][1]-m[1][1]*m[2][0]); }
      const detA = n === 2 ? det2(A) : det3(A);
      let report = '==========================================================\n';
      report += '          LINEAR SYSTEM SOLVER (Cramer\'s Rule)\n';
      report += '==========================================================\n';
      report += 'System Size: ' + n + '×' + n + '\ndet(A) = ' + detA.toFixed(4) + '\n\n';
      if (Math.abs(detA) < 1e-12) {
        report += '⚠️ System is SINGULAR (det=0). No unique solution.\n';
      } else {
        const vars = ['x','y','z'];
        for (let i = 0; i < n; i++) {
          const Ai = A.map((row, r) => row.map((val, c) => c === i ? b[r] : val));
          const detAi = n === 2 ? det2(Ai) : det3(Ai);
          const val = detAi / detA;
          report += vars[i] + ' = det(A' + i + ')/det(A) = ' + detAi.toFixed(4) + '/' + detA.toFixed(4) + ' = ' + val.toFixed(6) + '\n';
        }
      }
      report += '==========================================================';
      if (out) out.value = report;
      if (window.showToast) window.showToast('System solved via Cramer\'s Rule!', 'success');
    } catch (e) { if (out) out.value = 'Error: ' + e.message; }
  }
  const sel = document.getElementById('les-size');
  if (sel) sel.onchange = buildGrid;
  const btn = document.getElementById('calc-les-btn') || document.getElementById('generate-btn');
  if (btn) btn.onclick = solve;
  solve();
});