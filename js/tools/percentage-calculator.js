document.addEventListener('DOMContentLoaded', () => {
  const xIn = document.getElementById('perc-x'), yIn = document.getElementById('perc-y');
  const btn = document.getElementById('generate-btn'), out = document.getElementById('main-output');
  function run() {
    const x = parseFloat(xIn.value)||15, y = parseFloat(yIn.value)||250;
    const resVal = (x / 100) * y;
    const isValOf = (x / y) * 100;
    let res = '--- PERCENTAGE CALCULATOR ---nn';
    res += x + '% of ' + y + ' = ' + resVal.toFixed(2) + 'n';
    res += x + ' is ' + isValOf.toFixed(2) + '% of ' + y + 'n';
    if (out) out.value = res;
  }
  if (btn) btn.addEventListener('click', run);
  run();
});
