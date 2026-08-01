/**
 * Upgraded Real Partial Fraction Expansion Engine
 * Decomposes rational expressions P(x)/((x-a)(x-b)) into linear partial fraction terms A/(x-a) + B/(x-b).
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('pf-num')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label">Numerator P(x) (e.g. 5x + 7)</label>
          <input type="text" id="pf-num" class="form-input" value="5x + 7">
        </div>
        <div>
          <label class="form-label">Denominator Factor 1 (x - a)</label>
          <input type="text" id="pf-den1" class="form-input" value="x - 1">
        </div>
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label">Denominator Factor 2 (x - b)</label>
        <input type="text" id="pf-den2" class="form-input" value="x + 2">
      </div>
      <div class="flex gap-3 mt-4">
        <button id="calc-pf-btn" class="btn btn-primary flex-1">🧩 Decompose into Partial Fractions</button>
      </div>
    `;
  }

  function decompose() {
    const numStr = (document.getElementById('pf-num') ? document.getElementById('pf-num').value : '5x + 7').trim();
    const den1Str = (document.getElementById('pf-den1') ? document.getElementById('pf-den1').value : 'x - 1').trim();
    const den2Str = (document.getElementById('pf-den2') ? document.getElementById('pf-den2').value : 'x + 2').trim();

    try {
      // Parse roots a and b from (x - a) and (x - b)
      let rootA = 1;
      let rootB = -2;

      const matchA = den1Str.match(/x\s*([+-]\s*\d+)/i);
      if (matchA) rootA = -parseFloat(matchA[1].replace(/\s+/g, ''));

      const matchB = den2Str.match(/x\s*([+-]\s*\d+)/i);
      if (matchB) rootB = -parseFloat(matchB[1].replace(/\s+/g, ''));

      // Parse numerator P(x) = mx + k
      let m = 5;
      let k = 7;
      const numMatch = numStr.match(/([+-]?\d*)\s*x\s*([+-]\s*\d+)?/i);
      if (numMatch) {
        let mStr = numMatch[1].replace(/\s+/g, '');
        m = mStr === '' || mStr === '+' ? 1 : mStr === '-' ? -1 : parseFloat(mStr);
        k = numMatch[2] ? parseFloat(numMatch[2].replace(/\s+/g, '')) : 0;
      }

      // Cover-up method:
      // A = P(a) / (a - b)
      // B = P(b) / (b - a)
      const Pa = m * rootA + k;
      const Pb = m * rootB + k;
      const A = Pa / (rootA - rootB);
      const B = Pb / (rootB - rootA);

      let report = `==========================================================
             PARTIAL FRACTION DECOMPOSITION
==========================================================
Rational Function:
         ${numStr}
f(x) = --------------------
       (${den1Str})(${den2Str})

PARTIAL FRACTION SETUP:
         ${numStr}                   A           B
--------------------  =  -------- + --------
 (${den1Str})(${den2Str})       (${den1Str})  (${den2Str})

STEP 1: Cover-up method for A at x = ${rootA}:
  A = [ (${m})(${rootA}) + (${k}) ] / [ (${rootA}) - (${rootB}) ]
    = ${Pa} / ${rootA - rootB} = ${A.toFixed(4)}

STEP 2: Cover-up method for B at x = ${rootB}:
  B = [ (${m})(${rootB}) + (${k}) ] / [ (${rootB}) - (${rootA}) ]
    = ${Pb} / ${rootB - rootA} = ${B.toFixed(4)}

==========================================================
DECOMPOSED PARTIAL FRACTIONS:
       ${A.toFixed(2)}             ${B.toFixed(2)}
  ------------  +  ------------
   (${den1Str})       (${den2Str})
==========================================================`;

      if (out) out.value = report;
      if (window.showToast) window.showToast('Partial fractions decomposed!', 'success');
    } catch (err) {
      if (out) out.value = `ERROR: Failed to decompose partial fractions: ${err.message}`;
    }
  }

  const activeBtn = document.getElementById('calc-pf-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', decompose);
  decompose();
});
