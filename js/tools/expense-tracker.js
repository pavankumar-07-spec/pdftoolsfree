document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const out = document.getElementById('main-output');

  if (inputsContainer) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:1rem;margin-bottom:1rem">
        <div><label class="form-label">Monthly Income ($)</label><input type="number" id="exp-income" class="form-input" value="3500"></div>
        <div><label class="form-label">Rent / Housing ($)</label><input type="number" id="exp-rent" class="form-input" value="1200"></div>
        <div><label class="form-label">Groceries & Food ($)</label><input type="number" id="exp-food" class="form-input" value="450"></div>
        <div><label class="form-label">Utilities & Internet ($)</label><input type="number" id="exp-utils" class="form-input" value="200"></div>
        <div><label class="form-label">Transport / Fuel ($)</label><input type="number" id="exp-trans" class="form-input" value="150"></div>
      </div>
      <button id="exp-calc-btn" class="btn btn-primary w-full">📈 Audit Monthly Cash Flow</button>
    `;
  }

  function calculate() {
    const inc = parseFloat(document.getElementById('exp-income')?.value || 0);
    const rent = parseFloat(document.getElementById('exp-rent')?.value || 0);
    const food = parseFloat(document.getElementById('exp-food')?.value || 0);
    const utils = parseFloat(document.getElementById('exp-utils')?.value || 0);
    const trans = parseFloat(document.getElementById('exp-trans')?.value || 0);

    const totalExp = rent + food + utils + trans;
    const netSavings = inc - totalExp;
    const expRatio = inc > 0 ? (totalExp / inc) * 100 : 0;

    let res = `--- MONTHLY EXPENSE & CASH FLOW AUDIT ---

`;
    res += `Total Monthly Income:   $${inc.toFixed(2)}
`;
    res += `Total Logged Expenses:  $${totalExp.toFixed(2)} (${expRatio.toFixed(1)}% of income)
`;
    res += `Net Remaining Cash Flow: $${netSavings.toFixed(2)}

`;
    res += `=== CATEGORY EXPENSE RATIOS ===
`;
    res += `• Housing/Rent: $${rent.toFixed(2)} (${inc > 0 ? ((rent/inc)*100).toFixed(1) : 0}%)
`;
    res += `• Groceries:    $${food.toFixed(2)} (${inc > 0 ? ((food/inc)*100).toFixed(1) : 0}%)
`;
    res += `• Utilities:    $${utils.toFixed(2)} (${inc > 0 ? ((utils/inc)*100).toFixed(1) : 0}%)
`;
    res += `• Transport:    $${trans.toFixed(2)} (${inc > 0 ? ((trans/inc)*100).toFixed(1) : 0}%)
`;

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Net Cash Flow: $${netSavings.toFixed(0)}`, netSavings >= 0 ? 'success' : 'warning');
  }

  document.getElementById('exp-calc-btn')?.addEventListener('click', calculate);
  calculate();
});