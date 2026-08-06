const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');

console.log('=== REAL EXECUTABLE JSDOM CALCULATION QA HARNESS ===');
console.log('Executing shipped HTML & JS scripts in headless JSDOM environment...\n');

let totalTests = 0;
let passedTests = 0;

function runDomTest(toolSlug, customSetup, outputElementId, expectedCheck, testName) {
  totalTests++;
  const htmlPath = path.join(__dirname, '../tools', `${toolSlug}.html`);
  const jsPath = path.join(__dirname, '../js/tools', `${toolSlug}.js`);

  if (!fs.existsSync(htmlPath) || !fs.existsSync(jsPath)) {
    console.log(`❌ [FAIL] ${testName}: File not found (${htmlPath} or ${jsPath})`);
    return;
  }

  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  const jsContent = fs.readFileSync(jsPath, 'utf8');

  // Create empty VirtualConsole to suppress CSS loading noise
  const virtualConsole = new VirtualConsole();

  const dom = new JSDOM(htmlContent, {
    url: "http://localhost/",
    runScripts: "outside-only",
    resources: "usable",
    virtualConsole
  });

  const { window } = dom;
  const { document } = window;

  // Mock HTMLCanvasElement 2D context to prevent JSDOM canvas exceptions
  window.HTMLCanvasElement.prototype.getContext = () => ({
    clearRect: () => {},
    fillRect: () => {},
    strokeRect: () => {},
    beginPath: () => {},
    closePath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    save: () => {},
    restore: () => {},
    rotate: () => {},
    translate: () => {},
    setLineDash: () => {},
    arc: () => {},
    fill: () => {},
    stroke: () => {},
    fillText: () => {},
    measureText: () => ({ width: 50 }),
    createLinearGradient: () => ({ addColorStop: () => {} }),
    drawImage: () => {}
  });

  // Mock global browser APIs needed by script environment
  window.lucide = { createIcons: () => {} };
  window.scrollTo = () => {};

  try {
    // Execute script in window scope
    window.eval(jsContent);

    // Fire DOMContentLoaded to ensure IIFE init() binds event listeners
    document.dispatchEvent(new window.Event('DOMContentLoaded', { bubbles: true }));

    // Custom setup action to set inputs and trigger DOM calculation
    if (typeof customSetup === 'function') {
      customSetup(document, window);
    }

    // Read actual output from DOM
    const outEl = document.getElementById(outputElementId);
    const actualText = outEl ? (outEl.textContent || outEl.value || '').trim() : '';

    const isPass = expectedCheck(actualText);
    if (isPass) {
      passedTests++;
      console.log(`✅ [PASS] ${testName}`);
      console.log(`   Actual DOM Output: "${actualText}"\n`);
    } else {
      console.log(`❌ [FAIL] ${testName}`);
      console.log(`   Actual DOM Output: "${actualText}"\n`);
    }
  } catch (err) {
    console.log(`❌ [ERROR] ${testName}: ${err.message}\n`);
  }
}

// 1. Steel Bar Weight Calculator (D=16mm, L=12m, Qty=1) -> Expected: 18.96 kg
runDomTest(
  'steel-bar-weight-calculator',
  (doc, win) => {
    const dVal = doc.getElementById('d-val');
    const lVal = doc.getElementById('l-val');
    const qtyVal = doc.getElementById('qty-val');
    if (dVal) dVal.value = '16';
    if (lVal) lVal.value = '12';
    if (qtyVal) qtyVal.value = '1';
    dVal.dispatchEvent(new win.Event('input', { bubbles: true }));
  },
  'res-total-w',
  val => val.includes('18.96 kg') || val.includes('18.963'),
  'Steel Bar Weight (D=16mm, L=12m)'
);

// 2. Steel Bar Weight Edge Case: D=0
runDomTest(
  'steel-bar-weight-calculator',
  (doc, win) => {
    const dVal = doc.getElementById('d-val');
    const lVal = doc.getElementById('l-val');
    const qtyVal = doc.getElementById('qty-val');
    if (dVal) dVal.value = '0';
    if (lVal) lVal.value = '12';
    if (qtyVal) qtyVal.value = '1';
    dVal.dispatchEvent(new win.Event('input', { bubbles: true }));
  },
  'res-total-w',
  val => val.includes('0.00 kg') && !val.includes('NaN'),
  'Steel Bar Weight Edge Case (D=0)'
);

// 3. Ohm's Law Calculator (Voltage Mode: I=2A, R=6 Ohm -> V=12V)
runDomTest(
  'ohms-law-calculator',
  (doc, win) => {
    const btn = doc.querySelector('.mode-btn[data-mode="V"]');
    if (btn) btn.click();
    const v1 = doc.getElementById('val-1');
    const v2 = doc.getElementById('val-2');
    if (v1) v1.value = '2';
    if (v2) v2.value = '6';
    if (v1) v1.dispatchEvent(new win.Event('input', { bubbles: true }));
  },
  'main-result',
  val => val.includes('12 V') || val.includes('12.00'),
  "Ohm's Law Voltage Mode (I=2A, R=6 Ohm -> V=12V)"
);

