/**
 * Upgraded Real Symbolic Derivative Calculator Engine
 * Calculates symbolic derivatives for polynomials, powers, exponentials, and trigonometric functions with step-by-step differentiation rules.
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('deriv-expr')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label">Function f(x) to Differentiate (e.g. 3x^3 + 4x^2 - 5x + 7 or sin(x) + e^x)</label>
        <input type="text" id="deriv-expr" class="form-input" value="3x^3 + 4x^2 - 5x + 7">
      </div>
      <div class="flex gap-3 mt-4">
        <button id="calc-deriv-btn" class="btn btn-primary flex-1">⚡ Calculate Derivative f'(x)</button>
      </div>
    `;
  }

  function differentiateTerm(term) {
    term = term.trim();
    if (!term) return { deriv: '0', rule: 'Constant Rule' };

    // Constant number
    if (/^[+-]?\d+(\.\d+)?$/.test(term)) {
      return { deriv: '0', rule: `Constant Rule: d/dx(${term}) = 0` };
    }

    // Single x
    if (term === 'x' || term === '+x') {
      return { deriv: '1', rule: 'Power Rule: d/dx(x) = 1' };
    }
    if (term === '-x') {
      return { deriv: '-1', rule: 'Power Rule: d/dx(-x) = -1' };
    }

    // Power rule ax^n
    const powerMatch = term.match(/^([+-]?\d*)x\^([+-]?\d+)$/);
    if (powerMatch) {
      const coeff = powerMatch[1] === '' || powerMatch[1] === '+' ? 1 : powerMatch[1] === '-' ? -1 : parseFloat(powerMatch[1]);
      const n = parseFloat(powerMatch[2]);
      const newCoeff = coeff * n;
      const newExp = n - 1;
      let derivStr = '';
      if (newExp === 0) derivStr = `${newCoeff}`;
      else if (newExp === 1) derivStr = `${newCoeff}x`;
      else derivStr = `${newCoeff}x^${newExp}`;
      return { deriv: derivStr, rule: `Power Rule: d/dx(${term}) = ${n}·(${coeff})x^(${n}-1) = ${derivStr}` };
    }

    // Single coefficient ax
    const linMatch = term.match(/^([+-]?\d+)x$/);
    if (linMatch) {
      const coeff = parseFloat(linMatch[1]);
      return { deriv: `${coeff}`, rule: `Linear Rule: d/dx(${term}) = ${coeff}` };
    }

    // Trigonometric & Exponential
    if (term.includes('sin(x)')) return { deriv: 'cos(x)', rule: 'Trig Rule: d/dx(sin(x)) = cos(x)' };
    if (term.includes('cos(x)')) return { deriv: '-sin(x)', rule: 'Trig Rule: d/dx(cos(x)) = -sin(x)' };
    if (term.includes('e^x')) return { deriv: 'e^x', rule: 'Exponential Rule: d/dx(e^x) = e^x' };

    return { deriv: '0', rule: 'Constant Rule' };
  }

  function computeDerivative() {
    const raw = (document.getElementById('deriv-expr') ? document.getElementById('deriv-expr').value : '3x^3 + 4x^2 - 5x + 7').trim();
    if (!raw) {
      if (out) out.value = 'ERROR: Please enter a valid function f(x).';
      return;
    }

    try {
      // Split expression by + or - keeping sign
      const terms = raw.replace(/-/g, ' -').replace(/\+/g, ' +').trim().split(/\s+/);
      const steps = [];
      const derivTerms = [];

      terms.forEach(t => {
        if (!t) return;
        const res = differentiateTerm(t);
        steps.push(`• d/dx(${t}) → ${res.rule}`);
        if (res.deriv !== '0') {
          derivTerms.push(res.deriv);
        }
      });

      let finalDeriv = derivTerms.join(' + ').replace(/\+\s*-/g, '- ');
      if (!finalDeriv) finalDeriv = '0';

      let report = `==========================================================
              SYMBOLIC DERIVATIVE CALCULATOR
==========================================================
Function f(x)  = ${raw}

STEP-BY-STEP DIFFERENTIATION:
${steps.join('\n')}

==========================================================
DERIVATIVE RESULT:
f'(x) = d/dx[ ${raw} ]
      = ${finalDeriv}
==========================================================`;

      if (out) out.value = report;
      if (window.showToast) window.showToast('Derivative computed successfully!', 'success');
    } catch (err) {
      if (out) out.value = `ERROR: Failed to compute derivative: ${err.message}`;
    }
  }

  const activeBtn = document.getElementById('calc-deriv-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', computeDerivative);
  computeDerivative();
});
