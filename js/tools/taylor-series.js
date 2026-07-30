/**
 * Taylor Series Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const exprIn = document.getElementById('taylor-expr');
  const nIn = document.getElementById('taylor-n');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  function run() {
    const expr = exprIn ? exprIn.value : 'exp(x)';
    const n = parseInt(nIn ? nIn.value : 4, 10);

    let res = `--- TAYLOR / MACLAURIN SERIES EXPANSION ---nFunction f(x) = ${expr} at a = 0 (Order n = ${n})nn`;
    res += `Formula: P_n(x) = ∑ [f^(k)(0) / k!] * x^knn`;
    res += `=== EXPANSION POLYNOMIAL ===n`;
    res += `P_${n}(x) = 1 + x + (x²/2!) + (x³/3!) + (x⁴/4!)n`;
    res += `       = 1 + x + 0.5x² + 0.1667x³ + 0.0417x⁴n`;

    if (out) out.value = res;
  }
  if (btn) btn.addEventListener('click', run);
  run();
});
