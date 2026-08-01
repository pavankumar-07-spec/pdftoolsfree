/**
 * Percentage Calculator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const ic = document.getElementById('tool-inputs-container');
  const out = document.getElementById('main-output');
  if (ic && !document.getElementById('pct-val')) {
    ic.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label">Select Calculation Type</label>
        <select id="pct-mode" class="form-input">
          <option value="of" selected>What is X% of Y?</option>
          <option value="is">X is what % of Y?</option>
          <option value="change">% Change from X to Y</option>
        </select>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem">
        <div><label class="form-label">Value X</label><input type="number" id="pct-val" class="form-input" value="25"></div>
        <div><label class="form-label">Value Y</label><input type="number" id="pct-base" class="form-input" value="200"></div>
      </div>
      <button id="calc-pct-btn" class="btn btn-primary" style="width:100%">📊 Calculate Percentage</button>
    `;
  }
  function calc() {
    try {
      const mode = document.getElementById('pct-mode')?.value || 'of';
      const x = parseFloat(document.getElementById('pct-val')?.value) || 0;
      const y = parseFloat(document.getElementById('pct-base')?.value) || 0;
      let report = '==========================================================\n';
      report += '             PERCENTAGE CALCULATOR\n';
      report += '==========================================================\n\n';
      if (mode === 'of') {
        const result = (x / 100) * y;
        report += x + '% of ' + y + ' = ' + result.toFixed(4) + '\n';
        report += 'Formula: (X/100) × Y = (' + x + '/100) × ' + y + ' = ' + result.toFixed(4);
      } else if (mode === 'is') {
        const result = y !== 0 ? (x / y) * 100 : 0;
        report += x + ' is ' + result.toFixed(2) + '% of ' + y + '\n';
        report += 'Formula: (X/Y) × 100 = (' + x + '/' + y + ') × 100 = ' + result.toFixed(2) + '%';
      } else {
        const change = y !== 0 ? ((y - x) / Math.abs(x)) * 100 : 0;
        report += 'Change from ' + x + ' to ' + y + ' = ' + change.toFixed(2) + '%\n';
        report += (change >= 0 ? '📈 Increase' : '📉 Decrease') + ' of ' + Math.abs(change).toFixed(2) + '%';
      }
      report += '\n==========================================================';
      if (out) out.value = report;
      if (window.showToast) window.showToast('Percentage calculated!', 'success');
    } catch (e) { if (out) out.value = 'Error: ' + e.message; }
  }
  const b = document.getElementById('calc-pct-btn') || document.getElementById('generate-btn');
  if (b) b.onclick = calc;
  const sel = document.getElementById('pct-mode');
  if (sel) sel.onchange = calc;
  calc();
});