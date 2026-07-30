document.addEventListener('DOMContentLoaded', () => {
  const initIn = document.getElementById('cagr-initial'), finIn = document.getElementById('cagr-final'), yrsIn = document.getElementById('cagr-years');
  const btn = document.getElementById('generate-btn'), out = document.getElementById('main-output');
  function run() {
    const V0 = parseFloat(initIn.value)||10000, Vn = parseFloat(finIn.value)||25000, n = parseFloat(yrsIn.value)||5;
    const cagr = (Math.pow(Vn / V0, 1 / n) - 1) * 100;
    const totalGrowth = ((Vn - V0) / V0) * 100;
    let res = '--- COMPOUND ANNUAL GROWTH RATE (CAGR) ---nn';
    res += 'Initial Investment: $' + V0.toLocaleString() + 'nFinal Value: $' + Vn.toLocaleString() + 'nDuration: ' + n + ' Yearsnn';
    res += '=== RESULTS ===n';
    res += 'CAGR (Annual Growth Rate): ' + cagr.toFixed(2) + '%nTotal Return: ' + totalGrowth.toFixed(2) + '% ($' + (Vn - V0).toLocaleString() + ')n';
    if (out) out.value = res;
  }
  if (btn) btn.addEventListener('click', run);
  run();
});
