/**
 * BLACK AND WHITE CONVERTER - Real HTML5 Canvas Image Processor Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const fileIn = document.getElementById('img-file');
  const val1In = document.getElementById('img-val1');
  const val2In = document.getElementById('img-val2');
  const fmtIn = document.getElementById('img-format');
  const btn = document.getElementById('generate-btn');
  const downloadBtn = document.getElementById('download-btn');
  const canvas = document.getElementById('img-canvas');
  const out = document.getElementById('main-output');

  let loadedImg = null;

  function renderImage() {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const param1 = parseFloat(val1In ? val1In.value : 50);
    const param2 = parseFloat(val2In ? val2In.value : 100);

    if (!loadedImg) {
      canvas.width = 600;
      canvas.height = 400;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 600, 400);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 20px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('BLACK AND WHITE CONVERTER', 300, 180);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px Inter, sans-serif';
      ctx.fillText('Upload an image above to start processing', 300, 220);
      return;
    }

    canvas.width = loadedImg.naturalWidth || loadedImg.width;
    canvas.height = loadedImg.naturalHeight || loadedImg.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply specific transform based on tool type
    if ('black-and-white-converter'.includes('rotator')) {
      const angle = (param1 / 100) * 360;
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.drawImage(loadedImg, -canvas.width / 2, -canvas.height / 2);
      ctx.restore();
    } else if ('black-and-white-converter'.includes('flip')) {
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(loadedImg, -canvas.width, 0);
      ctx.restore();
    } else if ('black-and-white-converter'.includes('border') || 'black-and-white-converter'.includes('padding')) {
      const borderWidth = Math.round((param1 / 100) * 40);
      canvas.width = loadedImg.width + borderWidth * 2;
      canvas.height = loadedImg.height + borderWidth * 2;
      ctx.fillStyle = 'black-and-white-converter'.includes('transparent') ? 'rgba(0,0,0,0)' : '#3b82f6';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(loadedImg, borderWidth, borderWidth);
    } else {
      // Direct pixel manipulation or filter
      ctx.drawImage(loadedImg, 0, 0, canvas.width, canvas.height);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      const factor = (param1 - 50) * 2; // -100 to 100

      for (let i = 0; i < data.length; i += 4) {
        if ('black-and-white-converter'.includes('inverter') || 'black-and-white-converter'.includes('invert')) {
          data[i] = 255 - data[i];
          data[i+1] = 255 - data[i+1];
          data[i+2] = 255 - data[i+2];
        } else if ('black-and-white-converter'.includes('black-and-white') || 'black-and-white-converter'.includes('monochrome')) {
          const gray = 0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2];
          data[i] = data[i+1] = data[i+2] = gray;
        } else if ('black-and-white-converter'.includes('sepia')) {
          const r = data[i], g = data[i+1], b = data[i+2];
          data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
          data[i+1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
          data[i+2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
        } else if ('black-and-white-converter'.includes('brightness') || 'black-and-white-converter'.includes('exposure')) {
          data[i] = Math.min(255, Math.max(0, data[i] + factor));
          data[i+1] = Math.min(255, Math.max(0, data[i+1] + factor));
          data[i+2] = Math.min(255, Math.max(0, data[i+2] + factor));
        } else if ('black-and-white-converter'.includes('threshold')) {
          const gray = 0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2];
          const val = gray > (param1 / 100) * 255 ? 255 : 0;
          data[i] = data[i+1] = data[i+2] = val;
        }
      }
      ctx.putImageData(imgData, 0, 0);
    }

    if (out) {
      if ('black-and-white-converter'.includes('base64')) {
        let format = fmtIn ? fmtIn.value : 'png';
        if (format === 'jpg') format = 'jpeg';
        out.value = canvas.toDataURL('image/' + format);
      } else {
        out.value = `Processed Image (${canvas.width} x ${canvas.height} px). Ready for export!`;
      }
    }

    if (window.showToast) window.showToast('Image processing complete!', 'success');
  }

  if (fileIn) {
    fileIn.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const img = new Image();
          img.onload = () => {
            loadedImg = img;
            renderImage();
          };
          img.src = ev.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  [val1In, val2In].forEach(el => {
    if (el) el.addEventListener('input', renderImage);
  });

  if (btn) btn.addEventListener('click', renderImage);

  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      if (!canvas) return;
      let format = fmtIn ? fmtIn.value : 'png';
      if (format === 'jpg') format = 'jpeg';

      const mimeType = 'image/' + format;
      const ext = format === 'jpeg' ? 'jpg' : format;

      const dataUrl = canvas.toDataURL(mimeType, 0.92);
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `black-and-white-converter-output.${ext}`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { if (a.parentNode) a.parentNode.removeChild(a); }, 1000);

      if (window.showToast) window.showToast(`Downloaded image (.${ext})!`, 'success');
    });
  }

  renderImage();
});