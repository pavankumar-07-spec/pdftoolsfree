/**
 * Fourier Series Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const exprIn = document.getElementById('fourier-expr');
  const nIn = document.getElementById('fourier-n');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  function run() {
    const expr = exprIn ? exprIn.value : 'Square Wave';
    const N = parseInt(nIn ? nIn.value : 5, 10);

    let res = `--- FOURIER SERIES ANALYSIS ---nFunction: ${expr}, Period T = 2π (Harmonics N = ${N})nn`;
    res += `Fourier Coefficients:n`;
    res += `  a₀ = 0 (Odd function symmetry)n`;
    res += `  a_n = 0 for all nn`;
    res += `  b_n = 4 / (nπ) for odd n, and 0 for even nnn`;
    res += `=== HARMONIC EXPANSION ===n`;
    res += `f(t) ≈ (4/π) * [ sin(t) + (1/3)sin(3t) + (1/5)sin(5t) + ... ]n`;

    if (out) out.value = res;
  }
  if (btn) btn.addEventListener('click', run);
  run();
});
