document.addEventListener('DOMContentLoaded', () => {
  const iIn = document.getElementById('roi-initial'), fIn = document.getElementById('roi-final');
  const btn = document.getElementById('generate-btn'), out = document.getElementById('main-output');
  function run() {
    const V0 = parseFloat(iIn.value)||5000, Vn = parseFloat(fIn.value)||8500;
    const profit = Vn - V0;
    const roi = (profit / V0) * 100;
    let res = '--- RETURN ON INVESTMENT (ROI) CALCULATOR ---nn';
    res += 'Initial Cost: $' + V0.toLocaleString() + 'nFinal Value: $' + Vn.toLocaleString() + 'nn';
    res += 'Net Profit / Gain: $' + profit.toLocaleString() + 'nReturn on Investment (ROI): ' + roi.toFixed(2) + '%n';
    if (out) out.value = res;
  }
  if (btn) btn.addEventListener('click', run);
  run();
});
