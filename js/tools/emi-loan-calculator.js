document.addEventListener('DOMContentLoaded', () => {
  const pIn = document.getElementById('emi-principal'), rIn = document.getElementById('emi-rate'), tIn = document.getElementById('emi-tenure');
  const btn = document.getElementById('generate-btn'), out = document.getElementById('main-output');
  function run() {
    const P = parseFloat(pIn.value)||500000, rAnnual = parseFloat(rIn.value)||8.5, n = parseFloat(tIn.value)||60;
    const r = (rAnnual / 12) / 100;
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;
    let res = '--- EMI LOAN CALCULATOR ---nn';
    res += 'Loan Principal: $' + P.toLocaleString() + 'nInterest Rate: ' + rAnnual + '% p.a.nTenure: ' + n + ' Monthsnn';
    res += '=== BREAKDOWN ===n';
    res += 'Monthly EMI: $' + emi.toFixed(2) + 'nTotal Interest Payable: $' + totalInterest.toFixed(2) + 'nTotal Amount Payable: $' + totalPayment.toFixed(2) + 'n';
    if (out) out.value = res;
  }
  if (btn) btn.addEventListener('click', run);
  run();
});
