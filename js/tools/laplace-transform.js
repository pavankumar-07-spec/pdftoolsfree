/**
 * Upgraded Real Laplace Transform Engine
 * Evaluates Laplace transforms L{f(t)} = F(s) for standard signals (t^n, e^{at}, sin(wt), cos(wt)).
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('laplace-expr')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label">Time-Domain Signal f(t) (e.g. 5t^2, e^(3t), sin(4t), cos(2t))</label>
        <input type="text" id="laplace-expr" class="form-input" value="3t^2 + e^(2t) - sin(4t)">
      </div>
      <div class="flex gap-3 mt-4">
        <button id="calc-lap-btn" class="btn btn-primary flex-1">⚡ Evaluate Laplace Transform ℒ{f(t)}</button>
      </div>
    `;
  }

  function factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
  }

  function transformTerm(term) {
    term = term.trim();
    if (!term) return { laplace: '0', rule: '' };

    // Constant number k -> k / s
    if (/^[+-]?\d+(\.\d+)?$/.test(term)) {
      const k = parseFloat(term);
      return { laplace: `${k}/s`, rule: `ℒ{${k}} = ${k}/s` };
    }

    // Single t -> 1 / s^2
    if (term === 't' || term === '+t') return { laplace: '1/s^2', rule: 'ℒ{t} = 1/s^2' };
    if (term === '-t') return { laplace: '-1/s^2', rule: 'ℒ{-t} = -1/s^2' };

    // Polynomial kt^n -> k · n! / s^(n+1)
    const polyMatch = term.match(/^([+-]?\d*)t\^(\d+)$/);
    if (polyMatch) {
      const k = polyMatch[1] === '' || polyMatch[1] === '+' ? 1 : polyMatch[1] === '-' ? -1 : parseFloat(polyMatch[1]);
      const n = parseInt(polyMatch[2]);
      const num = k * factorial(n);
      return { laplace: `${num}/s^${n + 1}`, rule: `ℒ{${term}} = ${k}·${n}! / s^${n + 1} = ${num}/s^${n + 1}` };
    }

    // Exponential ke^(at) -> k / (s - a)
    const expMatch = term.match(/^([+-]?\d*)e\^\(?([+-]?\d+)t\)?$/);
    if (expMatch) {
      const k = expMatch[1] === '' || expMatch[1] === '+' ? 1 : expMatch[1] === '-' ? -1 : parseFloat(expMatch[1]);
      const a = parseFloat(expMatch[2]);
      const denom = a > 0 ? `(s - ${a})` : `(s + ${Math.abs(a)})`;
      return { laplace: `${k}/${denom}`, rule: `ℒ{${term}} = ${k}/${denom}` };
    }

    // Sinusoidal k·sin(wt) -> k·w / (s^2 + w^2)
    const sinMatch = term.match(/^([+-]?\d*)sin\((?:(\d+)t|t)\)$/);
    if (sinMatch) {
      const k = sinMatch[1] === '' || sinMatch[1] === '+' ? 1 : sinMatch[1] === '-' ? -1 : parseFloat(sinMatch[1]);
      const w = sinMatch[2] ? parseFloat(sinMatch[2]) : 1;
      const num = k * w;
      return { laplace: `${num}/(s^2 + ${w * w})`, rule: `ℒ{${term}} = ${num}/(s^2 + ${w * w})` };
    }

    // Cosinusoidal k·cos(wt) -> k·s / (s^2 + w^2)
    const cosMatch = term.match(/^([+-]?\d*)cos\((?:(\d+)t|t)\)$/);
    if (cosMatch) {
      const k = cosMatch[1] === '' || cosMatch[1] === '+' ? 1 : cosMatch[1] === '-' ? -1 : parseFloat(cosMatch[1]);
      const w = cosMatch[2] ? parseFloat(cosMatch[2]) : 1;
      const numStr = k === 1 ? 's' : k === -1 ? '-s' : `${k}s`;
      return { laplace: `${numStr}/(s^2 + ${w * w})`, rule: `ℒ{${term}} = ${numStr}/(s^2 + ${w * w})` };
    }

    return { laplace: `${term}/s`, rule: `ℒ{${term}} = ${term}/s` };
  }

  function computeLaplace() {
    const raw = (document.getElementById('laplace-expr') ? document.getElementById('laplace-expr').value : '3t^2 + e^(2t) - sin(4t)').trim();
    if (!raw) {
      if (out) out.value = 'ERROR: Please enter a valid time-domain signal f(t).';
      return;
    }

    try {
      const terms = raw.replace(/-/g, ' -').replace(/\+/g, ' +').trim().split(/\s+/);
      const steps = [];
      const lapTerms = [];

      terms.forEach(t => {
        if (!t) return;
        const res = transformTerm(t);
        steps.push(`• ${res.rule}`);
        lapTerms.push(res.laplace);
      });

      let finalLaplace = lapTerms.join(' + ').replace(/\+\s*-/g, '- ');

      let report = `==========================================================
                LAPLACE TRANSFORM EVALUATOR
==========================================================
Time-Domain Signal f(t) = ${raw}

TRANSFORM TABLE LOOKUPS & LINEARITY:
${steps.join('\n')}

==========================================================
s-DOMAIN LAPLACE RESULT:
F(s) = ℒ{ ${raw} }
     = ${finalLaplace}
==========================================================`;

      if (out) out.value = report;
      if (window.showToast) window.showToast('Laplace transform evaluated!', 'success');
    } catch (err) {
      if (out) out.value = `ERROR: Failed to evaluate Laplace transform: ${err.message}`;
    }
  }

  const activeBtn = document.getElementById('calc-lap-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', computeLaplace);
  computeLaplace();
});
