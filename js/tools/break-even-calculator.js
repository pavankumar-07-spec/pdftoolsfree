/**
 * Break-Even Calculator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('be-fixed')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Fixed Costs ($/₹):</label>
          <input type="number" id="be-fixed" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="100000">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Price Per Unit ($/₹):</label>
          <input type="number" id="be-price" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="500">
        </div>
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Variable Cost Per Unit ($/₹):</label>
        <input type="number" id="be-variable" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="200">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-be-btn" class="btn btn-primary flex-1">📊 Calculate Break-Even Point</button>
      </div>
    `;
  }

  function calculate() {
    const fixed = parseFloat(document.getElementById('be-fixed')?.value || 0);
    const price = parseFloat(document.getElementById('be-price')?.value || 0);
    const variable = parseFloat(document.getElementById('be-variable')?.value || 0);

    const marginPerUnit = price - variable;

    if (fixed <= 0 || price <= 0 || marginPerUnit <= 0) {
      if (out) out.value = 'ERROR: Price per unit must be greater than variable cost per unit.';
      return;
    }

    const breakEvenUnits = Math.ceil(fixed / marginPerUnit);
    const breakEvenRevenue = breakEvenUnits * price;

    let res = '--- BREAK-EVEN ANALYSIS ---nn';
    res += `Fixed Costs:             ₹${fixed.toLocaleString()}n`;
    res += `Price per Unit:          ₹${price.toLocaleString()}n`;
    res += `Variable Cost per Unit:  ₹${variable.toLocaleString()}n`;
    res += `Contribution Margin:     ₹${marginPerUnit.toLocaleString()} per unitnn`;
    res += `Break-Even Quantity:     ${breakEvenUnits.toLocaleString()} unitsn`;
    res += `Break-Even Revenue:      ₹${breakEvenRevenue.toLocaleString()}n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Break-even: ${breakEvenUnits} units`, 'success');
  }

  const activeBtn = document.getElementById('calc-be-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
