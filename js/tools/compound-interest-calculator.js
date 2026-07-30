/**
 * Compound Interest Calculator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('ci-principal')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Principal Amount (₹/$):</label>
          <input type="number" id="ci-principal" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="100000">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Annual Interest Rate (%):</label>
          <input type="number" id="ci-rate" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="8.5">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Time (Years):</label>
          <input type="number" id="ci-time" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="5">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Compounding Frequency:</label>
          <select id="ci-freq" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
            <option value="1">Annually (1x/year)</option>
            <option value="2">Semi-Annually (2x/year)</option>
            <option value="4">Quarterly (4x/year)</option>
            <option value="12" selected>Monthly (12x/year)</option>
            <option value="365">Daily (365x/year)</option>
          </select>
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-ci-btn" class="btn btn-primary flex-1">💰 Calculate Compound Interest</button>
      </div>
    `;
  }

  function calculate() {
    const P = parseFloat(document.getElementById('ci-principal')?.value || 0);
    const r = parseFloat(document.getElementById('ci-rate')?.value || 0) / 100;
    const t = parseFloat(document.getElementById('ci-time')?.value || 0);
    const n = parseInt(document.getElementById('ci-freq')?.value || 12);

    if ([P, r, t, n].some(isNaN) || P <= 0 || r <= 0 || t <= 0) {
      if (out) out.value = 'ERROR: Please enter valid positive values.'; return;
    }

    const A = P * Math.pow(1 + r / n, n * t);
    const ci = A - P;
    const siA = P * (1 + r * t);
    const siInterest = siA - P;

    const freqLabels = { 1: 'Annually', 2: 'Semi-Annually', 4: 'Quarterly', 12: 'Monthly', 365: 'Daily' };

    let res = '--- COMPOUND INTEREST CALCULATOR ---nn';
    res += `Principal: ₹${P.toLocaleString('en-IN', { minimumFractionDigits: 2 })}n`;
    res += `Annual Rate: ${(r * 100).toFixed(2)}%n`;
    res += `Duration: ${t} year(s)n`;
    res += `Compounding: ${freqLabels[n] || `${n}x per year`}nn`;
    res += `Total Amount (A): ₹${A.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}n`;
    res += `Compound Interest Earned: ₹${ci.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}nn`;
    res += `--- Comparison vs Simple Interest ---n`;
    res += `SI Amount: ₹${siA.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}n`;
    res += `SI Interest: ₹${siInterest.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}n`;
    res += `Extra Earned (CI - SI): ₹${(ci - siInterest).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Compound interest calculated!', 'success');
  }

  const activeBtn = document.getElementById('calc-ci-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
