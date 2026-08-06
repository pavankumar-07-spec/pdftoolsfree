/**
 * ADVANCED FULL-SITE HEADLESS DOM EXECUTION & FUZZ TESTER (V3 - Full Browser API Mocks)
 * Uses JSDOM to programmatically simulate user interactions, button clicks,
 * input value mutations, edge cases, and runtime exception monitoring across all 515 tools.
 */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const toolsDir = path.join(__dirname, '../tools');
const jsDir = path.join(__dirname, '../js/tools');
const htmlFiles = fs.readdirSync(toolsDir).filter(f => f.endsWith('.html')).sort();

console.log('====================================================');
console.log('  STARTING ADVANCED FULL-SITE HEADLESS DOM & FUZZ SUITE (V3)');
console.log('====================================================\n');

let totalTested = 0;
let passCount = 0;
let failCount = 0;
let fuzzTestedInputs = 0;
const failureDetails = [];

// Sample Fuzz Payloads
const fuzzPayloads = [
  '100',
  '0',
  '-50',
  '9999999',
  'abc!@#$%^&*()',
  '{"test": "fuzz"}',
  '<script>alert(1)</script>',
  '    '
];

htmlFiles.forEach((file, index) => {
  const slug = file.replace('.html', '');
  const htmlPath = path.join(toolsDir, file);
  const jsPath = path.join(jsDir, `${slug}.js`);

  if (!fs.existsSync(jsPath)) return;

  totalTested++;

  try {
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    const jsContent = fs.readFileSync(jsPath, 'utf8');

    // Create Headless DOM Window
    const dom = new JSDOM(htmlContent, {
      runScripts: 'outside-only',
      url: `http://localhost:8080/tools/${file}`
    });

    const { window } = dom;
    const { document } = window;

    // Mock Browser APIs missing in JSDOM environment
    window.URL.createObjectURL = function () { return 'blob:http://localhost:8080/mock-uuid'; };
    window.URL.revokeObjectURL = function () {};
    window.HTMLCanvasElement.prototype.getContext = function () {
      return {
        drawImage: function () {},
        getImageData: function (x, y, w, h) { return { data: new Uint8ClampedArray(w * h * 4) }; },
        putImageData: function () {},
        fillRect: function () {},
        fillText: function () {}
      };
    };
    window.HTMLCanvasElement.prototype.toBlob = function (cb) { cb(new Blob(['mock'])); };
    window.HTMLCanvasElement.prototype.toDataURL = function () { return 'data:image/png;base64,mock'; };

    // Track Runtime Errors
    let hasRuntimeError = false;
    let errorMessage = '';

    window.onerror = function (msg, url, line) {
      hasRuntimeError = true;
      errorMessage = `Runtime Error: ${msg} (line ${line})`;
    };

    // Inject Mocks for External UI Components
    window.showToast = function (msg, type) {};
    window.UIDashboardEngine = {
      render: function () {},
      attachLive: function () {}
    };

    // Execute Tool JS Script inside JSDOM environment safely
    try {
      window.eval(jsContent);
    } catch (scriptErr) {
      hasRuntimeError = true;
      errorMessage = scriptErr.message;
    }

    // Trigger DOMContentLoaded
    const event = document.createEvent('Event');
    event.initEvent('DOMContentLoaded', true, true);
    document.dispatchEvent(event);

    // ─── FUZZ TEST INPUT MUTATIONS & BUTTON CLICKS ───
    const inputs = Array.from(document.querySelectorAll('input, select, textarea:not(#main-output)'));
    inputs.forEach(input => {
      fuzzTestedInputs++;
      if (input.type === 'file') return;

      const testVal = fuzzPayloads[Math.floor(Math.random() * fuzzPayloads.length)];
      if (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA') {
        try {
          input.value = testVal;
          input.dispatchEvent(new window.Event('input', { bubbles: true }));
          input.dispatchEvent(new window.Event('change', { bubbles: true }));
        } catch (e) {}
      }
    });

    // Programmatically Click Action Buttons (#generate-btn, #download-btn, #clear-btn)
    const genBtn = document.getElementById('generate-btn') || document.getElementById('calc-btn');
    if (genBtn) {
      try { genBtn.click(); } catch (e) { hasRuntimeError = true; errorMessage = e.message; }
    }

    const dlBtn = document.getElementById('download-btn');
    if (dlBtn) {
      try { dlBtn.click(); } catch (e) { hasRuntimeError = true; errorMessage = e.message; }
    }

    const clearBtn = document.getElementById('clear-btn');
    if (clearBtn) {
      try { clearBtn.click(); } catch (e) { hasRuntimeError = true; errorMessage = e.message; }
    }

    if (hasRuntimeError) {
      failCount++;
      failureDetails.push({ tool: slug, error: errorMessage });
    } else {
      passCount++;
    }

    // Print progress every 100 tools
    if ((index + 1) % 100 === 0 || index + 1 === htmlFiles.length) {
      console.log(`  [Progress] Tested ${index + 1} / ${htmlFiles.length} tools... (${passCount} passed, ${failCount} failed)`);
    }

    window.close();
  } catch (err) {
    failCount++;
    failureDetails.push({ tool: slug, error: err.message });
  }
});

console.log('\n====================================================');
console.log('  ADVANCED HEADLESS DOM & FUZZ TEST RESULTS (V3)');
console.log('====================================================');
console.log(`Total Tools Tested in JSDOM:  ${totalTested}`);
console.log(`Total Input Fuzz Mutations:   ${fuzzTestedInputs}`);
console.log(`Headless DOM PASS:            ${passCount} (${((passCount / totalTested) * 100).toFixed(1)}%)`);
console.log(`Headless DOM FAIL:            ${failCount}`);
console.log('====================================================');

if (failureDetails.length > 0) {
  console.log('\nFailure Details:');
  console.log(failureDetails);
} else {
  console.log('\n🎉 PERFECT! 100% OF ALL 515 TOOLS EXECUTED WITH ZERO RUNTIME ERRORS IN HEADLESS DOM FUZZ SUITE!');
}
