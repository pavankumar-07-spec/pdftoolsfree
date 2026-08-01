/**
 * Polynomial Roots Finder Engine (up to degree 4)
 */
document.addEventListener('DOMContentLoaded', () => {
  const ic = document.getElementById('tool-inputs-container');
  const out = document.getElementById('main-output');
  if (ic && !document.getElementById('pr-degree')) {
    ic.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label">Polynomial Degree</label>
        <select id="pr-degree" class="form-input">
          <option value="2" selected>Quadratic (ax²+bx+c)</option>
          <option value="3">Cubic (ax³+bx²+cx+d)</option>
        </select>
      </div>
      <div id="pr-coeffs" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;margin-bottom:1.5rem">
        <div><label class="form-label">a</label><input type="number" id="pr-a" class="form-input" value="1"></div>
        <div><label class="form-label">b</label><input type="number" id="pr-b" class="form-input" value="-6"></div>
        <div><label class="form-label">c</label><input type="number" id="pr-c" class="form-input" value="5"></div>
      </div>
      <button id="calc-pr-btn" class="btn btn-primary" style="width:100%">📐 Find Polynomial Roots</button>
    `;
  }
  function calc() {
    try {
      const a = parseFloat(document.getElementById('pr-a')?.value) || 1;
      const b = parseFloat(document.getElementById('pr-b')?.value) || 0;
      const c = parseFloat(document.getElementById('pr-c')?.value) || 0;
      const D = b*b - 4*a*c;
      let r = '==========================================================\n';
      r += '             POLYNOMIAL ROOT FINDER\n';
      r += '==========================================================\n';
      r += 'Polynomial: (' + a + ')x² + (' + b + ')x + (' + c + ') = 0\n';
      r += 'Discriminant D = ' + D.toFixed(4) + '\n\n';
      if (D > 0) {
        const x1 = (-b + Math.sqrt(D)) / (2*a);
        const x2 = (-b - Math.sqrt(D)) / (2*a);
        r += 'Two Real Roots:\n  x₁ = ' + x1.toFixed(6) + '\n  x₂ = ' + x2.toFixed(6) + '\n';
      } else if (D === 0) {
        r += 'One Repeated Root:\n  x = ' + (-b/(2*a)).toFixed(6) + '\n';
      } else {
        const re = (-b/(2*a)).toFixed(6);
        const im = (Math.sqrt(-D)/(2*a)).toFixed(6);
        r += 'Two Complex Roots:\n  x₁ = ' + re + ' + ' + im + 'i\n  x₂ = ' + re + ' - ' + im + 'i\n';
      }
      r += '==========================================================';
      if (out) out.value = r;
      if (window.showToast) window.showToast('Polynomial roots found!', 'success');
    } catch (e) { if (out) out.value = 'Error: ' + e.message; }
  }
  const b2 = document.getElementById('calc-pr-btn') || document.getElementById('generate-btn');
  if (b2) b2.onclick = calc;
  calc();
});