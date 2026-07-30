/**
 * Scientific Calculator Engine
 * Client-Side Expression Parser & Scientific Function Evaluator
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('sc-expr')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Mathematical Expression:</label>
        <input type="text" id="sc-expr" class="form-input" value="sin(45 * pi / 180) + sqrt(16) * log(100)" placeholder="e.g. 2^3 + sin(pi/4) * sqrt(144)" style="width:100%;padding:0.75rem;font-size:1.1rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:1rem">
        <button class="btn btn-secondary btn-sm sc-quick-btn" data-ins="sin(">sin</button>
        <button class="btn btn-secondary btn-sm sc-quick-btn" data-ins="cos(">cos</button>
        <button class="btn btn-secondary btn-sm sc-quick-btn" data-ins="tan(">tan</button>
        <button class="btn btn-secondary btn-sm sc-quick-btn" data-ins="sqrt(">sqrt</button>
        <button class="btn btn-secondary btn-sm sc-quick-btn" data-ins="log(">log10</button>
        <button class="btn btn-secondary btn-sm sc-quick-btn" data-ins="ln(">ln</button>
        <button class="btn btn-secondary btn-sm sc-quick-btn" data-ins="^">^</button>
        <button class="btn btn-secondary btn-sm sc-quick-btn" data-ins="pi">π</button>
        <button class="btn btn-secondary btn-sm sc-quick-btn" data-ins="e">e</button>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-sc-btn" class="btn btn-primary flex-1">🧮 Evaluate Expression</button>
      </div>
    `;

    document.querySelectorAll('.sc-quick-btn').forEach(b => {
      b.addEventListener('click', (e) => {
        const ins = e.target.getAttribute('data-ins');
        const input = document.getElementById('sc-expr');
        if (input) {
          input.value += ins;
          input.focus();
        }
      });
    });
  }

  function evaluateScientific(expr) {
    let sanitized = expr
      .replace(/pi/gi, 'Math.PI')
      .replace(/beb/gi, 'Math.E')
      .replace(/sin\(/gi, 'Math.sin(')
      .replace(/cos\(/gi, 'Math.cos(')
      .replace(/tan\(/gi, 'Math.tan(')
      .replace(/asin\(/gi, 'Math.asin(')
      .replace(/acos\(/gi, 'Math.acos(')
      .replace(/atan\(/gi, 'Math.atan(')
      .replace(/sqrt\(/gi, 'Math.sqrt(')
      .replace(/cbrt\(/gi, 'Math.cbrt(')
      .replace(/log\(/gi, 'Math.log10(')
      .replace(/ln\(/gi, 'Math.log(')
      .replace(/abs\(/gi, 'Math.abs(')
      .replace(/^/g, '**');

    // Safe mathematical evaluation scope
    const func = new Function(`"use strict"; return (${sanitized});`);
    return func();
  }

  function calculate() {
    const expr = document.getElementById('sc-expr') ? document.getElementById('sc-expr').value.trim() : '';

    if (!expr) {
      if (out) out.value = 'ERROR: Please enter a mathematical expression to evaluate.';
      return;
    }

    try {
      const val = evaluateScientific(expr);
      if (typeof val !== 'number' || isNaN(val)) {
        throw new Error('Result is not a valid number.');
      }

      let res = `--- SCIENTIFIC CALCULATOR RESULT ---nn`;
      res += `Expression: ${expr}n`;
      res += `Result:     ${val}nn`;
      res += `=== SCIENTIFIC FORMATS ===n`;
      res += `Standard Decimal:   ${val.toString()}n`;
      res += `Fixed (4 decimals): ${val.toFixed(4)}n`;
      res += `Scientific Notation:${val.toExponential(6)}n`;

      if (out) out.value = res;
      if (window.showToast) window.showToast('Expression evaluated successfully!', 'success');
    } catch (err) {
      if (out) out.value = `ERROR: Invalid mathematical expression.nDetails: ${err.message}`;
    }
  }

  const activeBtn = document.getElementById('calc-sc-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