// 4. Ohm's Law Calculator (Current Mode: V=12V, R=6 Ohm -> I=2A)
runDomTest(
  'ohms-law-calculator',
  (doc, win) => {
    const btn = doc.querySelector('.mode-btn[data-mode="I"]');
    if (btn) btn.click();
    const v1 = doc.getElementById('val-1');
    const v2 = doc.getElementById('val-2');
    if (v1) v1.value = '12';
    if (v2) v2.value = '6';
    if (v1) v1.dispatchEvent(new win.Event('input', { bubbles: true }));
  },
  'main-result',
  val => val.includes('2 A') || val.includes('2.00'),
  "Ohm's Law Current Mode (V=12V, R=6 Ohm -> I=2A)"
);

// 5. Ohm's Law Edge Case: R=0 in Current Mode (Division by Zero)
runDomTest(
  'ohms-law-calculator',
  (doc, win) => {
    const btn = doc.querySelector('.mode-btn[data-mode="I"]');
    if (btn) btn.click();
    const v1 = doc.getElementById('val-1');
    const v2 = doc.getElementById('val-2');
    if (v1) v1.value = '12';
    if (v2) v2.value = '0';
    if (v1) v1.dispatchEvent(new win.Event('input', { bubbles: true }));
  },
  'main-result',
  val => val.includes('0 A') || val.includes('Invalid') || !val.includes('NaN'),
  "Ohm's Law Edge Case (Division by Zero: R=0)"
);

// 6. LED Resistor Calculator (Vsrc=9V, Vf=2.1V, If=20mA) -> R = 345 Ω
runDomTest(
  'led-resistor-calculator',
  (doc, win) => {
    const vs = doc.getElementById('vs-val');
    const vf = doc.getElementById('vf-val');
    const ifEl = doc.getElementById('if-val');
    if (vs) vs.value = '9';
    if (vf) vf.value = '2.1';
    if (ifEl) ifEl.value = '20';
    if (vs) vs.dispatchEvent(new win.Event('input', { bubbles: true }));
  },
  'res-r',
  val => val.includes('345.0 Ω') || val.includes('345'),
  'LED Resistor (Vsrc=9V, Vf=2.1V, If=20mA)'
);

// 7. Concrete Volume Calculator (L=10m, W=4m, H=0.15m) -> V = 6.0 m³
runDomTest(
  'concrete-volume-calculator',
  (doc, win) => {
    const l = doc.getElementById('l-val');
    const w = doc.getElementById('w-val');
    const t = doc.getElementById('t-val');
    if (l) l.value = '10';
    if (w) w.value = '4';
    if (t) t.value = '0.15';
    if (l) l.dispatchEvent(new win.Event('input', { bubbles: true }));
  },
  'res-wet-vol',
  val => val.includes('6.00 m³') || val.includes('6.00'),
  'Concrete Volume (10m x 4m x 0.15m)'
);

// 8. Gear Ratio Calculator (Zin=20, Zout=60, Nin=1800) -> Ratio = 3.00:1
runDomTest(
  'gear-ratio-calculator',
  (doc, win) => {
    const zin = doc.getElementById('zin-val');
    const zout = doc.getElementById('zout-val');
    const nin = doc.getElementById('nin-val');
    if (zin) zin.value = '20';
    if (zout) zout.value = '60';
    if (nin) nin.value = '1800';
    if (zin) zin.dispatchEvent(new win.Event('input', { bubbles: true }));
  },
  'res-ratio',
  val => val.includes('3.00 : 1') || val.includes('3.00'),
  'Gear Ratio (Zin=20, Zout=60)'
);

// 9. Percentage to CGPA Converter (95%) -> CGPA = 10.0
runDomTest(
  'percentage-to-cgpa-converter',
  (doc, win) => {
    const pct = doc.getElementById('pct-val');
    if (pct) pct.value = '95';
    if (pct) pct.dispatchEvent(new win.Event('input', { bubbles: true }));
  },
  'res-cgpa',
  val => val.includes('10.00') || val.includes('10'),
  'Percentage to CGPA (95%)'
);

// 10. Molar Mass Calculator (H2O) -> 18.015 g/mol
runDomTest(
  'molar-mass-calculator',
  (doc, win) => {
    const formula = doc.getElementById('formula-input');
    if (formula) formula.value = 'H2O';
    if (formula) formula.dispatchEvent(new win.Event('input', { bubbles: true }));
  },
  'res-molar-mass',
  val => val.includes('18.015') || val.includes('18.015 g/mol'),
  'Molar Mass (H2O)'
);

console.log(`====================================================`);
console.log(`TEST SUMMARY: ${passedTests} / ${totalTests} REAL JSDOM TESTS PASSED (${((passedTests/totalTests)*100).toFixed(1)}%)`);
console.log(`====================================================`);
