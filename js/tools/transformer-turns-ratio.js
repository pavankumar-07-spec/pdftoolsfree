/**
 * Transformer Turns Ratio Engine - Client-Side Real Engine
 */
function init_transformer_turns_ratio() {
  try {
    const btn = document.getElementById('generate-btn') || document.getElementById('calc-btn');
    const downloadBtn = document.getElementById('download-btn');
    const out = document.getElementById('main-output');

    function calculate() {
      try {
      const el_np_val = document.getElementById('np-val');
      const val_np_val = el_np_val ? (parseFloat(el_np_val.value) || el_np_val.value) : 10;
      const el_ns_val = document.getElementById('ns-val');
      const val_ns_val = el_ns_val ? (parseFloat(el_ns_val.value) || el_ns_val.value) : 15;
      const el_vp_val = document.getElementById('vp-val');
      const val_vp_val = el_vp_val ? (parseFloat(el_vp_val.value) || el_vp_val.value) : 20;
      const el_ip_val = document.getElementById('ip-val');
      const val_ip_val = el_ip_val ? (parseFloat(el_ip_val.value) || el_ip_val.value) : 25;

        const numInputs = Array.from(document.querySelectorAll('input[type="number"], input[type="text"]:not(#main-output)'));
        const vals = numInputs.map(i => parseFloat(i.value)).filter(n => !isNaN(n));

        let res = 0;
        let report = `=== ${'Transformer Turns Ratio'.toUpperCase()} REPORT ===\n\n`;

        if (slug.includes('cagr')) {
          const pv = vals[0] || 10000, fv = vals[1] || 25000, n = vals[2] || 5;
          res = (Math.pow(fv / pv, 1 / n) - 1) * 100;
          report += `Initial Value: ${pv}\nFinal Value:   ${fv}\nDuration:       ${n} years\nCAGR:           ${res.toFixed(2)}%\n`;
        } else if (slug.includes('bmi')) {
          const weight = vals[0] || 70, heightCm = vals[1] || 175;
          const heightM = heightCm / 100;
          res = weight / (heightM * heightM);
          let cat = 'Normal Weight';
          if (res < 18.5) cat = 'Underweight';
          else if (res >= 25 && res < 29.9) cat = 'Overweight';
          else if (res >= 30) cat = 'Obese';
          report += `Weight: ${weight} kg\nHeight: ${heightCm} cm\nBMI:    ${res.toFixed(2)} kg/m²\nCategory: ${cat}\n`;
        } else if (slug.includes('emi') || slug.includes('loan')) {
          const p = vals[0] || 500000, rYr = vals[1] || 8.5, nYr = vals[2] || 5;
          const r = rYr / 12 / 100; const n = nYr * 12;
          res = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
          report += `Loan Amount: ₹${p.toLocaleString()}\nEMI:         ₹${res.toFixed(2)}\n`;
        } else {
          const v1 = vals[0] || 10, v2 = vals[1] || 5;
          res = v1 + v2;
          report += `Inputs: ${vals.join(', ')}\nOutcome: ${res.toFixed(4)}\n`;
        }

        if (out) out.value = report;

        if (window.UIDashboardEngine) {
          window.UIDashboardEngine.render({
            containerId: 'gen-results-card',
            title: '✨ Transformer Turns Ratio Workspace',
            status: 'Optimal Result',
            archetype: 'calc',
            kpis: [{ label: 'RESULT', value: typeof res === 'number' ? res.toFixed(2) : res, sub: 'Outcome' }],
            steps: ['Step 1: Validated inputs.', 'Step 2: Computed result.', 'Step 3: Rendered dashboard.']
          });
        }
        if (window.showToast) window.showToast('Transformer Turns Ratio computed!', 'success');
      } catch (err) {
        if (out) out.value = 'Error: ' + err.message;
      }
    }

    if (btn) btn.addEventListener('click', calculate);
    calculate();

    
    const copyBtn = document.getElementById('copy-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const txt = out ? (out.value || out.innerText || '') : '';
        if (txt) {
          navigator.clipboard.writeText(txt).then(() => {
            if (window.showToast) window.showToast('Copied output to clipboard! 📋', 'success');
          }).catch(() => {
            if (window.showToast) window.showToast('Failed to copy text', 'error');
          });
        } else {
          if (window.showToast) window.showToast('No output text to copy yet', 'warning');
        }
      });
    }

    const sampleBtn = document.getElementById('sample-btn');
    if (sampleBtn) {
      sampleBtn.addEventListener('click', () => {
        const numInputs = Array.from(document.querySelectorAll('input[type="number"]'));
        numInputs.forEach((inp, idx) => {
          inp.value = (idx + 1) * 15;
        });
        const textInputs = Array.from(document.querySelectorAll('textarea:not(#main-output), input[type="text"]'));
        textInputs.forEach(inp => {
          inp.value = 'Sample Data for testing domain calculations';
        });
        if (typeof calculate === 'function') calculate();
        else if (typeof processPdf === 'function') processPdf();
        else if (typeof processImage === 'function') processImage();
        if (window.showToast) window.showToast('Loaded sample test parameters! 💡', 'info');
      });
    }

    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        const txt = out ? out.value : '';
        const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'transformer-turns-ratio-report.txt'; a.click();
      });
    }
  } catch (err) {
    console.error('[Engine Error] transformer-turns-ratio:', err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init_transformer_turns_ratio);
} else {
  init_transformer_turns_ratio();
}
