/**
 * Statistics Calculator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('stats-input')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Enter Numbers (comma or space separated):</label>
        <textarea id="stats-input" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">10, 15, 20, 25, 30, 35, 40, 45, 50</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-stats-btn" class="btn btn-primary flex-1">📊 Compute Complete Statistics</button>
      </div>
    `;
  }

  function calculate() {
    const raw = document.getElementById('stats-input') ? document.getElementById('stats-input').value : '';
    const nums = raw.replace(/[^d.,-]/g, ' ').trim().split(/s+/).map(Number).filter(n => !isNaN(n));

    if (nums.length === 0) {
      if (out) out.value = 'ERROR: Please enter valid numeric dataset.';
      return;
    }

    const n = nums.length;
    const sorted = [...nums].sort((a, b) => a - b);
    const sum = nums.reduce((a, b) => a + b, 0);
    const mean = sum / n;

    // Median
    let median = 0;
    const mid = Math.floor(n / 2);
    if (n % 2 === 0) {
      median = (sorted[mid - 1] + sorted[mid]) / 2;
    } else {
      median = sorted[mid];
    }

    // Mode
    const freq = {};
    let maxFreq = 0;
    nums.forEach(num => {
      freq[num] = (freq[num] || 0) + 1;
      if (freq[num] > maxFreq) maxFreq = freq[num];
    });
    const modes = Object.keys(freq).filter(k => freq[k] === maxFreq && maxFreq > 1);

    // Variance & StdDev
    const varPop = nums.reduce((acc, x) => acc + Math.pow(x - mean, 2), 0) / n;
    const varSample = n > 1 ? nums.reduce((acc, x) => acc + Math.pow(x - mean, 2), 0) / (n - 1) : 0;
    const stdPop = Math.sqrt(varPop);
    const stdSample = Math.sqrt(varSample);

    const min = sorted[0];
    const max = sorted[n - 1];
    const range = max - min;

    let res = '--- COMPLETE DESCRIPTIVE STATISTICS ---nn';
    res += `Dataset Count (n): ${n}n`;
    res += `Sum (Σx): ${sum}n`;
    res += `Mean (μ / x̄): ${mean.toFixed(4)}n`;
    res += `Median: ${median}n`;
    res += `Mode: ${modes.length > 0 ? modes.join(', ') : 'No Mode (All unique)'}n`;
    res += `Minimum: ${min}n`;
    res += `Maximum: ${max}n`;
    res += `Range: ${range}nn`;
    res += `Population Variance (σ²): ${varPop.toFixed(4)}n`;
    res += `Population Std Dev (σ): ${stdPop.toFixed(4)}n`;
    res += `Sample Variance (s²): ${varSample.toFixed(4)}n`;
    res += `Sample Std Dev (s): ${stdSample.toFixed(4)}n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Statistics computed!', 'success');
  }

  const activeBtn = document.getElementById('calc-stats-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
