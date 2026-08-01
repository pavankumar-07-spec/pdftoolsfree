/**
 * Upgraded Real Fraction Arithmetic Calculator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('f1-num')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-bottom:1.5rem">
        <div>
          <h4 style="margin:0 0 0.5rem;font-size:0.9rem">Fraction 1 (a/b)</h4>
          <div style="display:flex;gap:0.5rem;align-items:center">
            <input type="number" id="f1-num" class="form-input" value="3" placeholder="Numerator (a)" style="text-align:center">
            <span style="font-size:1.5rem;font-weight:700">/</span>
            <input type="number" id="f1-den" class="form-input" value="4" placeholder="Denominator (b)" min="1" style="text-align:center">
          </div>
        </div>
        <div>
          <h4 style="margin:0 0 0.5rem;font-size:0.9rem">Fraction 2 (c/d)</h4>
          <div style="display:flex;gap:0.5rem;align-items:center">
            <input type="number" id="f2-num" class="form-input" value="2" placeholder="Numerator (c)" style="text-align:center">
            <span style="font-size:1.5rem;font-weight:700">/</span>
            <input type="number" id="f2-den" class="form-input" value="5" placeholder="Denominator (d)" min="1" style="text-align:center">
          </div>
        </div>
      </div>
      <div style="margin-bottom:1.5rem">
        <label class="form-label">Arithmetic Operation</label>
        <select id="frac-op-select" class="form-input">
          <option value="all" selected>All Operations (+, -, ×, ÷)</option>
          <option value="add">Addition (+)</option>
          <option value="sub">Subtraction (-)</option>
          <option value="mult">Multiplication (×)</option>
          <option value="div">Division (÷)</option>
        </select>
      </div>
      <div class="flex gap-3 mt-4">
        <button id="calc-frac-btn" type="button" class="btn btn-primary flex-1">🔢 Calculate Fraction Arithmetic</button>
      </div>
    `;
  }

  function gcd(a, b) { return b === 0 ? Math.abs(a) : gcd(b, a % b); }
  function simplify(num, den) {
    if (den === 0) return { num: 0, den: 0 };
    const g = gcd(num, den);
    let n = num / g;
    let d = den / g;
    if (d < 0) { n = -n; d = -d; }
    return { num: n, den: d };
  }

  function calculate() {
    const a = parseInt(document.getElementById('f1-num')?.value || 3, 10);
    const b = parseInt(document.getElementById('f1-den')?.value || 4, 10) || 1;
    const c = parseInt(document.getElementById('f2-num')?.value || 2, 10);
    const d = parseInt(document.getElementById('f2-den')?.value || 5, 10) || 1;
    const op = document.getElementById('frac-op-select')?.value || 'all';

    const addNum = a * d + c * b, addDen = b * d;
    const addSimp = simplify(addNum, addDen);

    const subNum = a * d - c * b, subDen = b * d;
    const subSimp = simplify(subNum, subDen);

    const multNum = a * c, multDen = b * d;
    const multSimp = simplify(multNum, multDen);

    const divNum = a * d, divDen = b * c;
    const divSimp = simplify(divNum, divDen);

    let report = `==========================================================
             FRACTION ARITHMETIC CALCULATOR
==========================================================
Fraction 1:   ${a}/${b}  (Decimal: ${(a/b).toFixed(4)})
Fraction 2:   ${c}/${d}  (Decimal: ${(c/d).toFixed(4)})

RESULTS & SIMPLIFICATIONS:\n`;

    if (op === 'all' || op === 'add') {
      report += `• ADDITION (+):       ${a}/${b} + ${c}/${d} = ${addNum}/${addDen} = ${addSimp.num}/${addSimp.den} (${(addSimp.num/addSimp.den).toFixed(4)})\n`;
    }
    if (op === 'all' || op === 'sub') {
      report += `• SUBTRACTION (-):    ${a}/${b} - ${c}/${d} = ${subNum}/${subDen} = ${subSimp.num}/${subSimp.den} (${(subSimp.num/subSimp.den).toFixed(4)})\n`;
    }
    if (op === 'all' || op === 'mult') {
      report += `• MULTIPLICATION (×): ${a}/${b} × ${c}/${d} = ${multNum}/${multDen} = ${multSimp.num}/${multSimp.den} (${(multSimp.num/multSimp.den).toFixed(4)})\n`;
    }
    if (op === 'all' || op === 'div') {
      report += `• DIVISION (÷):       ${a}/${b} ÷ ${c}/${d} = ${divNum}/${divDen} = ${divSimp.num}/${divSimp.den} (${(divSimp.num/divSimp.den).toFixed(4)})\n`;
    }

    report += `==========================================================`;

    if (out) out.value = report;
    if (window.showToast) window.showToast('Fraction arithmetic calculated!', 'success');
  }

  const select = document.getElementById('frac-op-select');
  if (select) select.onchange = calculate;

  const activeBtn = document.getElementById('calc-frac-btn') || btn;
  if (activeBtn) activeBtn.onclick = () => calculate();

  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
