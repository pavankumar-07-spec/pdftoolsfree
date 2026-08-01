/**
 * Commission Calculator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('comm-sale')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Total Sale Price ($/₹):</label>
          <input type="number" id="comm-sale" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="50000">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Commission Rate (%):</label>
          <input type="number" id="comm-rate" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="5">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-comm-btn" class="btn btn-primary flex-1">💼 Calculate Sales Commission</button>
      </div>
    `;
  }

  function calculate() {
    const sale = parseFloat(document.getElementById('comm-sale')?.value || 0);
    const rate = parseFloat(document.getElementById('comm-rate')?.value || 0);

    if (isNaN(sale) || isNaN(rate) || sale <= 0 || rate < 0) {
      if (out) out.value = 'ERROR: Enter valid sale price and commission rate.';
      return;
    }

    const comm = sale * (rate / 100);
    const net = sale - comm;

    let res = '--- COMMISSION CALCULATOR --- nn';
    res += `Total Sale Price:   ₹${sale.toLocaleString()}n`;
    res += `Commission Rate:    ${rate}%nn`;
    res += `Commission Earned:  ₹${comm.toLocaleString('en-IN', { maximumFractionDigits: 2 })}n`;
    res += `Net Remaining:      ₹${net.toLocaleString('en-IN', { maximumFractionDigits: 2 })}n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Commission: ₹${comm.toLocaleString()}`, 'success');
  }

  const activeBtn = document.getElementById('calc-comm-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
