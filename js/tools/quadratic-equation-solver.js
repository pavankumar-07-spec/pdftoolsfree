/**
 * Upgraded Real Quadratic Equation Solver Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('calc-a')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;margin-bottom:1.5rem">
        <div>
          <label class="form-label">Coefficient a (x²)</label>
          <input type="number" id="calc-a" class="form-input" value="1" step="0.5" style="text-align:center">
        </div>
        <div>
          <label class="form-label">Coefficient b (x)</label>
          <input type="number" id="calc-b" class="form-input" value="-5" step="0.5" style="text-align:center">
        </div>
        <div>
          <label class="form-label">Constant c</label>
          <input type="number" id="calc-c" class="form-input" value="6" step="0.5" style="text-align:center">
        </div>
      </div>
      <div class="flex gap-3 mt-4">
        <button id="calc-quad-btn" type="button" class="btn btn-primary flex-1">📐 Solve Quadratic Equation (ax² + bx + c = 0)</button>
      </div>
    `;
  }

  function solveQuadratic() {
    const a = parseFloat(document.getElementById('calc-a')?.value || 1);
    const b = parseFloat(document.getElementById('calc-b')?.value || -5);
    const c = parseFloat(document.getElementById('calc-c')?.value || 6);

    if (a === 0) {
      if (out) out.value = 'ERROR: Coefficient "a" cannot be 0 for a quadratic equation.';
      return;
    }

    const D = b * b - 4 * a * c;
    const vertexX = -b / (2 * a);
    const vertexY = a * vertexX * vertexX + b * vertexX + c;

    let report = `==========================================================
             QUADRATIC EQUATION SOLVER
==========================================================
Equation Form:    (${a})x² + (${b})x + (${c}) = 0
Discriminant (Δ): D = b² - 4ac = (${b})² - 4(${a})(${c}) = ${D.toFixed(4)}
Parabola Vertex:  (h, k) = (${vertexX.toFixed(4)}, ${vertexY.toFixed(4)})

ROOT SOLVING ANALYSIS:\n`;

    if (D > 0) {
      const x1 = (-b + Math.sqrt(D)) / (2 * a);
      const x2 = (-b - Math.sqrt(D)) / (2 * a);
      report += `Type: Two Distinct Real Roots (D > 0)\n`;
      report += `Root 1 (x₁): ${x1.toFixed(4)}\n`;
      report += `Root 2 (x₂): ${x2.toFixed(4)}\n`;
      report += `\nFactored Form: (${a}) (x - ${x1.toFixed(4)}) (x - ${x2.toFixed(4)}) = 0\n`;
    } else if (D === 0) {
      const x = -b / (2 * a);
      report += `Type: One Repeated Real Root (D = 0)\n`;
      report += `Root (x): ${x.toFixed(4)}\n`;
      report += `\nFactored Form: (${a}) (x - ${x.toFixed(4)})² = 0\n`;
    } else {
      const realPart = (-b / (2 * a)).toFixed(4);
      const imagPart = (Math.sqrt(-D) / (2 * a)).toFixed(4);
      report += `Type: Two Complex Conjugate Roots (D < 0)\n`;
      report += `Root 1 (x₁): ${realPart} + ${imagPart}i\n`;
      report += `Root 2 (x₂): ${realPart} - ${imagPart}i\n`;
    }

    report += `==========================================================`;

    if (out) out.value = report;
    if (window.showToast) window.showToast('Quadratic roots calculated!', 'success');
  }

  const activeBtn = document.getElementById('calc-quad-btn') || btn;
  if (activeBtn) activeBtn.onclick = () => solveQuadratic();

  solveQuadratic();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
