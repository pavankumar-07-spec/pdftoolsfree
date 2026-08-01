/**
 * ODE Solver Engine (Euler's Method for dy/dx = f(x,y))
 */
document.addEventListener('DOMContentLoaded', () => {
  const ic = document.getElementById('tool-inputs-container');
  const out = document.getElementById('main-output');
  if (ic && !document.getElementById('ode-expr')) {
    ic.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div><label class="form-label">dy/dx = f(x,y)</label><input type="text" id="ode-expr" class="form-input" value="x + y" placeholder="e.g. x + y"></div>
        <div><label class="form-label">Step Size (h)</label><input type="number" id="ode-h" class="form-input" value="0.1" step="0.01"></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;margin-bottom:1.5rem">
        <div><label class="form-label">x₀ (initial x)</label><input type="number" id="ode-x0" class="form-input" value="0" step="0.1"></div>
        <div><label class="form-label">y₀ (initial y)</label><input type="number" id="ode-y0" class="form-input" value="1" step="0.1"></div>
        <div><label class="form-label">x target</label><input type="number" id="ode-xt" class="form-input" value="1" step="0.1"></div>
      </div>
      <button id="calc-ode-btn" class="btn btn-primary" style="width:100%">📐 Solve ODE (Euler's Method)</button>
    `;
  }
  function evalF(expr, x, y) {
    try { return Function('x','y','return ' + expr)(x, y); } catch(e) { return NaN; }
  }
  function calc() {
    try {
      const expr = document.getElementById('ode-expr')?.value || 'x + y';
      const h = parseFloat(document.getElementById('ode-h')?.value) || 0.1;
      let x = parseFloat(document.getElementById('ode-x0')?.value) || 0;
      let y = parseFloat(document.getElementById('ode-y0')?.value) || 1;
      const xt = parseFloat(document.getElementById('ode-xt')?.value) || 1;
      let r = '==========================================================\n';
      r += '             ODE SOLVER (Euler\'s Method)\n';
      r += '==========================================================\n';
      r += "dy/dx = " + expr + "\nInitial: (" + x + ", " + y + "), h = " + h + ", target x = " + xt + "\n\n";
      r += 'Step'.padEnd(6) + 'x'.padEnd(12) + 'y'.padEnd(18) + "f(x,y)\n";
      r += '─'.repeat(48) + '\n';
      let step = 0;
      while (x < xt - 1e-9 && step < 200) {
        const f = evalF(expr, x, y);
        r += step.toString().padEnd(6) + x.toFixed(4).padEnd(12) + y.toFixed(8).padEnd(18) + f.toFixed(8) + '\n';
        y = y + h * f;
        x = x + h;
        step++;
      }
      r += step.toString().padEnd(6) + x.toFixed(4).padEnd(12) + y.toFixed(8) + '\n';
      r += '\n✅ y(' + xt + ') ≈ ' + y.toFixed(8) + '\n';
      r += '==========================================================';
      if (out) out.value = r;
      if (window.showToast) window.showToast('y(' + xt + ') ≈ ' + y.toFixed(6), 'success');
    } catch (e) { if (out) out.value = 'Error: ' + e.message; }
  }
  const b = document.getElementById('calc-ode-btn') || document.getElementById('generate-btn');
  if (b) b.onclick = calc;
  calc();
});