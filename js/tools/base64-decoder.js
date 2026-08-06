/**
 * Base64 Decoder Engine - Client-Side Real Engine
 */
function init_base64_decoder() {
  try {
    const btn = document.getElementById('generate-btn') || document.getElementById('calc-btn');
    const downloadBtn = document.getElementById('download-btn');
    const out = document.getElementById('main-output');

    function calculate() {
      try {
      const el_text_input = document.getElementById('text-input');
      const val_text_input = el_text_input ? (parseFloat(el_text_input.value) || el_text_input.value) : 10;

        const firstInputId = "text-input";
        const inputEl = firstInputId ? document.getElementById(firstInputId) : (document.querySelector('textarea:not(#main-output)') || document.querySelector('input[type="text"]'));
        const inputVal = inputEl ? (inputEl.value || '').trim() : '';

        let result = '', status = 'Processed';

        if (slug.includes('json')) {
          if (!inputVal) result = '{\n  "status": "ready",\n  "message": "Enter JSON data above to format or validate"\n}';
          else { const parsed = JSON.parse(inputVal); result = JSON.stringify(parsed, null, 2); status = 'Valid JSON'; }
        } else if (slug.includes('base64')) {
          if (slug.includes('decode')) result = atob(inputVal);
          else result = btoa(unescape(encodeURIComponent(inputVal || 'Sample Data')));
        } else if (slug.includes('uuid')) {
          result = Array.from({length: 5}, () => crypto.randomUUID()).join('\n');
        } else {
          result = `=== ${'Base64 Decoder'.toUpperCase()} OUTPUT ===\nLength: ${inputVal.length} chars\nLines: ${inputVal ? inputVal.split('\n').length : 0}\n\nProcessed Output:\n${inputVal || 'Enter data above to process'}`;
        }

        if (out) out.value = result;

        if (window.UIDashboardEngine) {
          window.UIDashboardEngine.render({
            containerId: 'gen-results-card',
            title: '✨ Base64 Decoder Workspace',
            status: status,
            archetype: 'dev',
            kpis: [{ label: 'INPUT SIZE', value: inputVal.length + ' chars', sub: 'Input Payload' }],
            steps: ['Step 1: Parsed payload.', 'Step 2: Transformed client-side.', 'Step 3: Formatted output.']
          });
        }
        if (window.showToast) window.showToast('Base64 Decoder processed!', 'success');
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
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'base64-decoder-output.txt'; a.click();
      });
    }
  } catch (err) {
    console.error('[Engine Error] base64-decoder:', err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init_base64_decoder);
} else {
  init_base64_decoder();
}
