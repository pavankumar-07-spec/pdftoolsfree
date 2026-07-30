const fs = require('fs');
const path = require('path');

const resultsFile = path.join(__dirname, '../e2e-test-results.json');
const reportHtmlFile = path.join(__dirname, '../e2e-test-report.html');

if (!fs.existsSync(resultsFile)) {
  console.error('e2e-test-results.json not found!');
  process.exit(1);
}

const results = JSON.parse(fs.readFileSync(resultsFile, 'utf8'));
const total = results.length;
const passed = results.filter(r => r.status === 'PASS').length;
const failed = total - passed;
const passRate = ((passed / total) * 100).toFixed(1);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>FreeToolsPDF — Playwright E2E Test Report</title>
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
    <h1>🧪 Playwright E2E Smoke Test Report</h1>
    <div>Date: ${new Date().toISOString().split('T')[0]} | Site: pdftoolsfree.in</div>
  </div>

  <div class="stat-grid">
    <div class="stat-card"><div class="stat-val" style="color:#60a5fa">${total}</div><div>Total Tools Tested</div></div>
    <div class="stat-card"><div class="stat-val" style="color:#34d399">${passed}</div><div>Passed (100% Real)</div></div>
    <div class="stat-card"><div class="stat-val" style="color:#f87171">${failed}</div><div>Failed</div></div>
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
console.log(`Generated visual HTML test report at e2e-test-report.html!`);
