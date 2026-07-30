/**
 * Complex Number Calculator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const z1re = document.getElementById('z1-re');
  const z1im = document.getElementById('z1-im');
  const z2re = document.getElementById('z2-re');
  const z2im = document.getElementById('z2-im');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  function calculate() {
    const a = parseFloat(z1re.value)||0, b = parseFloat(z1im.value)||0;
    const c = parseFloat(z2re.value)||0, d = parseFloat(z2im.value)||0;

    let res = `--- COMPLEX NUMBER CALCULATOR ---n`;
    res += `z₁ = ${a} + ${b}in`;
    res += `z₂ = ${c} + ${d}inn`;

    const add = `${a+c} + ${b+d}i`;
    const sub = `${a-c} + ${b-d}i`;
    const multRe = a*c - b*d;
    const multIm = a*d + b*c;
    const mult = `${multRe} + ${multIm}i`;

    const d2 = c*c + d*d;
    const divRe = (a*c + b*d) / d2;
    const divIm = (b*c - a*d) / d2;
    const div = d2 > 0 ? `${divRe.toFixed(4)} + ${divIm.toFixed(4)}i` : 'Undefined (div by zero)';

    const r1 = Math.hypot(a, b);
    const th1 = Math.atan2(b, a) * (180/Math.PI);

    res += `ADDITION (z₁ + z₂)       = ${add}n`;
    res += `SUBTRACTION (z₁ - z₂)    = ${sub}n`;
    res += `MULTIPLICATION (z₁ × z₂) = ${mult}n`;
    res += `DIVISION (z₁ / z₂)       = ${div}nn`;
    res += `=== POLAR FORM OF z₁ ===n`;
    res += `Modulus |z₁| = r = ${r1.toFixed(4)}n`;
    res += `Argument Arg(z₁) = θ = ${th1.toFixed(2)}° (${(th1*Math.PI/180).toFixed(4)} rad)n`;
    res += `Polar Notation: ${r1.toFixed(4)} e^(i ${th1.toFixed(1)}°)n`;

    if (out) out.value = res;
  }

  if (btn) btn.addEventListener('click', calculate);
  calculate();
});
