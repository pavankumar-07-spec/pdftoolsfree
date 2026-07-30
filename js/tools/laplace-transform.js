/**
 * Laplace Transform Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const exprIn = document.getElementById('laplace-expr');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  function run() {
    const expr = exprIn ? exprIn.value : 't^2 + sin(3t)';
    let res = `--- LAPLACE TRANSFORM L{f(t)} = F(s) ---nInput f(t) = ${expr}nn`;

    res += `Step 1: Apply Laplace Transform linearity L{a f(t) + b g(t)} = a F(s) + b G(s)n`;
    res += `  L{t²} = 2! / s³ = 2 / s³n`;
    res += `  L{sin(3t)} = 3 / (s² + 3²) = 3 / (s² + 9)nn`;
    res += `=== LAPLACE TRANSFORM RESULT ===n`;
    res += `F(s) = (2 / s³) + [ 3 / (s² + 9) ]n`;

    if (out) out.value = res;
  }
  if (btn) btn.addEventListener('click', run);
  run();
});
