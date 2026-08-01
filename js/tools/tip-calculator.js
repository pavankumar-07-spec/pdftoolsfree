/**
 * Tip Calculator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const ic = document.getElementById('tool-inputs-container');
  const out = document.getElementById('main-output');
  if (ic && !document.getElementById('tip-bill')) {
    ic.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;margin-bottom:1.5rem">
        <div><label class="form-label">Bill Amount (₹/$)</label><input type="number" id="tip-bill" class="form-input" value="1200"></div>
        <div><label class="form-label">Tip Percentage (%)</label><input type="number" id="tip-pct" class="form-input" value="15"></div>
        <div><label class="form-label">Split Between</label><input type="number" id="tip-split" class="form-input" value="2" min="1"></div>
      </div>
      <button id="calc-tip-btn" class="btn btn-primary" style="width:100%">💰 Calculate Tip</button>
    `;
  }
  function calc() {
    try {
      const bill = parseFloat(document.getElementById('tip-bill')?.value) || 0;
      const pct = parseFloat(document.getElementById('tip-pct')?.value) || 0;
      const split = parseInt(document.getElementById('tip-split')?.value) || 1;
      const tipAmt = bill * (pct / 100);
      const total = bill + tipAmt;
      const perPerson = total / split;
      let r = '==========================================================\n';
      r += '             TIP CALCULATOR\n';
      r += '==========================================================\n';
      r += 'Bill Amount:       ' + bill.toFixed(2) + '\n';
      r += 'Tip Percentage:    ' + pct + '%\n';
      r += 'Tip Amount:        ' + tipAmt.toFixed(2) + '\n';
      r += 'Total (Bill+Tip):  ' + total.toFixed(2) + '\n';
      r += 'Split ' + split + ' ways:     ' + perPerson.toFixed(2) + ' each\n';
      r += '==========================================================';
      if (out) out.value = r;
      if (window.showToast) window.showToast('Tip: ' + tipAmt.toFixed(2) + ' | Per person: ' + perPerson.toFixed(2), 'success');
    } catch (e) { if (out) out.value = 'Error: ' + e.message; }
  }
  const b = document.getElementById('calc-tip-btn') || document.getElementById('generate-btn');
  if (b) b.onclick = calc;
  calc();
});