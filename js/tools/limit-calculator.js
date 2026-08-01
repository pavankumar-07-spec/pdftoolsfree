/**
 * Limit Calculator Engine (Numerical Approach)
 */
document.addEventListener('DOMContentLoaded', () => {
  const ic = document.getElementById('tool-inputs-container');
  const out = document.getElementById('main-output');
  if (ic && !document.getElementById('lim-expr')) {
    ic.innerHTML = `
      <div style="display:grid;grid-template-columns:2fr 1fr;gap:1rem;margin-bottom:1.5rem">
        <div><label class="form-label">Function f(x)</label><input type="text" id="lim-expr" class="form-input" value="(x*x - 1)/(x - 1)" placeholder="e.g. (x*x - 1)/(x - 1)"></div>
        <div><label class="form-label">x approaches</label><input type="number" id="lim-val" class="form-input" value="1" step="0.1"></div>
      </div>
      <button id="calc-lim-btn" class="btn btn-primary" style="width:100%">📐 Evaluate Limit Numerically</button>
    `;
  }
  function evalF(expr, x) {
    try { return Function('x', 'return ' + expr)(x); } catch(e) { return NaN; }
  }
  function calc() {
    try {
      const expr = document.getElementById('lim-expr')?.value || 'x';
      const a = parseFloat(document.getElementById('lim-val')?.value) || 0;
      const deltas = [0.1, 0.01, 0.001, 0.0001, 0.00001];
      let r = '==========================================================\n';
      r += '             LIMIT CALCULATOR (Numerical)\n';
      r += '==========================================================\n';
      r += 'f(x) = ' + expr + '\nx → ' + a + '\n\n';
      r += 'APPROACH TABLE:\n';
      r += 'δ'.padEnd(12) + 'f(a-δ)'.padEnd(18) + 'f(a+δ)\n';
      r += '─'.repeat(46) + '\n';
      let lastLeft = NaN, lastRight = NaN;
      deltas.forEach(d => {
        const left = evalF(expr, a - d);
        const right = evalF(expr, a + d);
        lastLeft = left; lastRight = right;
        r += d.toString().padEnd(12) + (isNaN(left)?'undefined':left.toFixed(8)).padEnd(18) + (isNaN(right)?'undefined':right.toFixed(8)) + '\n';
      });
      r += '\n';
      if (!isNaN(lastLeft) && !isNaN(lastRight) && Math.abs(lastLeft - lastRight) < 0.001) {
        r += '✅ Limit ≈ ' + ((lastLeft+lastRight)/2).toFixed(6) + '\n';
      } else {
        r += '⚠️ Limit may not exist or is discontinuous at x = ' + a + '\n';
      }
      r += '==========================================================';
      if (out) out.value = r;
      if (window.showToast) window.showToast('Limit evaluated numerically!', 'success');
    } catch (e) { if (out) out.value = 'Error: ' + e.message; }
  }
  const b = document.getElementById('calc-lim-btn') || document.getElementById('generate-btn');
  if (b) b.onclick = calc;
  calc();
});