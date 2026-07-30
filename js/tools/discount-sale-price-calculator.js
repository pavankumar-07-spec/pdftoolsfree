/**
 * Discount Sale Price Calculator Engine - Deep SEO Alignment
 */
document.addEventListener('DOMContentLoaded', () => {
  const amountIn = document.getElementById('calc-amount');
  const rateIn = document.getElementById('calc-rate');
  const modeIn = document.getElementById('calc-mode');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  function compute() {
    const base = parseFloat(amountIn ? amountIn.value : 1000);
    const rate = parseFloat(rateIn ? rateIn.value : 18);
    const mode = modeIn ? modeIn.value : 'add';

    const diff = (base * rate) / 100;
    const finalAmount = mode === 'add' ? (base + diff) : (base - diff);

    const summary = `--- DISCOUNT SALE PRICE CALCULATOR ANALYSIS ---
Initial Base Amount: $${base.toFixed(2)}
Applied Rate: ${rate}% (${mode === 'add' ? 'Addition' : 'Discount'})
Tax / Margin Difference: $${diff.toFixed(2)}

FINAL COMPUTED AMOUNT: $${finalAmount.toFixed(2)}`;

    if (out) out.value = summary;
    if (window.showToast) window.showToast('Calculation completed!', 'success');
  }

  if (btn) btn.addEventListener('click', compute);
  compute();
});