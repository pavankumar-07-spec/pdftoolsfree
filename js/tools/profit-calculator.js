/**
 * Profit Calculator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const ic = document.getElementById('tool-inputs-container');
  const out = document.getElementById('main-output');
  if (ic && !document.getElementById('prof-cost')) {
    ic.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;margin-bottom:1.5rem">
        <div><label class="form-label">Cost Price</label><input type="number" id="prof-cost" class="form-input" value="400"></div>
        <div><label class="form-label">Selling Price</label><input type="number" id="prof-sell" class="form-input" value="600"></div>
        <div><label class="form-label">Units Sold</label><input type="number" id="prof-units" class="form-input" value="100" min="1"></div>
      </div>
      <button id="calc-prof-btn" class="btn btn-primary" style="width:100%">💹 Calculate Profit</button>
    `;
  }
  function calc() {
    try {
      const cost = parseFloat(document.getElementById('prof-cost')?.value) || 0;
      const sell = parseFloat(document.getElementById('prof-sell')?.value) || 0;
      const units = parseInt(document.getElementById('prof-units')?.value) || 1;
      const profitPerUnit = sell - cost;
      const totalProfit = profitPerUnit * units;
      const profitPct = cost !== 0 ? (profitPerUnit / cost) * 100 : 0;
      let r = '==========================================================\n';
      r += '             PROFIT CALCULATOR\n';
      r += '==========================================================\n';
      r += 'Cost Price:        ' + cost.toFixed(2) + '\nSelling Price:     ' + sell.toFixed(2) + '\n';
      r += 'Profit Per Unit:   ' + profitPerUnit.toFixed(2) + ' (' + (profitPerUnit >= 0 ? '📈 Profit' : '📉 Loss') + ')\n';
      r += 'Profit %:          ' + profitPct.toFixed(2) + '%\n';
      r += 'Units Sold:        ' + units + '\n';
      r += 'Total Profit:      ' + totalProfit.toFixed(2) + '\n';
      r += '==========================================================';
      if (out) out.value = r;
      if (window.showToast) window.showToast('Total Profit: ' + totalProfit.toFixed(2), 'success');
    } catch (e) { if (out) out.value = 'Error: ' + e.message; }
  }
  const b = document.getElementById('calc-prof-btn') || document.getElementById('generate-btn');
  if (b) b.onclick = calc;
  calc();
});