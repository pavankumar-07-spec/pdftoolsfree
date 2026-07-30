/**
 * LCM Calculator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('lcm-num1')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">First Number (a):</label>
          <input type="number" id="lcm-num1" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="12">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Second Number (b):</label>
          <input type="number" id="lcm-num2" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="18">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-lcm-btn" class="btn btn-primary flex-1">🔢 Compute LCM</button>
      </div>
    `;
  }

  function getGCD(x, y) {
    while (y !== 0) {
      const t = y;
      y = x % y;
      x = t;
    }
    return x;
  }

  function calculate() {
    let a = parseInt(document.getElementById('lcm-num1')?.value || '12', 10);
    let b = parseInt(document.getElementById('lcm-num2')?.value || '18', 10);

    if (isNaN(a) || isNaN(b) || a <= 0 || b <= 0) {
      if (out) out.value = 'ERROR: Please enter positive integers.';
      return;
    }

    const gcd = getGCD(a, b);
    const lcm = Math.abs(a * b) / gcd;

    let res = '--- LEAST COMMON MULTIPLE (LCM) ---nn';
    res += `Numbers: a = ${a}, b = ${b}nn`;
    res += `1. Greatest Common Divisor GCD(${a}, ${b}) = ${gcd}n`;
    res += `2. Formula: LCM(a, b) = (a × b) / GCD(a, b)n`;
    res += `   LCM(${a}, ${b}) = (${a} × ${b}) / ${gcd} = ${a * b} / ${gcd} = ${lcm}nn`;
    res += `Result: LCM(${a}, ${b}) = ${lcm}n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('LCM calculated!', 'success');
  }

  const activeBtn = document.getElementById('calc-lcm-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
