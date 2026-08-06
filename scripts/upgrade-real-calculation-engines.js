const fs = require('fs');
const path = require('path');

const jsDir = path.join(__dirname, '../js/tools');

const engineUpgrades = {
  'bisection-method-calculator.js': `/**
 * Bisection Method Calculator Engine
 * Solves f(x) = 0 over interval [a, b] with step-by-step iteration table
 */
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('generate-btn') || document.getElementById('calc-btn');
  const out = document.getElementById('main-output');
  const dlBtn = document.getElementById('download-btn');

  function evalFunc(fnStr, x) {
    try {
      const clean = fnStr.replace(/x\^(\d+)/g, 'Math.pow(x, $1)')
                         .replace(/x\^(\([^\)]+\))/g, 'Math.pow(x, $1)')
                         .replace(/sin\(/g, 'Math.sin(')
                         .replace(/cos\(/g, 'Math.cos(')
                         .replace(/tan\(/g, 'Math.tan(')
                         .replace(/exp\(/g, 'Math.exp(')
                         .replace(/ln\(/g, 'Math.log(')
                         .replace(/sqrt\(/g, 'Math.sqrt(');
      return new Function('x', 'return ' + clean)(x);
    } catch (e) {
      return NaN;
    }
  }

  function calculate() {
    const fnStr = (document.getElementById('func-input') || document.getElementById('val1') || {}).value || 'x^3 - x - 2';
    const a = parseFloat((document.getElementById('a-input') || document.getElementById('val2') || {}).value) || 1;
    const b = parseFloat((document.getElementById('b-input') || document.getElementById('val3') || {}).value) || 2;
    const tol = parseFloat((document.getElementById('tol-input') || {}).value) || 0.0001;

    let fa = evalFunc(fnStr, a);
    let fb = evalFunc(fnStr, b);

    if (isNaN(fa) || isNaN(fb)) {
      if (out) out.value = 'ERROR: Invalid mathematical function f(x). Use expressions like x^3 - x - 2 or sin(x) - 0.5';
      return;
    }

    if (fa * fb > 0) {
      if (out) out.value = \`ERROR: f(a) and f(b) must have opposite signs for Bisection Method.\\nf(\${a}) = \${fa.toFixed(4)}, f(\${b}) = \${fb.toFixed(4)}\`;
      return;
    }

    let report = \`==========================================================\\n\`;
    report += \`             BISECTION METHOD NUMERICAL SOLVER\\n\`;
    report += \`==========================================================\\n\`;
    report += \`Function f(x) = \${fnStr}\\n\`;
    report += \`Interval [a, b] = [\${a}, \${b}]\\n\`;
    report += \`Tolerance ε = \${tol}\\n\\n\`;
    report += \`Iter |      a      |      b      |      c      |    f(c)     |  Error\\n\`;
    report += \`------------------------------------------------------------------\\n\`;

    let low = a, high = b, c = 0, iter = 0, maxIter = 25;
    let error = Math.abs(high - low);

    while (error > tol && iter < maxIter) {
      iter++;
      c = (low + high) / 2;
      let fc = evalFunc(fnStr, c);
      error = Math.abs(high - low) / 2;

      report += \` \${iter.toString().padStart(2)}  | \${low.toFixed(6).padStart(11)} | \${high.toFixed(6).padStart(11)} | \${c.toFixed(6).padStart(11)} | \${fc.toFixed(6).padStart(11)} | \${error.toFixed(6)}\\n\`;

      if (Math.abs(fc) < 1e-12) break;
      if (evalFunc(fnStr, low) * fc < 0) {
        high = c;
      } else {
        low = c;
      }
    }

    report += \`------------------------------------------------------------------\\n\`;
    report += \`=== FINAL CONVERGED ROOT ===\\n\`;
    report += \`Root x ≈ \${c.toFixed(6)} after \${iter} iterations (f(c) = \${evalFunc(fnStr, c).toExponential(4)})\`;

    if (out) out.value = report;
    if (window.showToast) window.showToast('Bisection iterations calculated!', 'success');
  }

  if (btn) btn.addEventListener('click', calculate);
  calculate();

  if (dlBtn) {
    dlBtn.onclick = () => {
      const txt = out ? out.value : '';
      const blob = new Blob([txt], { type: 'text/plain' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'bisection-method-report.txt'; a.click();
    };
  }
});`,

  'newton-raphson-calculator.js': `/**
 * Newton-Raphson Method Engine
 * Iterative root finder using numerical derivatives
 */
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('generate-btn') || document.getElementById('calc-btn');
  const out = document.getElementById('main-output');

  function evalFunc(fnStr, x) {
    try {
      const clean = fnStr.replace(/x\^(\d+)/g, 'Math.pow(x, $1)')
                         .replace(/sin\(/g, 'Math.sin(')
                         .replace(/cos\(/g, 'Math.cos(')
                         .replace(/exp\(/g, 'Math.exp(')
                         .replace(/ln\(/g, 'Math.log(');
      return new Function('x', 'return ' + clean)(x);
    } catch (e) { return NaN; }
  }

  function derivative(fnStr, x, h = 1e-6) {
    return (evalFunc(fnStr, x + h) - evalFunc(fnStr, x - h)) / (2 * h);
  }

  function calculate() {
    const fnStr = (document.getElementById('func-input') || document.getElementById('val1') || {}).value || 'x^3 - 2x - 5';
    let x0 = parseFloat((document.getElementById('x0-input') || document.getElementById('val2') || {}).value) || 2;
    const tol = parseFloat((document.getElementById('tol-input') || {}).value) || 0.0001;

    let report = \`==========================================================\\n\`;
    report += \`           NEWTON-RAPHSON NUMERICAL SOLVER\\n\`;
    report += \`==========================================================\\n\`;
    report += \`Function f(x) = \${fnStr}\\n\`;
    report += \`Initial Guess x₀ = \${x0}\\n\\n\`;
    report += \`Iter |     x_n      |    f(x_n)    |   f'(x_n)    |   x_{n+1}    |   Error\\n\`;
    report += \`---------------------------------------------------------------------\\n\`;

    let iter = 0, maxIter = 20, xNext = x0, diff = 1;
    while (diff > tol && iter < maxIter) {
      iter++;
      let fx = evalFunc(fnStr, x0);
      let fpx = derivative(fnStr, x0);
      if (Math.abs(fpx) < 1e-12) {
        report += \`ERROR: Derivative near zero at x = \${x0}. Newton-Raphson failed to converge.\\n\`;
        break;
      }
      xNext = x0 - fx / fpx;
      diff = Math.abs(xNext - x0);
      report += \` \${iter.toString().padStart(2)}  | \${x0.toFixed(6).padStart(10)} | \${fx.toFixed(6).padStart(10)} | \${fpx.toFixed(6).padStart(10)} | \${xNext.toFixed(6).padStart(10)} | \${diff.toFixed(6)}\\n\`;
      x0 = xNext;
    }

    report += \`---------------------------------------------------------------------\\n\`;
    report += \`=== FINAL CONVERGED ROOT ===\\n\`;
    report += \`Root x ≈ \${xNext.toFixed(6)} after \${iter} iterations\`;

    if (out) out.value = report;
    if (window.showToast) window.showToast('Newton-Raphson converged!', 'success');
  }

  if (btn) btn.addEventListener('click', calculate);
  calculate();
});`,

  'ideal-gas-law-calculator.js': `/**
 * Ideal Gas Law Calculator Engine
 * Solves PV = nRT for any unknown parameter
 */
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('generate-btn') || document.getElementById('calc-btn');
  const out = document.getElementById('main-output');

  function calculate() {
    const solveFor = (document.getElementById('solve-target') || {}).value || 'P';
    const P = parseFloat((document.getElementById('p-val') || document.getElementById('val1') || {}).value) || 101.325; // kPa
    const V = parseFloat((document.getElementById('v-val') || document.getElementById('val2') || {}).value) || 0.0224;  // m3
    const n = parseFloat((document.getElementById('n-val') || {}).value) || 1.0;    // mol
    const T = parseFloat((document.getElementById('t-val') || {}).value) || 273.15; // K

    const R = 8.31446; // J / (mol K)

    let report = \`==========================================================\\n\`;
    report += \`             IDEAL GAS LAW CALCULATOR (PV = nRT)\\n\`;
    report += \`==========================================================\\n\`;

    if (solveFor === 'P') {
      const calcP = (n * R * T) / V; // Pa
      const pKpa = calcP / 1000;
      report += \`Calculated Pressure (P) = (n * R * T) / V\\n\`;
      report += \`  P = (\${n} mol * 8.3145 J/mol·K * \${T} K) / \${V} m³\\n\`;
      report += \`  P = \${pKpa.toFixed(3)} kPa (\${(pKpa/101.325).toFixed(3)} atm | \${(pKpa*0.145038).toFixed(2)} psi)\\n\`;
    } else if (solveFor === 'V') {
      const calcV = (n * R * T) / (P * 1000);
      report += \`Calculated Volume (V) = (n * R * T) / P\\n\`;
      report += \`  V = (\${n} * 8.3145 * \${T}) / \${P * 1000} Pa\\n\`;
      report += \`  V = \${calcV.toFixed(5)} m³ (\${(calcV * 1000).toFixed(2)} Liters)\\n\`;
    } else if (solveFor === 'n') {
      const calcN = (P * 1000 * V) / (R * T);
      report += \`Calculated Moles (n) = (P * V) / (R * T)\\n\`;
      report += \`  n = (\${P * 1000} Pa * \${V} m³) / (8.3145 * \${T} K)\\n\`;
      report += \`  n = \${calcN.toFixed(4)} moles\\n\`;
    } else {
      const calcT = (P * 1000 * V) / (n * R);
      report += \`Calculated Temperature (T) = (P * V) / (n * R)\\n\`;
      report += \`  T = \${calcT.toFixed(2)} K (\${(calcT - 273.15).toFixed(2)} °C)\\n\`;
    }

    report += \`==========================================================\`;
    if (out) out.value = report;
    if (window.showToast) window.showToast('Ideal gas state calculated!', 'success');
  }

  if (btn) btn.addEventListener('click', calculate);
  calculate();
});`,

  'ohms-law-calculator.js': `/**
 * Ohm's Law & DC Circuit Power Calculator
 */
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('generate-btn') || document.getElementById('calc-btn');
  const out = document.getElementById('main-output');

  function calculate() {
    const V = parseFloat((document.getElementById('v-volt') || document.getElementById('val1') || {}).value) || 12;
    const I = parseFloat((document.getElementById('i-amp') || document.getElementById('val2') || {}).value) || 2;
    const R = parseFloat((document.getElementById('r-ohm') || {}).value) || (V / I);

    const calcV = I * R;
    const calcI = V / R;
    const P = V * I;

    let report = \`==========================================================\\n\`;
    report += \`          OHM'S LAW & POWER CALCULATOR REPORT\\n\`;
    report += \`==========================================================\\n\`;
    report += \`Voltage (V):    \${V.toFixed(2)} Volts (V)\\n\`;
    report += \`Current (I):    \${I.toFixed(3)} Amperes (A) [\${(I*1000).toFixed(1)} mA]\\n\`;
    report += \`Resistance (R): \${R.toFixed(2)} Ohms (Ω)\\n\`;
    report += \`Power (P):      \${P.toFixed(2)} Watts (W) [P = V × I = I²R = V²/R]\\n\`;
    report += \`==========================================================\`;

    if (out) out.value = report;
    if (window.showToast) window.showToast("Ohm's Law calculated!", 'success');
  }

  if (btn) btn.addEventListener('click', calculate);
  calculate();
});`,

  'reynolds-number-calculator.js': `/**
 * Reynolds Number & Fluid Flow Regime Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('generate-btn') || document.getElementById('calc-btn');
  const out = document.getElementById('main-output');

  function calculate() {
    const rho = parseFloat((document.getElementById('rho-density') || document.getElementById('val1') || {}).value) || 998.2; // kg/m3 (water)
    const v = parseFloat((document.getElementById('v-velocity') || document.getElementById('val2') || {}).value) || 2.5;   // m/s
    const D = parseFloat((document.getElementById('d-diameter') || {}).value) || 0.05;   // m
    const mu = parseFloat((document.getElementById('mu-viscosity') || {}).value) || 0.001002; // Pa·s

    const Re = (rho * v * D) / mu;
    let regime = 'LAMINAR FLOW (Re < 2300)';
    if (Re > 4000) regime = 'TURBULENT FLOW (Re > 4000)';
    else if (Re >= 2300) regime = 'TRANSIENT / CRITICAL FLOW (2300 ≤ Re ≤ 4000)';

    let report = \`==========================================================\\n\`;
    report += \`          REYNOLDS NUMBER FLUID FLOW DYNAMICS\\n\`;
    report += \`==========================================================\\n\`;
    report += \`Fluid Density (ρ):    \${rho} kg/m³\\n\`;
    report += \`Flow Velocity (v):    \${v} m/s\\n\`;
    report += \`Pipe Diameter (D):    \${D} m (\${D*1000} mm)\\n\`;
    report += \`Dynamic Viscosity (μ):\${mu} Pa·s\\n\\n\`;
    report += \`REYNOLDS NUMBER (Re) = (ρ · v · D) / μ\\n\`;
    report += \`Re = \${Re.toFixed(2)} (\${Re.toExponential(4)})\\n\\n\`;
    report += \`FLOW REGIME: \${regime}\\n\`;
    report += \`==========================================================\`;

    if (out) out.value = report;
    if (window.showToast) window.showToast('Reynolds number calculated!', 'success');
  }

  if (btn) btn.addEventListener('click', calculate);
  calculate();
});`
};

// Apply upgrades
let count = 0;
for (const [filename, code] of Object.entries(engineUpgrades)) {
  const filePath = path.join(jsDir, filename);
  fs.writeFileSync(filePath, code, 'utf8');
  count++;
}

console.log(`✅ Upgraded ${count} real calculation engines with domain-accurate physics/math formulas!`);
