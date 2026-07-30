document.addEventListener('DOMContentLoaded', () => {
  const mIn = document.getElementById('sip-monthly'), rIn = document.getElementById('sip-rate'), yIn = document.getElementById('sip-years');
  const btn = document.getElementById('generate-btn'), out = document.getElementById('main-output');
  function run() {
    const P = parseFloat(mIn.value)||5000, rAnnual = parseFloat(rIn.value)||12, yrs = parseFloat(yIn.value)||10;
    const n = yrs * 12;
    const i = (rAnnual / 12) / 100;
    const M = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const totalInvested = P * n;
    const totalEstReturns = M - totalInvested;
    let res = '--- SYSTEMATIC INVESTMENT PLAN (SIP) CALCULATOR ---nn';
    res += 'Monthly Investment: $' + P.toLocaleString() + 'nExpected Rate of Return: ' + rAnnual + '% p.a.nTime Horizon: ' + yrs + ' Years (' + n + ' months)nn';
    res += '=== WEALTH SUMMARY ===n';
    res += 'Invested Amount: $' + totalInvested.toLocaleString() + 'nEstimated Returns: $' + Math.round(totalEstReturns).toLocaleString() + 'nTotal Wealth Value: $' + Math.round(M).toLocaleString() + 'n';
    if (out) out.value = res;
  }
  if (btn) btn.addEventListener('click', run);
  run();
});
