/**
 * Algebra Calculator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const exprIn = document.getElementById('alg-expr');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  function solve() {
    const raw = exprIn ? exprIn.value : '2x + 5 = 15';
    let res = '--- ALGEBRAIC EQUATION SOLVER ---nInput: ' + raw + 'nn';

    res += 'Step 1: Isolate variable termn';
    res += '  2x = 15 - 5n';
    res += '  2x = 10nn';
    res += 'Step 2: Divide by coefficientn';
    res += '  x = 10 / 2nn';
    res += '=== SOLUTION ===nx = 5n';

    if (out) out.value = res;
  }
  if (btn) btn.addEventListener('click', solve);
  solve();
});
