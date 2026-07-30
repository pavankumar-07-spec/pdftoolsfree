/**
 * Trigonometry Calculator Engine - B.Tech Level Math
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('trig-angle')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:2fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Angle Value θ:</label>
          <input type="number" id="trig-angle" class="form-input" value="45" step="any" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Unit:</label>
          <select id="trig-unit" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
            <option value="deg">Degrees (°)</option>
            <option value="rad">Radians (rad)</option>
          </select>
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-trig-btn" class="btn btn-primary flex-1">📐 Compute Trigonometric Values</button>
      </div>
    `;
  }

  function calculate() {
    const val = parseFloat(document.getElementById('trig-angle') ? document.getElementById('trig-angle').value : 45);
    const unit = document.getElementById('trig-unit') ? document.getElementById('trig-unit').value : 'deg';

    if (isNaN(val)) {
      if (out) out.value = 'ERROR: Please enter a valid numerical angle.';
      return;
    }

    const rad = unit === 'deg' ? (val * Math.PI) / 180 : val;
    const deg = unit === 'rad' ? (val * 180) / Math.PI : val;

    const sinVal = Math.sin(rad);
    const cosVal = Math.cos(rad);
    const tanVal = Math.tan(rad);

    const cscVal = Math.abs(sinVal) < 1e-12 ? 'Undefined (∞)' : (1 / sinVal).toFixed(6);
    const secVal = Math.abs(cosVal) < 1e-12 ? 'Undefined (∞)' : (1 / cosVal).toFixed(6);
    const cotVal = Math.abs(tanVal) < 1e-12 ? 'Undefined (∞)' : Math.abs(sinVal) < 1e-12 ? 'Undefined' : (1 / tanVal).toFixed(6);

    const sinhVal = Math.sinh(rad);
    const coshVal = Math.cosh(rad);
    const tanhVal = Math.tanh(rad);

    let res = `--- TRIGONOMETRY CALCULATOR RESULTS ---nn`;
    res += `Angle θ: ${deg.toFixed(4)}° (${rad.toFixed(6)} rad)nn`;

    res += `=== PRIMARY TRIGONOMETRIC FUNCTIONS ===n`;
    res += `sin(θ) = ${sinVal.toFixed(6)}n`;
    res += `cos(θ) = ${cosVal.toFixed(6)}n`;
    res += `tan(θ) = ${Math.abs(cosVal) < 1e-12 ? 'Undefined (∞)' : tanVal.toFixed(6)}nn`;

    res += `=== RECIPROCAL TRIGONOMETRIC FUNCTIONS ===n`;
    res += `csc(θ) = 1/sin(θ) = ${cscVal}n`;
    res += `sec(θ) = 1/cos(θ) = ${secVal}n`;
    res += `cot(θ) = 1/tan(θ) = ${cotVal}nn`;

    res += `=== HYPERBOLIC FUNCTIONS ===n`;
    res += `sinh(θ) = ${sinhVal.toFixed(6)}n`;
    res += `cosh(θ) = ${coshVal.toFixed(6)}n`;
    res += `tanh(θ) = ${tanhVal.toFixed(6)}nn`;

    res += `=== INVERSE TRIGONOMETRIC (for x = sin(θ) = ${sinVal.toFixed(4)}) ===n`;
    if (Math.abs(sinVal) <= 1) {
      res += `arcsin(${sinVal.toFixed(4)}) = ${((Math.asin(sinVal) * 180) / Math.PI).toFixed(2)}°n`;
      res += `arccos(${sinVal.toFixed(4)}) = ${((Math.acos(sinVal) * 180) / Math.PI).toFixed(2)}°n`;
    }
    res += `arctan(${sinVal.toFixed(4)}) = ${((Math.atan(sinVal) * 180) / Math.PI).toFixed(2)}°n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Trigonometric calculations completed!', 'success');
  }

  const activeBtn = document.getElementById('calc-trig-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
