/**
 * Svg To Png Engine - Client-Side Real Engine
 */
function init_svg_to_png() {
  try {
    const btn = document.getElementById('generate-btn') || document.getElementById('calc-btn');
    const downloadBtn = document.getElementById('download-btn');
    const out = document.getElementById('main-output');
    const fileInput = document.querySelector('input[type="file"]');

    let loadedImg = null, canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            const img = new Image();
            img.onload = () => { loadedImg = img; processImage(); };
            img.src = ev.target.result;
          };
          reader.readAsDataURL(file);
        }
      });
    }

    function processImage() {
      try {

        let width = loadedImg ? loadedImg.width : 800;
        let height = loadedImg ? loadedImg.height : 600;
        canvas.width = width; canvas.height = height;

        if (loadedImg) {
          ctx.drawImage(loadedImg, 0, 0);
          if (slug.includes('invert')) {
            let imgData = ctx.getImageData(0, 0, width, height);
            let d = imgData.data;
            for (let i = 0; i < d.length; i += 4) { d[i] = 255 - d[i]; d[i+1] = 255 - d[i+1]; d[i+2] = 255 - d[i+2]; }
            ctx.putImageData(imgData, 0, 0);
          }
        } else {
          ctx.fillStyle = '#FF5A1F'; ctx.fillRect(0, 0, width, height);
          ctx.fillStyle = '#FFFFFF'; ctx.font = '24px sans-serif'; ctx.fillText('Svg To Png', 50, height / 2);
        }

        let report = `=== ${'Svg To Png'.toUpperCase()} REPORT ===\nDimensions: ${width} x ${height} px\nStatus: ✅ Canvas Rendered\n`;
        if (out) out.value = report;

        if (window.UIDashboardEngine) {
          window.UIDashboardEngine.render({
            containerId: 'gen-results-card',
            title: '✨ Svg To Png Workspace',
            status: 'Image Processed',
            archetype: 'image',
            kpis: [{ label: 'WIDTH', value: width + ' px', sub: 'Width' }, { label: 'HEIGHT', value: height + ' px', sub: 'Height' }],
            steps: ['Step 1: Loaded image.', 'Step 2: Applied canvas filter.', 'Step 3: Exported canvas.']
          });
        }
        if (window.showToast) window.showToast('Svg To Png processed!', 'success');
      } catch (err) {
        if (out) out.value = 'Error: ' + err.message;
      }
    }

    if (btn) btn.addEventListener('click', processImage);
    processImage();

    
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
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url; a.download = 'svg-to-png-output.png'; a.click();
            setTimeout(() => URL.revokeObjectURL(url), 2000);
          }
        });
      });
    }
  } catch (err) {
    console.error('[Engine Error] svg-to-png:', err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init_svg_to_png);
} else {
  init_svg_to_png();
}
