const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const toolsDir = path.join(__dirname, '../tools');
const assetsDir = path.join(__dirname, '../test-assets');
const reportFile = path.join(__dirname, '../e2e-test-results.json');

const files = fs.readdirSync(toolsDir).filter(f => f.endsWith('.html'));

const BASE_URL = 'http://localhost:8080';
const CONCURRENCY = 6;

async function runTest() {
  console.log(`🚀 Starting Playwright Headless E2E Smoke Test Suite across ${files.length} tools...`);
  console.log(`Target Dev Server: ${BASE_URL}\n`);

  const browser = await chromium.launch({ headless: true });

  const results = [];
  let passedCount = 0;
  let failedCount = 0;

  // Process in concurrent batches
  for (let i = 0; i < files.length; i += CONCURRENCY) {
    const batch = files.slice(i, i + CONCURRENCY);
    const promises = batch.map(async (file) => {
      const slug = file.replace(/\.html$/, '');
      const pageUrl = `${BASE_URL}/tools/${file}`;

      const context = await browser.newContext();
      const page = await context.newPage();

      const startTime = Date.now();
      let status = 'FAIL';
      let errorMsg = '';
      let snippet = '';

      try {
        await page.goto(pageUrl, { waitUntil: 'domcontentloaded', timeout: 8000 });

        // Wait brief moment for dynamic script loader execution
        await page.waitForTimeout(300);

        // File Upload Handling
        const fileInput = await page.$('input[type="file"]');
        if (fileInput) {
          const accept = (await fileInput.getAttribute('accept')) || '';
          let sampleFile = path.join(assetsDir, 'sample.png');
          if (accept.includes('pdf')) sampleFile = path.join(assetsDir, 'sample.pdf');
          else if (accept.includes('txt')) sampleFile = path.join(assetsDir, 'sample.txt');

          await fileInput.setInputFiles(sampleFile);
        }

        // Action Button Click
        const btn = await page.$('button[id*="calc-"], button#generate-btn, button.btn-primary');
        if (btn) {
          await btn.click({ timeout: 2000 });
        }

        // Async Output Polling (up to 2000ms)
        let outputVal = '';
        let hasCanvas = false;

        const pollStartTime = Date.now();
        while (Date.now() - pollStartTime < 2000) {
          outputVal = await page.evaluate(() => {
            const out = document.getElementById('main-output');
            return out ? out.value : '';
          });

          hasCanvas = await page.evaluate(() => {
            const c = document.querySelector('canvas');
            return c && c.width > 0 && c.height > 0;
          });

          if ((outputVal && outputVal.trim().length > 0) || hasCanvas) {
            status = 'PASS';
            snippet = outputVal ? outputVal.slice(0, 80).replace(/\n/g, ' ') : 'Canvas Output Rendered';
            break;
          }
          await page.waitForTimeout(100);
        }

        if (status !== 'PASS') {
          // Check if tool has immediate interactive DOM output
          const hasDynamicContent = await page.evaluate(() => {
            const main = document.getElementById('main-output');
            const inputs = document.getElementById('tool-inputs-container');
            return (main && main.value.length > 0) || (inputs && inputs.children.length > 0);
          });
          if (hasDynamicContent) {
            status = 'PASS';
            snippet = 'Interactive Input UI Ready';
          } else {
            errorMsg = 'Output area empty after button click';
          }
        }
      } catch (err) {
        status = 'FAIL';
        errorMsg = err.message;
      } finally {
        await context.close();
      }

      const latency = Date.now() - startTime;
      if (status === 'PASS') passedCount++;
      else failedCount++;

      const resItem = { slug, file, status, latency, snippet, errorMsg };
      results.push(resItem);

      const symbol = status === 'PASS' ? '✅' : '❌';
      console.log(`[${results.length}/${files.length}] ${symbol} ${slug} (${latency}ms) - ${snippet || errorMsg}`);
    });

    await Promise.all(promises);
  }

  await browser.close();

  fs.writeFileSync(reportFile, JSON.stringify(results, null, 2), 'utf8');

  console.log('\n--- PLAYWRIGHT E2E SMOKE TEST SUMMARY ---');
  console.log(`Total Tools Tested: ${files.length}`);
  console.log(`Passed:             ${passedCount}`);
  console.log(`Failed:             ${failedCount}`);
  console.log(`Pass Rate:          ${((passedCount / files.length) * 100).toFixed(1)}%`);
  console.log(`Results saved to:  ${reportFile}`);

  // Generate HTML Report
  try {
    require('./generate-test-report.js');
  } catch (e) {
    console.warn('Could not run generate-test-report.js:', e.message);
  }
}

runTest();
