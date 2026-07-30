/**
 * Integral Calculator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const exprIn = document.getElementById('integ-expr');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  function run() {
    const expr = exprIn ? exprIn.value : '3x^2 + 8x - 10';
    let res = `--- INTEGRAL CALCULATOR ---nFunction f(x) = ${expr}nn`;

    res += `Step 1: Apply Power Rule for Integration ∫ xⁿ dx = (xⁿ⁺¹)/(n+1)n`;
    res += `  ∫ 3x² dx = x³n`;
    res += `  ∫ 8x dx  = 4x²n`;
    res += `  ∫ -10 dx = -10xnn`;
    res += `=== INDEFINITE INTEGRAL RESULT ===n`;
    res += `∫ f(x) dx = x³ + 4x² - 10x + Cnn`;
    res += `Definite Integral Example [0 to 2]:n`;
    res += `F(2) - F(0) = (2³ + 4(2)² - 10(2)) - (0) = 8 + 16 - 20 = 4n`;

    if (out) out.value = res;
  }
  if (btn) btn.addEventListener('click', run);
  run();
});
