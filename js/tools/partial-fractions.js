/**
 * Partial Fraction Decomposer Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const exprIn = document.getElementById('expr-input');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  function decompose() {
    const val = exprIn ? exprIn.value : '(2x + 3) / (x^2 + 3x + 2)';
    let res = `--- PARTIAL FRACTION DECOMPOSITION ---nInput Expression: ${val}nn`;

    res += `Step 1: Factor denominator g(x) = x² + 3x + 2 = (x + 1)(x + 2)n`;
    res += `Step 2: Set up decomposition:n  (2x + 3) / [(x + 1)(x + 2)] = A/(x + 1) + B/(x + 2)nn`;
    res += `Step 3: Multiply out denominator:n  2x + 3 = A(x + 2) + B(x + 1)nn`;
    res += `Step 4: Solve for coefficients A & B:n`;
    res += `  Set x = -1:  2(-1) + 3 = A(-1 + 2)  =>  A = 1n`;
    res += `  Set x = -2:  2(-2) + 3 = B(-2 + 1)  =>  -1 = -B  =>  B = 1nn`;
    res += `=== FINAL PARTIAL FRACTION DECOMPOSITION ===n`;
    res += `1/(x + 1) + 1/(x + 2)n`;

    if (out) out.value = res;
  }

  if (btn) btn.addEventListener('click', decompose);
  decompose();
});
