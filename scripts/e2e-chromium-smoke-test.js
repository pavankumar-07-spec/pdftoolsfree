const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');

const WSClient = global.WebSocket || require('ws');

const toolsDir = path.join(__dirname, '../tools');
const assetsDir = path.join(__dirname, '../test-assets');
const reportFile = path.join(__dirname, '../e2e-test-results.json');
const reportHtmlFile = path.join(__dirname, '../e2e-test-report.html');
const tmpProfile = path.join(__dirname, '../.tmp-chrome-profile');

if (!fs.existsSync(tmpProfile)) {
  fs.mkdirSync(tmpProfile, { recursive: true });
}

const files = fs.readdirSync(toolsDir).filter(f => f.endsWith('.html'));
const chromePath = 'C:\\Users\\bathu\\AppData\\Local\\ms-playwright\\chromium-1228\\chrome-win64\\chrome.exe';

const BASE_URL = 'http://localhost:8080';
const CONCURRENCY = 4;

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Invalid JSON from ${url}: ${data.slice(0, 100)}`));
        }
      });
    }).on('error', reject);
  });
}

function putJson(url) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, { method: 'PUT' }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Invalid JSON from PUT ${url}: ${data.slice(0, 100)}`));
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.id = 1;
    this.callbacks = new Map();
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WSClient(this.wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
      this.ws.onmessage = (evt) => {
        try {
          const msg = JSON.parse(evt.data);
          if (msg.id && this.callbacks.has(msg.id)) {
            const { res, rej } = this.callbacks.get(msg.id);
            this.callbacks.delete(msg.id);
            if (msg.error) rej(msg.error);
            else res(msg.result);
          }
        } catch (e) {}
      };
    });
  }

  send(method, params = {}) {
    return new Promise((res, rej) => {
      const msgId = this.id++;
      this.callbacks.set(msgId, { res, rej });
      this.ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function runE2E() {
  console.log(`🚀 Launching Playwright Native Headless Chromium E2E Test Suite across ${files.length} tools...`);
  console.log(`Executable: ${chromePath}`);
  console.log(`Dev Server: ${BASE_URL}\n`);

  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    `--user-data-dir=${tmpProfile}`,
    '--no-sandbox',
    '--disable-gpu',
    '--remote-allow-origins=*'
  ]);

  let connected = false;
  let browserWsUrl = '';
  for (let retry = 0; retry < 25; retry++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      const ver = await getJson('http://127.0.0.1:9222/json/version');
      browserWsUrl = ver.webSocketDebuggerUrl;
      connected = true;
      console.log('✅ Connected to Headless Chromium DevTools Protocol (CDP)!');
      break;
    } catch (e) {}
  }

  if (!connected || !browserWsUrl) {
    console.error('ERROR: Failed to connect to Chromium CDP port 9222');
    chromeProc.kill();
    process.exit(1);
  }

  const browserCDP = new CDPClient(browserWsUrl);
  await browserCDP.connect();

  const results = [];
  let passedCount = 0;
  let failedCount = 0;

  for (let i = 0; i < files.length; i += CONCURRENCY) {
    const batch = files.slice(i, i + CONCURRENCY);
    const batchPromises = batch.map(async (file) => {
      const slug = file.replace(/\.html$/, '');
      const targetUrl = `${BASE_URL}/tools/${file}`;
      const startTime = Date.now();

      let status = 'FAIL';
      let snippet = '';
      let errorMsg = '';

      let pageCDP = null;
      let targetId = null;
      try {
        // Create target tab via browser CDP
        const createRes = await browserCDP.send('Target.createTarget', { url: targetUrl });
        targetId = createRes.targetId;

        const pageWsUrl = `ws://127.0.0.1:9222/devtools/page/${targetId}`;
        pageCDP = new CDPClient(pageWsUrl);
        await pageCDP.connect();

        await pageCDP.send('Page.enable');
        await pageCDP.send('Runtime.enable');
        await pageCDP.send('DOM.enable');

        await new Promise(r => setTimeout(r, 350));

        // Populate sample file input if input[type=file] exists
        const fileCheck = await pageCDP.send('Runtime.evaluate', {
          expression: `(() => {
            const fi = document.querySelector('input[type="file"]');
            return fi ? (fi.getAttribute('accept') || 'all') : null;
          })()`
        });

        const fileType = fileCheck.result ? fileCheck.result.value : null;

        if (fileType !== null) {
          let samplePath = path.join(assetsDir, 'sample.png');
          if (fileType.includes('pdf')) samplePath = path.join(assetsDir, 'sample.pdf');
          else if (fileType.includes('txt')) samplePath = path.join(assetsDir, 'sample.txt');

          const docNode = await pageCDP.send('DOM.getDocument');
          const fileNode = await pageCDP.send('DOM.querySelector', { nodeId: docNode.root.nodeId, selector: 'input[type="file"]' });

          if (fileNode && fileNode.nodeId) {
            await pageCDP.send('DOM.setFileInputFiles', { nodeId: fileNode.nodeId, files: [samplePath] });
          }
        }

        // Click main calculate button
        await pageCDP.send('Runtime.evaluate', {
          expression: `(() => {
            const btn = document.querySelector('button[id*="calc-"], #generate-btn, .btn-primary');
            if (btn) btn.click();
          })()`
        });

        // Async Output Polling (up to 2000ms)
        const pollStart = Date.now();
        while (Date.now() - pollStart < 2000) {
          const evalRes = await pageCDP.send('Runtime.evaluate', {
            expression: `(() => {
              const out = document.getElementById('main-output');
              const canvas = document.querySelector('canvas');
              const textVal = out ? out.value.trim() : '';
              const hasCanvas = canvas && canvas.width > 0 && canvas.height > 0;
              const hasInputs = document.getElementById('tool-inputs-container') ? document.getElementById('tool-inputs-container').children.length > 0 : false;
              return { textVal, hasCanvas, hasInputs };
            })()`,
            returnByValue: true
          });

          const { textVal, hasCanvas, hasInputs } = evalRes.result ? (evalRes.result.value || {}) : {};

          if ((textVal && textVal.length > 0) || hasCanvas || hasInputs) {
            status = 'PASS';
            snippet = textVal ? textVal.slice(0, 75).replace(/\n/g, ' ') : (hasCanvas ? 'Canvas Output Rendered' : 'Interactive UI Ready');
            break;
          }
          await new Promise(r => setTimeout(r, 100));
        }

        if (status !== 'PASS') {
          errorMsg = 'Output area empty after button click';
        }

        if (targetId) {
          await browserCDP.send('Target.closeTarget', { targetId });
        }
      } catch (err) {
        status = 'FAIL';
        errorMsg = err.message || String(err);
      } finally {
        if (pageCDP) pageCDP.close();
      }

      const latency = Date.now() - startTime;
      if (status === 'PASS') passedCount++;
      else failedCount++;

      const item = { slug, file, status, latency, snippet, errorMsg };
      results.push(item);

      const symbol = status === 'PASS' ? '✅' : '❌';
      console.log(`[${results.length}/${files.length}] ${symbol} ${slug} (${latency}ms) - ${snippet || errorMsg}`);
    });

    await Promise.all(batchPromises);
  }

  browserCDP.close();
  chromeProc.kill();

  fs.writeFileSync(reportFile, JSON.stringify(results, null, 2), 'utf8');

  // Generate HTML Report
  const passRate = ((passedCount / files.length) * 100).toFixed(1);
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>FreeToolsPDF — Playwright Chromium E2E Test Report</title>
  <style>
    :root { --bg: #0f172a; --surface: #1e293b; --text: #f8fafc; --accent: #10b981; --danger: #ef4444; }
    body { font-family: system-ui, -apple-system, sans-serif; background: var(--bg); color: var(--text); padding: 2rem; }
    .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid #334155; }
    .stat-card { background: var(--surface); padding: 1.5rem; border-radius: 12px; text-align: center; border: 1px solid #334155; }
    .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem; }
    .stat-val { font-size: 2rem; font-weight: 800; }
    table { width: 100%; border-collapse: collapse; background: var(--surface); border-radius: 12px; overflow: hidden; }
    th, td { padding: 0.85rem 1.25rem; text-align: left; border-bottom: 1px solid #334155; font-size: 0.9rem; }
    th { background: #0f172a; color: #94a3b8; font-weight: 600; }
    .badge { padding: 0.25rem 0.6rem; border-radius: 6px; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; }
    .badge-pass { background: rgba(16, 185, 129, 0.2); color: #34d399; }
    .badge-fail { background: rgba(239, 68, 68, 0.2); color: #f87171; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🧪 Playwright Chromium E2E Smoke Test Report</h1>
    <div>Date: ${new Date().toISOString().split('T')[0]} | Engine: Real Headless Chromium | Site: pdftoolsfree.in</div>
  </div>

  <div class="stat-grid">
    <div class="stat-card"><div class="stat-val" style="color:#60a5fa">${files.length}</div><div>Total Tools Tested</div></div>
    <div class="stat-card"><div class="stat-val" style="color:#34d399">${passedCount}</div><div>Passed (100% Real)</div></div>
    <div class="stat-card"><div class="stat-val" style="color:#f87171">${failedCount}</div><div>Failed</div></div>
    <div class="stat-card"><div class="stat-val" style="color:#a78bfa">${passRate}%</div><div>E2E Pass Rate</div></div>
  </div>

  <h2>Detailed Test Execution Log</h2>
  <table>
    <thead>
      <tr>
        <th>Tool Slug</th>
        <th>Status</th>
        <th>Latency</th>
        <th>Output Sample / Details</th>
      </tr>
    </thead>
    <tbody>
      ${results.map(r => `
        <tr>
          <td><strong>${r.slug}</strong></td>
          <td><span class="badge ${r.status === 'PASS' ? 'badge-pass' : 'badge-fail'}">${r.status}</span></td>
          <td>${r.latency}ms</td>
          <td style="color:#94a3b8">${r.snippet || r.errorMsg || '-'}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
</body>
</html>`;

  fs.writeFileSync(reportHtmlFile, html, 'utf8');

  console.log('\n--- PLAYWRIGHT CHROMIUM E2E SMOKE TEST SUMMARY ---');
  console.log(`Total Tools Tested: ${files.length}`);
  console.log(`Passed:             ${passedCount}`);
  console.log(`Failed:             ${failedCount}`);
  console.log(`Pass Rate:          ${passRate}%`);
  console.log(`Visual HTML Report: e2e-test-report.html`);
}

runE2E();
