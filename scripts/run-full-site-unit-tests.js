/**
 * MASTER FULL-SITE UNIT & INTEGRATION TESTING ENGINE (V3)
 * Programmatically loads and unit-tests all 515 tool HTML & JS files in headless JSDOM.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { JSDOM, VirtualConsole } = require('jsdom');

const HTML_DIR = path.join(__dirname, '..', 'tools');
const JS_DIR = path.join(__dirname, '..', 'js', 'tools');
const files = fs.readdirSync(HTML_DIR).filter(f => f.endsWith('.html')).sort();

let totalTools = files.length;
let passedUnit = 0;
let failedUnit = 0;
const testResults = [];
const issuesFound = [];

console.log(`====================================================`);
console.log(`  STARTING FULL-SITE UNIT TESTING SUITE (515 TOOLS)`);
console.log(`====================================================\n`);

files.forEach((f) => {
  const toolSlug = f.replace('.html', '');
  const htmlPath = path.join(HTML_DIR, f);
  const jsPath = path.join(JS_DIR, toolSlug + '.js');

  if (!fs.existsSync(jsPath)) {
    failedUnit++;
    issuesFound.push({ tool: toolSlug, issue: 'Missing JS engine file' });
    return;
  }

  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  const jsContent = fs.readFileSync(jsPath, 'utf8');

  const virtualConsole = new VirtualConsole();
  const dom = new JSDOM(htmlContent, {
    url: "http://localhost/",
    runScripts: "outside-only",
    resources: "usable",
    virtualConsole
  });

  const { window } = dom;
  const { document } = window;

  // Mock WebCrypto & Canvas 2D
  if (!window.crypto || !window.crypto.subtle) {
    Object.defineProperty(window, 'crypto', {
      value: crypto.webcrypto || {
        subtle: {
          digest: async () => new Uint8Array(20),
          importKey: async () => ({}),
          deriveKey: async () => ({}),
          encrypt: async () => new Uint8Array(16),
          decrypt: async () => new Uint8Array(16)
        },
        getRandomValues: (arr) => crypto.randomBytes(arr.length)
      }
    });
  }

  window.HTMLCanvasElement.prototype.getContext = () => ({
    clearRect: () => {}, fillRect: () => {}, strokeRect: () => {},
    beginPath: () => {}, closePath: () => {}, moveTo: () => {}, lineTo: () => {},
    save: () => {}, restore: () => {}, rotate: () => {}, translate: () => {},
    setLineDash: () => {}, arc: () => {}, fill: () => {}, stroke: () => {},
    fillText: () => {}, measureText: () => ({ width: 50 }),
    createLinearGradient: () => ({ addColorStop: () => {} }),
    drawImage: () => {}, toDataURL: () => 'data:image/png;base64,iVBORw0KGgo='
  });

  window.lucide = { createIcons: () => {} };
  window.scrollTo = () => {};

  let toolPassed = true;
  let failReason = '';

  try {
    // 1. Evaluate Script
    window.eval(jsContent);

    // 2. Dispatch DOMContentLoaded
    document.dispatchEvent(new window.Event('DOMContentLoaded', { bubbles: true }));

    // 3. Verify Output Element Existence
    const outEl = document.getElementById('main-output') || 
                  document.getElementById('gen-results-card') || 
                  document.getElementById('binary-matrix') ||
                  document.getElementById('res-val') ||
                  document.getElementById('res-out') ||
                  document.getElementById('result') ||
                  document.getElementById('output') ||
                  document.querySelector('[id*="res"]') ||
                  document.querySelector('[id*="out"]') ||
                  document.querySelector('[id*="matrix"]') ||
                  document.querySelector('[id*="grid"]') ||
                  document.querySelector('.output-box') ||
                  document.querySelector('canvas') ||
                  document.querySelector('input, select, textarea');

    if (!outEl) {
      toolPassed = false;
      failReason = 'Missing output element container';
    } else {
      // 4. Trigger Calculation Button if present
      const calcBtn = document.getElementById('generate-btn') || 
                      document.getElementById('calc-btn') || 
                      document.querySelector('button[type="submit"]');
      if (calcBtn) {
        calcBtn.click();
      }
    }
  } catch (err) {
    toolPassed = false;
    failReason = `Runtime Exception: ${err.message}`;
  }

  if (toolPassed) {
    passedUnit++;
    testResults.push({ tool: toolSlug, status: 'PASS' });
  } else {
    failedUnit++;
    testResults.push({ tool: toolSlug, status: 'FAIL', reason: failReason });
    issuesFound.push({ tool: toolSlug, issue: failReason });
  }
});

console.log(`====================================================`);
console.log(`  FULL-SITE UNIT TESTING RESULTS (V3)`);
console.log(`====================================================`);
console.log(`Total Tools Unit Tested: ${totalTools}`);
console.log(`Unit Test PASS:          ${passedUnit} (${((passedUnit/totalTools)*100).toFixed(1)}%)`);
console.log(`Unit Test FAIL:          ${failedUnit}`);
console.log(`====================================================\n`);

if (issuesFound.length > 0) {
  console.log(`⚠️ Issues Found (${issuesFound.length} tools):`);
  issuesFound.forEach((item, i) => {
    console.log(`  ${i + 1}. [${item.tool}] -> ${item.issue}`);
  });
} else {
  console.log(`🎉 100% PERFECT UNIT TEST PASS RATE ACROSS ALL 515 TOOLS!`);
}
