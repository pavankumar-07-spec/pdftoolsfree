/**
 * Percentage Off / Discount Calculator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('po-price')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Original Price ($/₹):</label>
          <input type="number" id="po-price" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="2499">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Discount (% Off):</label>
          <input type="number" id="po-discount" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="25">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-po-btn" class="btn btn-primary flex-1">🏷️ Calculate Discounted Sale Price</button>
      </div>
    `;
  }

  function calculate() {
    const price = parseFloat(document.getElementById('po-price')?.value || 0);
    const pct = parseFloat(document.getElementById('po-discount')?.value || 0);

    if (isNaN(price) || isNaN(pct) || price <= 0 || pct < 0) {
      if (out) out.value = 'ERROR: Enter valid positive numbers.';
      return;
    }

    const saved = (price * (pct / 100));
    const finalPrice = price - saved;

    let res = '--- DISCOUNT & SALE PRICE REPORT ---nn';
    res += `Original Price: ₹${price.toFixed(2)}n`;
    res += `Discount Rate:  ${pct.toFixed(2)}% OFFnn`;
    res += `Amount Saved:   ₹${saved.toFixed(2)}n`;
    res += `Final Price:    ₹${finalPrice.toFixed(2)}n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Final Price: ₹${finalPrice.toFixed(2)}`, 'success');
  }

  const activeBtn = document.getElementById('calc-po-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
