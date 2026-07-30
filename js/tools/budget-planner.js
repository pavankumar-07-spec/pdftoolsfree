document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const out = document.getElementById('main-output');

  if (inputsContainer) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div><label class="form-label">Monthly Take-Home Income ($)</label><input type="number" id="bud-income" class="form-input" value="4000" min="0"></div>
        <div><label class="form-label">Budget Allocation Strategy</label>
          <select id="bud-rule" class="form-input">
            <option value="50-30-20">50 / 30 / 20 Rule (Standard)</option>
            <option value="70-20-10">70 / 20 / 10 Rule (Aggressive Savings)</option>
            <option value="60-20-20">60 / 20 / 20 Rule (Balanced)</option>
          </select>
        </div>
      </div>
      <button id="bud-calc-btn" class="btn btn-primary w-full">💰 Generate Budget Allocation Plan</button>
    `;
  }

  function calculate() {
    const income = parseFloat(document.getElementById('bud-income')?.value || 4000);
    const rule = document.getElementById('bud-rule')?.value || '50-30-20';

    let nPct = 0.50, wPct = 0.30, sPct = 0.20;
    if (rule === '70-20-10') { nPct = 0.70; wPct = 0.20; sPct = 0.10; }
    else if (rule === '60-20-20') { nPct = 0.60; wPct = 0.20; sPct = 0.20; }

    const needs = income * nPct;
    const wants = income * wPct;
    const savings = income * sPct;

    let res = `--- MONTHLY BUDGET ALLOCATION PLAN (${rule}) ---

`;
    res += `Total Monthly Income: $${income.toFixed(2)}

`;
    res += `=== RECOMMENDED EXPENSE BREAKDOWN ===
`;
    res += `1. Needs (Rent, Utilities, Food):       $${needs.toFixed(2)} (${Math.round(nPct*100)}%)
`;
    res += `2. Wants (Dining, Entertainment):     $${wants.toFixed(2)} (${Math.round(wPct*100)}%)
`;
    res += `3. Savings & Debt Payoff:             $${savings.toFixed(2)} (${Math.round(sPct*100)}%)

`;
    res += `Annual Savings Potential: $${(savings * 12).toFixed(2)} / year`;

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Savings Target: $${savings.toFixed(0)}/mo`, 'success');
  }

  document.getElementById('bud-calc-btn')?.addEventListener('click', calculate);
  calculate();
});