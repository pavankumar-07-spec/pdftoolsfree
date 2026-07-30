/**
 * Fraction Calculator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const n1 = document.getElementById('f1-num'), d1 = document.getElementById('f1-den');
  const n2 = document.getElementById('f2-num'), d2 = document.getElementById('f2-den');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  function gcd(a, b) { return b === 0 ? Math.abs(a) : gcd(b, a % b); }

  function simplify(num, den) {
    const g = gcd(num, den);
    return { num: num / g, den: den / g };
  }

  function calculate() {
    const a = parseInt(n1.value)||0, b = parseInt(d1.value)||1;
    const c = parseInt(n2.value)||0, d = parseInt(d2.value)||1;

    let res = '--- FRACTION ARITHMETIC CALCULATOR ---n';
    res += 'Fraction 1: ' + a + '/' + b + 'n';
    res += 'Fraction 2: ' + c + '/' + d + 'nn';

    // Add
    const addNum = a*d + c*b, addDen = b*d;
    const addSimp = simplify(addNum, addDen);

    // Sub
    const subNum = a*d - c*b, subDen = b*d;
    const subSimp = simplify(subNum, subDen);

    // Mult
    const multNum = a*c, multDen = b*d;
    const multSimp = simplify(multNum, multDen);

    // Div
    const divNum = a*d, divDen = b*c;
    const divSimp = simplify(divNum, divDen);

    res += 'ADDITION:       ' + a + '/' + b + ' + ' + c + '/' + d + ' = ' + addNum + '/' + addDen + ' = ' + addSimp.num + '/' + addSimp.den + ' (' + (addSimp.num/addSimp.den).toFixed(4) + ')n';
    res += 'SUBTRACTION:    ' + a + '/' + b + ' - ' + c + '/' + d + ' = ' + subNum + '/' + subDen + ' = ' + subSimp.num + '/' + subSimp.den + ' (' + (subSimp.num/subSimp.den).toFixed(4) + ')n';
    res += 'MULTIPLICATION: ' + a + '/' + b + ' × ' + c + '/' + d + ' = ' + multNum + '/' + multDen + ' = ' + multSimp.num + '/' + multSimp.den + ' (' + (multSimp.num/multSimp.den).toFixed(4) + ')n';
    res += 'DIVISION:       ' + a + '/' + b + ' ÷ ' + c + '/' + d + ' = ' + divNum + '/' + divDen + ' = ' + divSimp.num + '/' + divSimp.den + ' (' + (divSimp.num/divSimp.den).toFixed(4) + ')n';

    if (out) out.value = res;
  }

  if (btn) btn.addEventListener('click', calculate);
  calculate();
});
