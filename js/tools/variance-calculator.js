/**
 * Variance Calculator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('var-input')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Enter Numbers (comma or space separated):</label>
        <textarea id="var-input" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">10, 12, 23, 23, 16, 23, 21, 16</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-var-btn" class="btn btn-primary flex-1">📊 Compute Variance</button>
      </div>
    `;
  }

  function calculate() {
    const raw = document.getElementById('var-input') ? document.getElementById('var-input').value : '';
    const nums = raw.replace(/[^d.,-]/g, ' ').trim().split(/s+/).map(Number).filter(n => !isNaN(n));

    if (nums.length < 2) {
      if (out) out.value = 'ERROR: Please enter at least 2 numbers.';
      return;
    }

    const n = nums.length;
    const mean = nums.reduce((a, b) => a + b, 0) / n;

    const sumSqDiff = nums.reduce((acc, x) => acc + Math.pow(x - mean, 2), 0);
    const popVar = sumSqDiff / n;
    const sampleVar = sumSqDiff / (n - 1);

    let res = '--- VARIANCE CALCULATOR ---nn';
    res += `Count (n): ${n}n`;
    res += `Mean (μ): ${mean.toFixed(4)}n`;
    res += `Sum of Squared Differences Σ(x - μ)²: ${sumSqDiff.toFixed(4)}nn`;
    res += `Sample Variance (s² = Σ(x - x̄)² / (n - 1)): ${sampleVar.toFixed(6)}n`;
    res += `Population Variance (σ² = Σ(x - μ)² / n): ${popVar.toFixed(6)}nn`;
    res += `Sample Std Dev (s): ${Math.sqrt(sampleVar).toFixed(6)}n`;
    res += `Population Std Dev (σ): ${Math.sqrt(popVar).toFixed(6)}n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Variance computed!', 'success');
  }

  const activeBtn = document.getElementById('calc-var-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
