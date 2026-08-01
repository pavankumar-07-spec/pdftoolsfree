/**
 * Margin Calculator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const ic = document.getElementById('tool-inputs-container');
  const out = document.getElementById('main-output');
  if (ic && !document.getElementById('margin-cost')) {
    ic.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem">
        <div><label class="form-label">Cost Price (₹/$)</label><input type="number" id="margin-cost" class="form-input" value="500"></div>
        <div><label class="form-label">Selling Price (₹/$)</label><input type="number" id="margin-sell" class="form-input" value="750"></div>
      </div>
      <button id="calc-margin-btn" class="btn btn-primary" style="width:100%">📊 Calculate Margin & Markup</button>
    `;
  }
  function calc() {
    try {
      const cost = parseFloat(document.getElementById('margin-cost')?.value) || 0;
      const sell = parseFloat(document.getElementById('margin-sell')?.value) || 0;
      const profit = sell - cost;
      const margin = sell !== 0 ? (profit / sell) * 100 : 0;
      const markup = cost !== 0 ? (profit / cost) * 100 : 0;
      let r = '==========================================================\n';
      r += '             MARGIN & MARKUP CALCULATOR\n';
      r += '==========================================================\n';
      r += 'Cost Price:     ' + cost.toFixed(2) + '\nSelling Price:  ' + sell.toFixed(2) + '\n';
      r += 'Profit:         ' + profit.toFixed(2) + '\n';
      r += 'Profit Margin:  ' + margin.toFixed(2) + '% (Profit/Revenue)\n';
      r += 'Markup:         ' + markup.toFixed(2) + '% (Profit/Cost)\n';
      r += '==========================================================';
      if (out) out.value = r;
      if (window.showToast) window.showToast('Margin: ' + margin.toFixed(1) + '% | Markup: ' + markup.toFixed(1) + '%', 'success');
    } catch (e) { if (out) out.value = 'Error: ' + e.message; }
  }
  const b = document.getElementById('calc-margin-btn') || document.getElementById('generate-btn');
  if (b) b.onclick = calc;
  calc();
});