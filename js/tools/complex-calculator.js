/**
 * Complex Number Calculator Engine (a+bi arithmetic)
 */
document.addEventListener('DOMContentLoaded', () => {
  const ic = document.getElementById('tool-inputs-container');
  const out = document.getElementById('main-output');
  if (ic && !document.getElementById('cplx-a-re')) {
    ic.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-bottom:1.5rem">
        <div>
          <h4 style="margin:0 0 0.5rem;font-size:0.9rem">Complex Number Z₁</h4>
          <div style="display:flex;gap:0.5rem;align-items:center">
            <input type="number" id="cplx-a-re" class="form-input" value="3" style="text-align:center">
            <span style="font-weight:700">+</span>
            <input type="number" id="cplx-a-im" class="form-input" value="4" style="text-align:center">
            <span style="font-weight:700;font-style:italic">i</span>
          </div>
        </div>
        <div>
          <h4 style="margin:0 0 0.5rem;font-size:0.9rem">Complex Number Z₂</h4>
          <div style="display:flex;gap:0.5rem;align-items:center">
            <input type="number" id="cplx-b-re" class="form-input" value="1" style="text-align:center">
            <span style="font-weight:700">+</span>
            <input type="number" id="cplx-b-im" class="form-input" value="-2" style="text-align:center">
            <span style="font-weight:700;font-style:italic">i</span>
          </div>
        </div>
      </div>
      <button id="calc-cplx-btn" class="btn btn-primary" style="width:100%">📐 Compute Complex Arithmetic</button>
    `;
  }
  function fmt(re, im) { return re.toFixed(4) + (im >= 0 ? ' + ' : ' - ') + Math.abs(im).toFixed(4) + 'i'; }
  function calc() {
    try {
      const a = parseFloat(document.getElementById('cplx-a-re')?.value)||0;
      const b = parseFloat(document.getElementById('cplx-a-im')?.value)||0;
      const c = parseFloat(document.getElementById('cplx-b-re')?.value)||0;
      const d = parseFloat(document.getElementById('cplx-b-im')?.value)||0;
      const addRe = a+c, addIm = b+d;
      const subRe = a-c, subIm = b-d;
      const mulRe = a*c - b*d, mulIm = a*d + b*c;
      const denom = c*c + d*d;
      const divRe = denom ? (a*c+b*d)/denom : NaN;
      const divIm = denom ? (b*c-a*d)/denom : NaN;
      const mag1 = Math.sqrt(a*a+b*b), mag2 = Math.sqrt(c*c+d*d);
      const arg1 = Math.atan2(b,a)*180/Math.PI, arg2 = Math.atan2(d,c)*180/Math.PI;
      let r = '==========================================================\n';
      r += '          COMPLEX NUMBER CALCULATOR (a+bi)\n';
      r += '==========================================================\n';
      r += 'Z₁ = ' + fmt(a,b) + '   |Z₁| = ' + mag1.toFixed(4) + '  arg = ' + arg1.toFixed(2) + '°\n';
      r += 'Z₂ = ' + fmt(c,d) + '   |Z₂| = ' + mag2.toFixed(4) + '  arg = ' + arg2.toFixed(2) + '°\n\n';
      r += 'OPERATIONS:\n';
      r += '  Z₁ + Z₂ = ' + fmt(addRe, addIm) + '\n';
      r += '  Z₁ - Z₂ = ' + fmt(subRe, subIm) + '\n';
      r += '  Z₁ × Z₂ = ' + fmt(mulRe, mulIm) + '\n';
      r += '  Z₁ / Z₂ = ' + (isNaN(divRe) ? 'undefined (÷0)' : fmt(divRe, divIm)) + '\n';
      r += '  Z₁* (conjugate) = ' + fmt(a, -b) + '\n';
      r += '==========================================================';
      if (out) out.value = r;
      if (window.showToast) window.showToast('Complex arithmetic computed!', 'success');
    } catch (e) { if (out) out.value = 'Error: ' + e.message; }
  }
  const btn = document.getElementById('calc-cplx-btn') || document.getElementById('generate-btn');
  if (btn) btn.onclick = calc;
  calc();
});