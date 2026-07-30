/**
 * Logarithm Calculator Engine - B.Tech Level Math
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('log-val')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input Value (x > 0):</label>
          <input type="number" id="log-val" class="form-input" value="100" min="0.000001" step="any" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Custom Base b (b > 0, b ≠ 1):</label>
          <input type="number" id="log-base" class="form-input" value="10" min="0.000001" step="any" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-log-btn" class="btn btn-primary flex-1">📐 Compute Logarithms</button>
      </div>
    `;
  }

  function calculate() {
    const x = parseFloat(document.getElementById('log-val') ? document.getElementById('log-val').value : 100);
    const b = parseFloat(document.getElementById('log-base') ? document.getElementById('log-base').value : 10);

    if (isNaN(x) || x <= 0) {
      if (out) out.value = 'ERROR: Logarithm input x must be strictly greater than 0.';
      return;
    }
    if (isNaN(b) || b <= 0 || b === 1) {
      if (out) out.value = 'ERROR: Logarithm base b must be strictly greater than 0 and not equal to 1.';
      return;
    }

    const lnX = Math.log(x);
    const log10X = Math.log10(x);
    const log2X = Math.log2(x);
    const logBX = lnX / Math.log(b);

    const expX = Math.exp(x);
    const pow10X = Math.pow(10, x);

    let res = `--- LOGARITHM CALCULATOR RESULTS ---nn`;
    res += `Input Value x = ${x}n`;
    res += `Custom Base b = ${b}nn`;

    res += `=== CORE LOGARITHM VALUES ===n`;
    res += `1. Natural Logarithm ln(x) [Base e]:     ${lnX.toFixed(8)}n`;
    res += `2. Common Logarithm log₁₀(x) [Base 10]: ${log10X.toFixed(8)}n`;
    res += `3. Binary Logarithm log₂(x) [Base 2]:    ${log2X.toFixed(8)}n`;
    res += `4. Custom Base Logarithm log_b(x):      ${logBX.toFixed(8)}nn`;

    res += `=== CHANGE OF BASE DERIVATION ===n`;
    res += `log_b(x) = ln(x) / ln(b) = ${lnX.toFixed(6)} / ${Math.log(b).toFixed(6)} = ${logBX.toFixed(8)}nn`;

    res += `=== ANTILOGARITHMIC / EXPONENTIAL VALUES ===n`;
    res += `e^x (Antilog base e):     ${expX > 1e12 ? expX.toExponential(6) : expX.toFixed(6)}n`;
    res += `10^x (Antilog base 10):   ${pow10X > 1e12 ? pow10X.toExponential(6) : pow10X.toFixed(6)}nn`;

    res += `--- USEFUL LOGARITHM RULES ---n`;
    res += `• log(u · v) = log(u) + log(v)n`;
    res += `• log(u / v) = log(u) - log(v)n`;
    res += `• log(u^k)   = k · log(u)n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Logarithm computed!', 'success');
  }

  const activeBtn = document.getElementById('calc-log-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
