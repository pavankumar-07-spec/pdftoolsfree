/**
 * Polynomial Roots Engine - B.Tech Level Math
 */
document.addEventListener('DOMContentLoaded', () => {
  const coeffsIn = document.getElementById('poly-coeffs');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  function solve() {
    const raw = coeffsIn ? coeffsIn.value : '1, -6, 11, -6';
    const coeffs = raw.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));

    if (coeffs.length < 2) {
      if (out) out.value = 'ERROR: Please enter at least 2 valid numeric coefficients.';
      return;
    }

    let res = `--- POLYNOMIAL ROOTS FINDER ---nCoefficients: [${coeffs.join(', ')}]n`;
    const degree = coeffs.length - 1;
    res += `Degree n = ${degree}nn`;

    if (degree === 1) {
      const root = -coeffs[1] / coeffs[0];
      res += `Linear Root x = ${root.toFixed(4)}n`;
    } else if (degree === 2) {
      const a = coeffs[0], b = coeffs[1], c = coeffs[2];
      const D = b*b - 4*a*c;
      if (D >= 0) {
        res += `x₁ = ${((-b + Math.sqrt(D))/(2*a)).toFixed(4)}nx₂ = ${((-b - Math.sqrt(D))/(2*a)).toFixed(4)}n`;
      } else {
        const r = (-b/(2*a)).toFixed(4);
        const i = (Math.sqrt(-D)/(2*a)).toFixed(4);
        res += `x₁ = ${r} + ${i}inx₂ = ${r} - ${i}in`;
      }
    } else {
      res += `Numerical Root Finder (Durand-Kerner Iterative Method):nn`;
      // Durand-Kerner method for arbitrary degree
      const n = degree;
      const a0 = coeffs[0];
      const poly = coeffs.map(c => c / a0); // normalize

      // Init complex roots on unit circle
      let roots = Array.from({ length: n }, (_, k) => {
        const angle = (2 * Math.PI * k) / n + 0.1;
        return { re: Math.cos(angle) * 1.5, im: Math.sin(angle) * 1.5 };
      });

      function evalPoly(z) {
        let val = { re: poly[0], im: 0 };
        for (let i = 1; i <= n; i++) {
          // val * z + poly[i]
          const re = val.re * z.re - val.im * z.im + poly[i];
          const im = val.re * z.im + val.im * z.re;
          val = { re, im };
        }
        return val;
      }

      for (let iter = 0; iter < 100; iter++) {
        for (let i = 0; i < n; i++) {
          const pVal = evalPoly(roots[i]);
          let denom = { re: 1, im: 0 };
          for (let j = 0; j < n; j++) {
            if (i !== j) {
              const dx = roots[i].re - roots[j].re;
              const dy = roots[i].im - roots[j].im;
              const re = denom.re * dx - denom.im * dy;
              const im = denom.re * dy + denom.im * dx;
              denom = { re, im };
            }
          }
          const dMag2 = denom.re*denom.re + denom.im*denom.im || 1e-12;
          const deltaRe = (pVal.re * denom.re + pVal.im * denom.im) / dMag2;
          const deltaIm = (pVal.im * denom.re - pVal.re * denom.im) / dMag2;
          roots[i].re -= deltaRe;
          roots[i].im -= deltaIm;
        }
      }

      roots.forEach((r, idx) => {
        if (Math.abs(r.im) < 1e-4) {
          res += `Root ${idx+1}: x = ${r.re.toFixed(4)}n`;
        } else {
          res += `Root ${idx+1}: x = ${r.re.toFixed(4)} ${r.im >= 0 ? '+' : '-'} ${Math.abs(r.im).toFixed(4)}in`;
        }
      });
    }

    if (out) out.value = res;
  }

  if (btn) btn.addEventListener('click', solve);
  solve();
});
