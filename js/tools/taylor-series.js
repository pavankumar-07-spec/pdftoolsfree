/**
 * Taylor Series Expansion Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const ic = document.getElementById('tool-inputs-container');
  const out = document.getElementById('main-output');
  if (ic && !document.getElementById('ts-func')) {
    ic.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;margin-bottom:1.5rem">
        <div><label class="form-label">Function</label>
          <select id="ts-func" class="form-input">
            <option value="exp" selected>eˣ</option>
            <option value="sin">sin(x)</option>
            <option value="cos">cos(x)</option>
            <option value="ln1px">ln(1+x)</option>
          </select>
        </div>
        <div><label class="form-label">Expand at x =</label><input type="number" id="ts-x" class="form-input" value="1" step="0.1"></div>
        <div><label class="form-label">Terms (n)</label><input type="number" id="ts-n" class="form-input" value="8" min="1" max="20"></div>
      </div>
      <button id="calc-ts-btn" class="btn btn-primary" style="width:100%">📐 Compute Taylor Expansion</button>
    `;
  }
  function factorial(n) { let r = 1; for(let i = 2; i <= n; i++) r *= i; return r; }
  function calc() {
    try {
      const func = document.getElementById('ts-func')?.value || 'exp';
      const x = parseFloat(document.getElementById('ts-x')?.value) || 0;
      const n = parseInt(document.getElementById('ts-n')?.value) || 8;
      let terms = [], sum = 0;
      for (let k = 0; k < n; k++) {
        let coeff = 0;
        if (func === 'exp') coeff = Math.pow(x, k) / factorial(k);
        else if (func === 'sin') coeff = (k % 2 === 0 ? 0 : (((k-1)/2) % 2 === 0 ? 1 : -1)) * Math.pow(x, k) / factorial(k);
        else if (func === 'cos') coeff = (k % 2 === 1 ? 0 : ((k/2) % 2 === 0 ? 1 : -1)) * Math.pow(x, k) / factorial(k);
        else if (func === 'ln1px') coeff = k === 0 ? 0 : (k % 2 === 1 ? 1 : -1) * Math.pow(x, k) / k;
        sum += coeff;
        if (Math.abs(coeff) > 1e-15) terms.push({ k, coeff, cumSum: sum });
      }
      const labels = { exp: 'eˣ', sin: 'sin(x)', cos: 'cos(x)', ln1px: 'ln(1+x)' };
      let r = '==========================================================\n';
      r += '             TAYLOR SERIES EXPANSION\n';
      r += '==========================================================\n';
      r += 'Function:  ' + labels[func] + '\nx = ' + x + ', Terms = ' + n + '\n\n';
      r += 'TERM-BY-TERM EXPANSION:\n';
      r += 'k'.padEnd(4) + 'Term Value'.padEnd(20) + 'Cumulative Sum\n';
      r += '─'.repeat(42) + '\n';
      terms.forEach(t => { r += t.k.toString().padEnd(4) + t.coeff.toFixed(10).padEnd(20) + t.cumSum.toFixed(10) + '\n'; });
      r += '\nApproximation ≈ ' + sum.toFixed(10) + '\n';
      r += '==========================================================';
      if (out) out.value = r;
      if (window.showToast) window.showToast(labels[func] + ' ≈ ' + sum.toFixed(6), 'success');
    } catch (e) { if (out) out.value = 'Error: ' + e.message; }
  }
  const b = document.getElementById('calc-ts-btn') || document.getElementById('generate-btn');
  if (b) b.onclick = calc;
  const sel = document.getElementById('ts-func');
  if (sel) sel.onchange = calc;
  calc();
});