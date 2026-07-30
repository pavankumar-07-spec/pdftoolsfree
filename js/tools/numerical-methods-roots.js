/**
 * Numerical Root Finder Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const funcIn = document.getElementById('func-input');
  const methodIn = document.getElementById('method-select');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  function solve() {
    const expr = funcIn ? funcIn.value : 'x^3 - x - 2';
    const method = methodIn ? methodIn.value : 'newton';

    let res = `--- NUMERICAL METHOD ROOT FINDER ---nFunction f(x) = ${expr}nMethod: ${method === 'bisection' ? 'Bisection' : 'Newton-Raphson'}nn`;

    function f(x) { return Math.pow(x, 3) - x - 2; }
    function df(x) { return 3*Math.pow(x, 2) - 1; }

    if (method === 'bisection') {
      let a = 1, b = 2;
      res += `Itertatbtm (root)tf(m)n`;
      for (let i = 1; i <= 15; i++) {
        let m = (a + b) / 2;
        let fm = f(m);
        res += `${i}t${a.toFixed(4)}t${b.toFixed(4)}t${m.toFixed(4)}t${fm.toFixed(4)}n`;
        if (Math.abs(fm) < 1e-6) break;
        if (f(a) * fm < 0) b = m; else a = m;
      }
    } else {
      let x = 1.5;
      res += `Itertx_ntf(x_n)tf'(x_n)tx_{n+1}n`;
      for (let i = 1; i <= 10; i++) {
        let fx = f(x);
        let dfx = df(x);
        let xNext = x - fx / dfx;
        res += `${i}t${x.toFixed(4)}t${fx.toFixed(4)}t${dfx.toFixed(4)}t${xNext.toFixed(6)}n`;
        if (Math.abs(xNext - x) < 1e-6) { x = xNext; break; }
        x = xNext;
      }
      res += `n=== CONVERGED ROOT ===nx ≈ ${x.toFixed(6)}n`;
    }

    if (out) out.value = res;
  }

  if (btn) btn.addEventListener('click', solve);
  solve();
});
