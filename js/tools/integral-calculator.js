/**
 * Upgraded Real Symbolic Integral Calculator Engine
 * Calculates symbolic indefinite integrals ∫ f(x) dx with integration rules and integration constant (+ C).
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('integ-expr')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label">Function f(x) to Integrate (e.g. 4x^3 + 3x^2 - 2x + 5 or cos(x) + e^x)</label>
        <input type="text" id="integ-expr" class="form-input" value="4x^3 + 3x^2 - 2x + 5">
      </div>
      <div class="flex gap-3 mt-4">
        <button id="calc-integ-btn" class="btn btn-primary flex-1">∫ Calculate Indefinite Integral ∫ f(x) dx</button>
      </div>
    `;
  }

  function integrateTerm(term) {
    term = term.trim();
    if (!term) return { integ: '0', rule: '' };

    // Constant number
    if (/^[+-]?\d+(\.\d+)?$/.test(term)) {
      const val = parseFloat(term);
      return { integ: `${val}x`, rule: `Constant Rule: ∫ ${val} dx = ${val}x` };
    }

    // Single x
    if (term === 'x' || term === '+x') {
      return { integ: '0.5x^2', rule: 'Power Rule: ∫ x dx = (x^2)/2 = 0.5x^2' };
    }
    if (term === '-x') {
      return { integ: '-0.5x^2', rule: 'Power Rule: ∫ -x dx = -(x^2)/2 = -0.5x^2' };
    }

    // Power rule ax^n
    const powerMatch = term.match(/^([+-]?\d*)x\^([+-]?\d+)$/);
    if (powerMatch) {
      const coeff = powerMatch[1] === '' || powerMatch[1] === '+' ? 1 : powerMatch[1] === '-' ? -1 : parseFloat(powerMatch[1]);
      const n = parseFloat(powerMatch[2]);
      const newExp = n + 1;
      const newCoeff = coeff / newExp;
      let integStr = '';
      if (Number.isInteger(newCoeff)) {
        integStr = `${newCoeff === 1 ? '' : newCoeff === -1 ? '-' : newCoeff}x^${newExp}`;
      } else {
        integStr = `(${coeff}/${newExp})x^${newExp}`;
      }
      return { integ: integStr, rule: `Power Rule: ∫ (${coeff})x^${n} dx = (${coeff})·(x^${newExp})/${newExp} = ${integStr}` };
    }

    // Single coefficient ax
    const linMatch = term.match(/^([+-]?\d+)x$/);
    if (linMatch) {
      const coeff = parseFloat(linMatch[1]);
      const newCoeff = coeff / 2;
      const integStr = Number.isInteger(newCoeff) ? `${newCoeff}x^2` : `(${coeff}/2)x^2`;
      return { integ: integStr, rule: `Linear Rule: ∫ ${term} dx = (${coeff}/2)x^2 = ${integStr}` };
    }

    // Trig & Exponential
    if (term.includes('sin(x)')) return { integ: '-cos(x)', rule: 'Trig Rule: ∫ sin(x) dx = -cos(x)' };
    if (term.includes('cos(x)')) return { integ: 'sin(x)', rule: 'Trig Rule: ∫ cos(x) dx = sin(x)' };
    if (term.includes('e^x')) return { integ: 'e^x', rule: 'Exponential Rule: ∫ e^x dx = e^x' };

    return { integ: `${term}x`, rule: 'Constant Rule' };
  }

  function computeIntegral() {
    const raw = (document.getElementById('integ-expr') ? document.getElementById('integ-expr').value : '4x^3 + 3x^2 - 2x + 5').trim();
    if (!raw) {
      if (out) out.value = 'ERROR: Please enter a valid function f(x).';
      return;
    }

    try {
      const terms = raw.replace(/-/g, ' -').replace(/\+/g, ' +').trim().split(/\s+/);
      const steps = [];
      const integTerms = [];

      terms.forEach(t => {
        if (!t) return;
        const res = integrateTerm(t);
        steps.push(`• ∫ (${t}) dx → ${res.rule}`);
        integTerms.push(res.integ);
      });

      let finalInteg = integTerms.join(' + ').replace(/\+\s*-/g, '- ');

      let report = `==========================================================
              SYMBOLIC INTEGRAL CALCULATOR
==========================================================
Integrand f(x) = ${raw}

STEP-BY-STEP INTEGRATION:
${steps.join('\n')}

==========================================================
INDEFINITE INTEGRAL RESULT:
F(x) = ∫ [ ${raw} ] dx
     = ${finalInteg} + C
==========================================================`;

      if (out) out.value = report;
      if (window.showToast) window.showToast('Integral computed successfully!', 'success');
    } catch (err) {
      if (out) out.value = `ERROR: Failed to compute integral: ${err.message}`;
    }
  }

  const activeBtn = document.getElementById('calc-integ-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', computeIntegral);
  computeIntegral();
});
