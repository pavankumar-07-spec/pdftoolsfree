/**
 * Standard Deviation Calculator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('sd-input')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Enter Numbers (comma or space separated):</label>
        <textarea id="sd-input" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">4, 8, 6, 5, 3, 2, 8, 9, 2, 5</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-sd-btn" class="btn btn-primary flex-1">📉 Compute Standard Deviation</button>
      </div>
    `;
  }

  function calculate() {
    const raw = document.getElementById('sd-input') ? document.getElementById('sd-input').value : '';
    const nums = raw.replace(/[^d.,-]/g, ' ').trim().split(/s+/).map(Number).filter(n => !isNaN(n));

    if (nums.length < 2) {
      if (out) out.value = 'ERROR: Please enter at least 2 numbers.';
      return;
    }

    const n = nums.length;
    const mean = nums.reduce((a, b) => a + b, 0) / n;

    const popVar = nums.reduce((acc, x) => acc + Math.pow(x - mean, 2), 0) / n;
    const sampleVar = nums.reduce((acc, x) => acc + Math.pow(x - mean, 2), 0) / (n - 1);

    const popSD = Math.sqrt(popVar);
    const sampleSD = Math.sqrt(sampleVar);

    let res = '--- STANDARD DEVIATION CALCULATOR ---nn';
    res += `Count (n): ${n}n`;
    res += `Mean (μ / x̄): ${mean.toFixed(4)}nn`;
    res += `1. Sample Standard Deviation (s): ${sampleSD.toFixed(6)}n`;
    res += `   (Used when data represents a sample of a larger population)nn`;
    res += `2. Population Standard Deviation (σ): ${popSD.toFixed(6)}n`;
    res += `   (Used when data represents the entire population)nn`;
    res += `Sample Variance (s²): ${sampleVar.toFixed(6)}n`;
    res += `Population Variance (σ²): ${popVar.toFixed(6)}n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Standard Deviation computed!', 'success');
  }

  const activeBtn = document.getElementById('calc-sd-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
