/**
 * Discount & Sale Price Calculator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const ic = document.getElementById('tool-inputs-container');
  const out = document.getElementById('main-output');
  if (ic && !document.getElementById('disc-orig')) {
    ic.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem">
        <div><label class="form-label">Original Price (₹/$)</label><input type="number" id="disc-orig" class="form-input" value="2499"></div>
        <div><label class="form-label">Discount (%)</label><input type="number" id="disc-pct" class="form-input" value="20"></div>
      </div>
      <button id="calc-disc-btn" class="btn btn-primary" style="width:100%">🏷️ Calculate Sale Price</button>
    `;
  }
  function calc() {
    try {
      const orig = parseFloat(document.getElementById('disc-orig')?.value) || 0;
      const pct = parseFloat(document.getElementById('disc-pct')?.value) || 0;
      const discAmt = orig * (pct / 100);
      const salePrice = orig - discAmt;
      let r = '==========================================================\n';
      r += '          DISCOUNT & SALE PRICE CALCULATOR\n';
      r += '==========================================================\n';
      r += 'Original Price:    ' + orig.toFixed(2) + '\n';
      r += 'Discount:          ' + pct + '% (−' + discAmt.toFixed(2) + ')\n';
      r += 'Sale Price:        ' + salePrice.toFixed(2) + '\n';
      r += 'You Save:          ' + discAmt.toFixed(2) + '\n';
      r += '==========================================================';
      if (out) out.value = r;
      if (window.showToast) window.showToast('Sale Price: ' + salePrice.toFixed(2) + ' (Save ' + discAmt.toFixed(2) + ')', 'success');
    } catch (e) { if (out) out.value = 'Error: ' + e.message; }
  }
  const b = document.getElementById('calc-disc-btn') || document.getElementById('generate-btn');
  if (b) b.onclick = calc;
  calc();
});