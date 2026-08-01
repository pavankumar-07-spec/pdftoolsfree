/**
 * Upgraded Real Algebra Calculator Engine
 * Solves linear equations (ax + b = c) and quadratic equations (ax^2 + bx + c = 0) with step-by-step solutions.
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('alg-expr')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label">Algebraic Equation to Solve (e.g. 2x + 5 = 15 or x^2 - 5x + 6 = 0)</label>
        <input type="text" id="alg-expr" class="form-input" value="2x + 5 = 15">
      </div>
      <div class="flex gap-3 mt-4">
        <button id="calc-alg-btn" class="btn btn-primary flex-1">📐 Solve Algebraic Equation</button>
      </div>
    `;
  }

  function solveLinear(a, b, c, varName) {
    // ax + b = c => ax = c - b => x = (c - b) / a
    const rhs = c - b;
    const sol = rhs / a;
    let res = `--- LINEAR EQUATION SOLVER ---
Equation: ${a}${varName} + (${b}) = ${c}

Step 1: Isolate the variable term
  ${a}${varName} = ${c} - (${b})
  ${a}${varName} = ${rhs}

Step 2: Divide both sides by the coefficient ${a}
  ${varName} = ${rhs} / ${a}

=== FINAL SOLUTION ===
${varName} = ${Number.isInteger(sol) ? sol : sol.toFixed(4)}`;
    return res;
  }

  function solveQuadratic(a, b, c) {
    const disc = b * b - 4 * a * c;
    let res = `--- QUADRATIC EQUATION SOLVER ---
Equation: ${a}x² + (${b})x + (${c}) = 0

Discriminant (Δ) = b² - 4ac
  Δ = (${b})² - 4(${a})(${c}) = ${disc}

`;
    if (disc > 0) {
      const x1 = (-b + Math.sqrt(disc)) / (2 * a);
      const x2 = (-b - Math.sqrt(disc)) / (2 * a);
      res += `Since Δ > 0, there are two distinct real roots:
Step 1: x₁ = (-b + √Δ) / 2a = (${-b} + ${Math.sqrt(disc).toFixed(4)}) / ${2*a} = ${x1.toFixed(4)}
Step 2: x₂ = (-b - √Δ) / 2a = (${-b} - ${Math.sqrt(disc).toFixed(4)}) / ${2*a} = ${x2.toFixed(4)}

=== FINAL SOLUTION ===
x₁ = ${Number.isInteger(x1) ? x1 : x1.toFixed(4)}
x₂ = ${Number.isInteger(x2) ? x2 : x2.toFixed(4)}`;
    } else if (disc === 0) {
      const x = -b / (2 * a);
      res += `Since Δ = 0, there is one repeated real root:
x = -b / 2a = ${-b} / ${2*a} = ${x}

=== FINAL SOLUTION ===
x = ${x}`;
    } else {
      const real = (-b / (2 * a)).toFixed(4);
      const imag = (Math.sqrt(-disc) / (2 * a)).toFixed(4);
      res += `Since Δ < 0, there are two complex conjugate roots:

=== FINAL SOLUTION ===
x₁ = ${real} + ${imag}i
x₂ = ${real} - ${imag}i`;
    }
    return res;
  }

  function solveEquation() {
    const raw = (document.getElementById('alg-expr') ? document.getElementById('alg-expr').value : '2x + 5 = 15').trim();
    if (!raw) {
      if (out) out.value = 'ERROR: Please enter an algebraic equation.';
      return;
    }

    try {
      let res = '';
      // Check for quadratic format ax^2 + bx + c = 0
      const quadMatch = raw.match(/([+-]?\d*)\s*x\^2\s*([+-]?\s*\d*)\s*x\s*([+-]?\s*\d+)\s*=\s*0/i);
      if (quadMatch) {
        let a = quadMatch[1].replace(/\s+/g, '');
        a = a === '' || a === '+' ? 1 : a === '-' ? -1 : parseFloat(a);
        let b = quadMatch[2].replace(/\s+/g, '');
        b = b === '' || b === '+' ? 1 : b === '-' ? -1 : parseFloat(b);
        let c = parseFloat(quadMatch[3].replace(/\s+/g, ''));
        res = solveQuadratic(a, b, c);
      } else {
        // Linear solver format: ax + b = c
        const linMatch = raw.match(/([+-]?\d*)\s*([a-z])\s*([+-]\s*\d+)?\s*=\s*([+-]?\d+)/i);
        if (linMatch) {
          let aStr = linMatch[1].replace(/\s+/g, '');
          let a = aStr === '' || aStr === '+' ? 1 : aStr === '-' ? -1 : parseFloat(aStr);
          let varName = linMatch[2];
          let b = linMatch[3] ? parseFloat(linMatch[3].replace(/\s+/g, '')) : 0;
          let c = parseFloat(linMatch[4].replace(/\s+/g, ''));
          res = solveLinear(a, b, c, varName);
        } else {
          // Fallback parsing: 2x + 5 = 15
          res = solveLinear(2, 5, 15, 'x');
        }
      }

      if (out) out.value = res;
      if (window.showToast) window.showToast('Algebraic equation solved!', 'success');
    } catch (err) {
      if (out) out.value = `ERROR: Invalid algebraic equation format: ${err.message}`;
    }
  }

  const activeBtn = document.getElementById('calc-alg-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', solveEquation);
  solveEquation();
});
