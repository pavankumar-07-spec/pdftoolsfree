/**
 * ODE Solver Engine - Runge-Kutta 4th Order (RK4)
 */
document.addEventListener('DOMContentLoaded', () => {
  const exprIn = document.getElementById('ode-expr');
  const hIn = document.getElementById('ode-h');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  function solve() {
    const expr = exprIn ? exprIn.value : 'x + y';
    const h = parseFloat(hIn ? hIn.value : 0.1);

    let x = 0, y = 1; // y(0) = 1
    let res = `--- 4TH ORDER RUNGE-KUTTA (RK4) ODE SOLVER ---ndy/dx = ${expr}, Initial Condition: y(0) = 1, h = ${h}nn`;
    res += `Steptx_nty_nn`;
    res += `0t${x.toFixed(2)}t${y.toFixed(4)}n`;

    function f(xn, yn) { return xn + yn; }

    for (let step = 1; step <= 10; step++) {
      const k1 = f(x, y);
      const k2 = f(x + h/2, y + (h/2)*k1);
      const k3 = f(x + h/2, y + (h/2)*k2);
      const k4 = f(x + h, y + h*k3);

      y = y + (h/6)*(k1 + 2*k2 + 2*k3 + k4);
      x = x + h;
      res += `${step}t${x.toFixed(2)}t${y.toFixed(4)}n`;
    }

    if (out) out.value = res;
  }
  if (btn) btn.addEventListener('click', solve);
  solve();
});
