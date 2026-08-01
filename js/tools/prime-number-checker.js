/**
 * Prime Number Checker Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('prime-num')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Enter Integer (N):</label>
        <input type="number" id="prime-num" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="97">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-prime-btn" class="btn btn-primary flex-1">🔍 Check Primality & Factors</button>
      </div>
    `;
  }

  function getPrimeFactors(n) {
    const factors = [];
    let d = 2;
    while (n >= 2) {
      if (n % d === 0) {
        factors.push(d);
        n /= d;
      } else {
        d++;
        if (d * d > n) {
          if (n > 1) factors.push(n);
          break;
        }
      }
    }
    return factors;
  }

  function calculate() {
    let n = parseInt(document.getElementById('prime-num')?.value || '97', 10);

    if (isNaN(n) || n < 1) {
      if (out) out.value = 'ERROR: Please enter a positive integer greater than 0.';
      return;
    }

    let isPrime = true;
    let reason = '';

    if (n === 1) {
      isPrime = false;
      reason = '1 is neither prime nor composite by definition.';
    } else if (n === 2 || n === 3) {
      isPrime = true;
      reason = `${n} is a prime number (only divisible by 1 and itself).`;
    } else if (n % 2 === 0) {
      isPrime = false;
      reason = `${n} is even and divisible by 2.`;
    } else {
      const limit = Math.floor(Math.sqrt(n));
      for (let i = 3; i <= limit; i += 2) {
        if (n % i === 0) {
          isPrime = false;
          reason = `${n} is divisible by ${i} (${i} × ${n / i} = ${n}).`;
          break;
        }
      }
      if (isPrime) {
        reason = `${n} has no divisors up to √${n} (≈ ${limit}).`;
      }
    }

    const primeFactors = getPrimeFactors(n);

    let res = '--- PRIME NUMBER CHECKER ---nn';
    res += `Number: N = ${n}n`;
    res += `Result: ${isPrime ? '✅ PRIME NUMBER' : '❌ NOT A PRIME NUMBER'}nn`;
    res += `Explanation: ${reason}nn`;
    res += `Prime Factorization: ${primeFactors.join(' × ')}n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast(isPrime ? 'Number is PRIME!' : 'Number is NOT prime.', isPrime ? 'success' : 'info');
  }

  const activeBtn = document.getElementById('calc-prime-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
