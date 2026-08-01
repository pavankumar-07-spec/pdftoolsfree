/**
 * Income Tax Calculator Engine (India New Regime FY 2025-26)
 */
document.addEventListener('DOMContentLoaded', () => {
  const ic = document.getElementById('tool-inputs-container');
  const out = document.getElementById('main-output');
  if (ic && !document.getElementById('tax-income')) {
    ic.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem">
        <div><label class="form-label">Annual Income (₹)</label><input type="number" id="tax-income" class="form-input" value="1200000"></div>
        <div><label class="form-label">Tax Regime</label>
          <select id="tax-regime" class="form-input">
            <option value="new" selected>New Regime (FY 2025-26)</option>
            <option value="old">Old Regime</option>
          </select>
        </div>
      </div>
      <button id="calc-tax-btn" class="btn btn-primary" style="width:100%">🏛️ Calculate Income Tax</button>
    `;
  }
  function calc() {
    try {
      const income = parseFloat(document.getElementById('tax-income')?.value) || 0;
      const regime = document.getElementById('tax-regime')?.value || 'new';
      let tax = 0;
      let slabs = [];
      if (regime === 'new') {
        const brackets = [[300000,0],[300000,0.05],[300000,0.1],[300000,0.15],[300000,0.2],[Infinity,0.3]];
        let rem = income;
        brackets.forEach(([limit, rate]) => {
          const taxable = Math.min(rem, limit);
          const t = taxable * rate;
          if (taxable > 0) slabs.push({ range: taxable, rate: (rate*100)+'%', tax: t });
          tax += t;
          rem -= taxable;
        });
      } else {
        const brackets = [[250000,0],[250000,0.05],[500000,0.2],[Infinity,0.3]];
        let rem = income;
        brackets.forEach(([limit, rate]) => {
          const taxable = Math.min(rem, limit);
          const t = taxable * rate;
          if (taxable > 0) slabs.push({ range: taxable, rate: (rate*100)+'%', tax: t });
          tax += t;
          rem -= taxable;
        });
      }
      const cess = tax * 0.04;
      const totalTax = tax + cess;
      const effectiveRate = income > 0 ? (totalTax / income * 100) : 0;
      let r = '==========================================================\n';
      r += '             INCOME TAX CALCULATOR (India)\n';
      r += '==========================================================\n';
      r += 'Annual Income:     ₹' + income.toLocaleString('en-IN') + '\n';
      r += 'Tax Regime:        ' + (regime === 'new' ? 'New (FY 2025-26)' : 'Old') + '\n\n';
      r += 'SLAB-WISE BREAKDOWN:\n';
      slabs.forEach(s => { r += '  ₹' + s.range.toLocaleString('en-IN').padEnd(12) + ' @ ' + s.rate.padEnd(5) + ' = ₹' + s.tax.toFixed(2) + '\n'; });
      r += '\nBase Tax:          ₹' + tax.toFixed(2) + '\n';
      r += 'Health & Edu Cess: ₹' + cess.toFixed(2) + ' (4%)\n';
      r += 'Total Tax:         ₹' + totalTax.toFixed(2) + '\n';
      r += 'Effective Rate:    ' + effectiveRate.toFixed(2) + '%\n';
      r += 'Take Home:         ₹' + (income - totalTax).toFixed(2) + '\n';
      r += '==========================================================';
      if (out) out.value = r;
      if (window.showToast) window.showToast('Tax: ₹' + totalTax.toFixed(0) + ' | Effective: ' + effectiveRate.toFixed(1) + '%', 'success');
    } catch (e) { if (out) out.value = 'Error: ' + e.message; }
  }
  const b = document.getElementById('calc-tax-btn') || document.getElementById('generate-btn');
  if (b) b.onclick = calc;
  const sel = document.getElementById('tax-regime');
  if (sel) sel.onchange = calc;
  calc();
});