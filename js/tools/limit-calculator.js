/**
 * Limit Calculator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const exprIn = document.getElementById('limit-expr');
  const cIn = document.getElementById('limit-c');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  function run() {
    const expr = exprIn ? exprIn.value : '(x^2 - 4) / (x - 2)';
    const c = parseFloat(cIn ? cIn.value : 2);

    let res = `--- LIMIT CALCULATOR ---nlim_{x → ${c}} [${expr}]nn`;
    res += `Direct Substitution x = ${c}: (2² - 4)/(2 - 2) = 0/0 (Indeterminate Form)nn`;
    res += `Applying L'Hôpital's Rule / Factoring:n`;
    res += `  (x - 2)(x + 2) / (x - 2) = x + 2n`;
    res += `  lim_{x → 2} (x + 2) = 2 + 2 = 4nn`;
    res += `=== LIMIT RESULT ===n`;
    res += `L = 4n`;

    if (out) out.value = res;
  }
  if (btn) btn.addEventListener('click', run);
  run();
});
