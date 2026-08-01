/**
 * Electricity Bill & Energy Consumption Calculator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('eb-units')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Monthly Power Consumed (kWh / Units):</label>
        <input type="number" id="eb-units" class="form-input" value="350" min="1" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Rate per Unit ($ / ₹):</label>
          <input type="number" id="eb-rate" class="form-input" value="0.15" step="0.01" min="0.01" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Fixed Monthly Meter Charge ($ / ₹):</label>
          <input type="number" id="eb-fixed" class="form-input" value="10" min="0" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-eb-btn" class="btn btn-primary flex-1">⚡ Calculate Electricity Bill</button>
      </div>
    `;
  }

  function calculate() {
    const units = parseFloat(document.getElementById('eb-units') ? document.getElementById('eb-units').value : 350) || 0;
    const rate = parseFloat(document.getElementById('eb-rate') ? document.getElementById('eb-rate').value : 0.15) || 0;
    const fixed = parseFloat(document.getElementById('eb-fixed') ? document.getElementById('eb-fixed').value : 10) || 0;

    if (units <= 0 || rate <= 0) {
      if (out) out.value = 'ERROR: Please enter valid positive values for units consumed and rate per unit.';
      return;
    }

    const energyCharge = units * rate;
    const totalBill = energyCharge + fixed;
    const dailyCost = totalBill / 30;

    let res = `--- ELECTRICITY BILL CALCULATOR REPORT ---nn`;
    res += `Units Consumed:      ${units} kWhn`;
    res += `Tariff Rate:        $${rate.toFixed(3)} / kWhn`;
    res += `Fixed Meter Charge: $${fixed.toFixed(2)}nn`;

    res += `=== COST BREAKDOWN ===n`;
    res += `Energy Charge:      $${energyCharge.toFixed(2)}n`;
    res += `Fixed Charge:       $${fixed.toFixed(2)}n`;
    res += `TOTAL MONTHLY BILL: $${totalBill.toFixed(2)}nn`;

    res += `Est. Daily Cost:    $${dailyCost.toFixed(2)} / dayn`;

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Total Bill: $${totalBill.toFixed(2)}`, 'success');
  }

  const activeBtn = document.getElementById('calc-eb-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
