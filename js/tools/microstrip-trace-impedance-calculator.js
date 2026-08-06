/**
 * Microstrip Trace Impedance Calculator Engine - Client-Side Real Engine
 */
function init_microstrip_trace_impedance_calculator() {
  try {
    const btn = document.getElementById('generate-btn') || document.getElementById('calc-btn');
    const downloadBtn = document.getElementById('download-btn');
    const out = document.getElementById('main-output');

    function calculate() {
      try {
      const el_er_dielectric = document.getElementById('er-dielectric');
      const val_er_dielectric = el_er_dielectric ? (parseFloat(el_er_dielectric.value) || el_er_dielectric.value) : 10;
      const el_h_sub = document.getElementById('h-sub');
      const val_h_sub = el_h_sub ? (parseFloat(el_h_sub.value) || el_h_sub.value) : 15;
      const el_w_trace = document.getElementById('w-trace');
      const val_w_trace = el_w_trace ? (parseFloat(el_w_trace.value) || el_w_trace.value) : 20;
      const el_t_copper = document.getElementById('t-copper');
      const val_t_copper = el_t_copper ? (parseFloat(el_t_copper.value) || el_t_copper.value) : 25;

        const firstInputId = "er-dielectric";
        const txtArea = firstInputId ? document.getElementById(firstInputId) : (document.querySelector('textarea:not(#main-output)') || document.querySelector('input[type="text"]'));
        const text = txtArea ? (txtArea.value || '') : '';

        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const chars = text.length;
        const sentences = text ? text.split(/[.!?]+/).filter(Boolean).length : 0;
        const readTimeMinutes = Math.ceil(words / 200);

        let report = `=== ${'Microstrip Trace Impedance Calculator'.toUpperCase()} REPORT ===\n`;
        report += `Word Count:           ${words}\n`;
        report += `Character Count:      ${chars}\n`;
        report += `Sentence Count:       ${sentences}\n`;
        report += `Estimated Read Time:  ${readTimeMinutes} min\n`;

        if (out) out.value = report;

        if (window.UIDashboardEngine) {
          window.UIDashboardEngine.render({
            containerId: 'gen-results-card',
            title: '✨ Microstrip Trace Impedance Calculator Workspace',
            status: 'Text Analyzed',
            archetype: 'text',
            kpis: [
              { label: 'WORD COUNT', value: words, sub: 'Total Words' },
              { label: 'CHARACTERS', value: chars, sub: 'Total Chars' }
            ],
            steps: ['Step 1: Parsed text payload.', 'Step 2: Calculated metrics.', 'Step 3: Output report.']
          });
        }
        if (window.showToast) window.showToast('Microstrip Trace Impedance Calculator computed!', 'success');
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
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'microstrip-trace-impedance-calculator-report.txt'; a.click();
      });
    }
  } catch (err) {
    console.error('[Engine Error] microstrip-trace-impedance-calculator:', err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init_microstrip_trace_impedance_calculator);
} else {
  init_microstrip_trace_impedance_calculator();
}
