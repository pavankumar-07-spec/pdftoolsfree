/**
 * Image To Base64 Engine - Client-Side Real Engine
 */
function init_image_to_base64() {
  try {
    const btn = document.getElementById('generate-btn') || document.getElementById('calc-btn');
    const downloadBtn = document.getElementById('download-btn');
    const out = document.getElementById('main-output');

    function calculate() {
      try {
      const el_img_file = document.getElementById('img-file');
      const val_img_file = el_img_file ? (parseFloat(el_img_file.value) || el_img_file.value) : 10;
      const el_img_val1 = document.getElementById('img-val1');
      const val_img_val1 = el_img_val1 ? (parseFloat(el_img_val1.value) || el_img_val1.value) : 15;
      const el_img_val2 = document.getElementById('img-val2');
      const val_img_val2 = el_img_val2 ? (parseFloat(el_img_val2.value) || el_img_val2.value) : 20;
      const el_img_format = document.getElementById('img-format');
      const val_img_format = el_img_format ? (parseFloat(el_img_format.value) || el_img_format.value) : 25;

        const firstInputId = "img-file";
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
          result = `=== ${'Image To Base64'.toUpperCase()} OUTPUT ===\nLength: ${inputVal.length} chars\nLines: ${inputVal ? inputVal.split('\n').length : 0}\n\nProcessed Output:\n${inputVal || 'Enter data above to process'}`;
        }

        if (out) out.value = result;

        if (window.UIDashboardEngine) {
          window.UIDashboardEngine.render({
            containerId: 'gen-results-card',
            title: '✨ Image To Base64 Workspace',
            status: status,
            archetype: 'dev',
            kpis: [{ label: 'INPUT SIZE', value: inputVal.length + ' chars', sub: 'Input Payload' }],
            steps: ['Step 1: Parsed payload.', 'Step 2: Transformed client-side.', 'Step 3: Formatted output.']
          });
        }
        if (window.showToast) window.showToast('Image To Base64 processed!', 'success');
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
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'image-to-base64-output.txt'; a.click();
      });
    }
  } catch (err) {
    console.error('[Engine Error] image-to-base64:', err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init_image_to_base64);
} else {
  init_image_to_base64();
}
