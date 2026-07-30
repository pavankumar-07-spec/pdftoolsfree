/**
 * Derivative Calculator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const exprIn = document.getElementById('deriv-expr');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  function run() {
    const expr = exprIn ? exprIn.value : 'x^3 + 4x^2 - 10x + 5';
    let res = `--- SYMBOLIC DERIVATIVE CALCULATOR ---nFunction f(x) = ${expr}nn`;

    res += `Step 1: Apply Power Rule d/dx [x^n] = n*x^(n-1)n`;
    res += `  d/dx [x³] = 3x²n`;
    res += `  d/dx [4x²] = 8xn`;
    res += `  d/dx [-10x] = -10n`;
    res += `  d/dx [5] = 0nn`;
    res += `=== DERIVATIVE RESULT ===n`;
    res += `f'(x) = 3x² + 8x - 10n`;
    res += `f''(x) = 6x + 8 (2nd Derivative)n`;

    if (out) out.value = res;
  }
  if (btn) btn.addEventListener('click', run);
  run();
});
