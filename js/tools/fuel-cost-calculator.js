/**
 * Fuel Cost & Trip Expense Calculator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('fc-dist')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Trip Distance (km or miles):</label>
          <input type="number" id="fc-dist" class="form-input" value="350" min="1" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Fuel Efficiency (km/L or mpg):</label>
          <input type="number" id="fc-eff" class="form-input" value="15" min="1" step="0.5" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Fuel Price ($ or ₹ / unit):</label>
          <input type="number" id="fc-price" class="form-input" value="1.25" step="0.05" min="0.1" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Number of Passengers:</label>
          <input type="number" id="fc-pass" class="form-input" value="1" min="1" max="10" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-fc-btn" class="btn btn-primary flex-1">⛽ Calculate Fuel Cost</button>
      </div>
    `;
  }

  function calculate() {
    const dist = parseFloat(document.getElementById('fc-dist') ? document.getElementById('fc-dist').value : 350) || 0;
    const eff = parseFloat(document.getElementById('fc-eff') ? document.getElementById('fc-eff').value : 15) || 0;
    const price = parseFloat(document.getElementById('fc-price') ? document.getElementById('fc-price').value : 1.25) || 0;
    const pass = parseInt(document.getElementById('fc-pass') ? document.getElementById('fc-pass').value : 1, 10) || 1;

    if (dist <= 0 || eff <= 0 || price <= 0) {
      if (out) out.value = 'ERROR: Please enter valid positive values for distance, efficiency, and fuel price.';
      return;
    }

    const fuelNeeded = dist / eff;
    const totalCost = fuelNeeded * price;
    const costPerPerson = totalCost / pass;

    let res = `--- TRIP FUEL COST CALCULATOR REPORT ---nn`;
    res += `Distance:         ${dist} unitsn`;
    res += `Fuel Efficiency:  ${eff} units/Ln`;
    res += `Fuel Price:       $${price.toFixed(2)} / Ln`;
    res += `Passengers:       ${pass}nn`;

    res += `=== COST SUMMARY ===n`;
    res += `Total Fuel Needed: ${fuelNeeded.toFixed(2)} Litersn`;
    res += `TOTAL TRIP COST:   $${totalCost.toFixed(2)}n`;
    if (pass > 1) {
      res += `Cost Per Person:   $${costPerPerson.toFixed(2)}n`;
    }

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Total Trip Fuel Cost: $${totalCost.toFixed(2)}`, 'success');
  }

  const activeBtn = document.getElementById('calc-fc-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
