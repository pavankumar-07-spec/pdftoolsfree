/**
 * Quadratic Solver Engine - B.Tech Level Math
 */
document.addEventListener('DOMContentLoaded', () => {
  const aIn = document.getElementById('calc-a');
  const bIn = document.getElementById('calc-b');
  const cIn = document.getElementById('calc-c');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  function solve() {
    const a = parseFloat(aIn ? aIn.value : 1) || 0;
    const b = parseFloat(bIn ? bIn.value : 0) || 0;
    const c = parseFloat(cIn ? cIn.value : 0) || 0;

    if (a === 0) {
      if (out) out.value = 'ERROR: Coefficient "a" cannot be 0 for a quadratic equation.';
      return;
    }

    const D = b*b - 4*a*c;
    let res = `--- QUADRATIC EQUATION SOLVER ---n`;
    res += `Equation: (${a})x² + (${b})x + (${c}) = 0nn`;
    res += `Discriminant D = b² - 4ac = (${b})² - 4(${a})(${c}) = ${D.toFixed(4)}nn`;

    if (D > 0) {
      const x1 = (-b + Math.sqrt(D)) / (2*a);
      const x2 = (-b - Math.sqrt(D)) / (2*a);
      res += `D > 0: Two Distinct Real Rootsn`;
      res += `x₁ = (-b + √D) / 2a = ${x1.toFixed(4)}n`;
      res += `x₂ = (-b - √D) / 2a = ${x2.toFixed(4)}n`;
    } else if (D === 0) {
      const x = -b / (2*a);
      res += `D = 0: One Repeated Real Rootn`;
      res += `x = -b / 2a = ${x.toFixed(4)}n`;
    } else {
      const real = (-b / (2*a)).toFixed(4);
      const imag = (Math.sqrt(-D) / (2*a)).toFixed(4);
      res += `D < 0: Two Complex Conjugate Rootsn`;
      res += `x₁ = ${real} + ${imag}in`;
      res += `x₂ = ${real} - ${imag}in`;
    }

    if (out) out.value = res;
  }

  if (btn) btn.addEventListener('click', solve);
  solve();
});
