/**
 * Duotone Generator Engine - Real HTML5 Canvas Pixel Processor
 */
document.addEventListener('DOMContentLoaded', () => {
  const fileIn = document.getElementById('img-file');
  const shadowIn = document.getElementById('dt-shadow');
  const highlightIn = document.getElementById('dt-highlight');
  const fmtIn = document.getElementById('img-format');
  const btn = document.getElementById('generate-btn');
  const downloadBtn = document.getElementById('download-btn');
  const canvas = document.getElementById('duotone-canvas');
  const out = document.getElementById('main-output');

  let loadedImage = null;

  function hexToRgb(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const num = parseInt(hex, 16);
    return [ (num >> 16) & 255, (num >> 8) & 255, num & 255 ];
  }

  function applyDuotoneFilter() {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const shadowRgb = hexToRgb(shadowIn ? shadowIn.value : '#1E3A8A');
    const highlightRgb = hexToRgb(highlightIn ? highlightIn.value : '#F97316');

    if (!loadedImage) {
      // Draw placeholder gradient if no image uploaded yet
      canvas.width = 600;
      canvas.height = 400;
      const grad = ctx.createLinearGradient(0, 0, 600, 400);
      grad.addColorStop(0, shadowIn ? shadowIn.value : '#1E3A8A');
      grad.addColorStop(1, highlightIn ? highlightIn.value : '#F97316');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 600, 400);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Upload an image above to apply Duotone Filter', 300, 200);
      return;
    }

    // Set canvas dimensions to loaded image
    canvas.width = loadedImage.naturalWidth || loadedImage.width;
    canvas.height = loadedImage.naturalHeight || loadedImage.height;

    // Draw original image onto canvas
    ctx.drawImage(loadedImage, 0, 0, canvas.width, canvas.height);

    // Get pixel data
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    // Apply pixel-by-pixel Duotone color mapping
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Luminance / Grayscale formula
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      const ratio = gray / 255;

      // Interpolate between shadow color and highlight color
      data[i]     = Math.round(shadowRgb[0] + ratio * (highlightRgb[0] - shadowRgb[0]));
      data[i + 1] = Math.round(shadowRgb[1] + ratio * (highlightRgb[1] - shadowRgb[1]));
      data[i + 2] = Math.round(shadowRgb[2] + ratio * (highlightRgb[2] - shadowRgb[2]));
    }

    // Put filtered pixels back to canvas
    ctx.putImageData(imgData, 0, 0);

    if (out) {
      out.value = `Duotone Filter Applied! Dimensions: ${canvas.width} x ${canvas.height} px`;
    }
    if (window.showToast) window.showToast('Duotone Filter applied!', 'success');
  }

  if (fileIn) {
    fileIn.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const img = new Image();
          img.onload = () => {
            loadedImage = img;
            applyDuotoneFilter();
          };
          img.src = ev.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  [shadowIn, highlightIn].forEach(el => {
    if (el) el.addEventListener('input', applyDuotoneFilter);
  });

  if (btn) btn.addEventListener('click', applyDuotoneFilter);

  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      if (!canvas) return;
      let format = fmtIn ? fmtIn.value : 'jpeg';
      if (format === 'jpg') format = 'jpeg';

      const mimeType = 'image/' + format;
      const extension = format === 'jpeg' ? 'jpg' : format;

      const dataUrl = canvas.toDataURL(mimeType, 0.92);
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `duotone-filtered.${extension}`;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();

      setTimeout(() => {
        if (a.parentNode) a.parentNode.removeChild(a);
      }, 1000);

      if (window.showToast) window.showToast(`Downloaded Duotone Image (.${extension})!`, 'success');
    });
  }

  applyDuotoneFilter();
});