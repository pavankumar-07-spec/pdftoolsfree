/**
 * GCD Calculator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('gcd-num1')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">First Number (a):</label>
          <input type="number" id="gcd-num1" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="48">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Second Number (b):</label>
          <input type="number" id="gcd-num2" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="18">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-gcd-btn" class="btn btn-primary flex-1">🔢 Compute GCD (Euclidean Algorithm)</button>
      </div>
    `;
  }

  function calculate() {
    let a = parseInt(document.getElementById('gcd-num1')?.value || '48', 10);
    let b = parseInt(document.getElementById('gcd-num2')?.value || '18', 10);

    if (isNaN(a) || isNaN(b) || a <= 0 || b <= 0) {
      if (out) out.value = 'ERROR: Please enter positive integers.';
      return;
    }

    const origA = a, origB = b;
    let steps = [];
    let tempA = a, tempB = b;

    while (tempB !== 0) {
      const rem = tempA % tempB;
      const q = Math.floor(tempA / tempB);
      steps.push(`${tempA} = ${tempB} × ${q} + ${rem}`);
      tempA = tempB;
      tempB = rem;
    }
    const gcd = tempA;

    let res = '--- GREATEST COMMON DIVISOR (GCD) ---nn';
    res += `Numbers: a = ${origA}, b = ${origB}nn`;
    res += `Euclidean Algorithm Steps:n`;
    steps.forEach((step, idx) => {
      res += `Step ${idx + 1}: ${step}n`;
    });
    res += `nResult: GCD(${origA}, ${origB}) = ${gcd}n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('GCD calculated!', 'success');
  }

  const activeBtn = document.getElementById('calc-gcd-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
