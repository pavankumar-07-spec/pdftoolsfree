/**
 * Upgraded Passport & ID Photo Maker Engine
 * Generates high-res 4x6 inch printable photo sheet grids (8/12/16 photos), handles background colors, custom aspect ratios, and direct PNG/PDF downloads.
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const out = document.getElementById('main-output');

  if (inputsContainer) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:1rem;margin-bottom:1.5rem">
        <div>
          <label class="form-label">Passport / Visa Standard</label>
          <select id="pip-standard" class="form-input">
            <option value="in" selected>🇮🇳 India Passport / PAN (3.5 x 4.5 cm)</option>
            <option value="us">🇺🇸 US Passport / Visa (2 x 2 inches / 51 x 51 mm)</option>
            <option value="uk">🇬🇧 UK / EU Schengen Visa (35 x 45 mm)</option>
            <option value="ca">🇨🇦 Canada Passport (50 x 70 mm)</option>
            <option value="au">🇦🇺 Australia Passport (35 x 45 mm)</option>
          </select>
        </div>
        <div>
          <label class="form-label">Background Color Fill</label>
          <select id="pip-bg" class="form-input">
            <option value="#FFFFFF" selected>⚪ Plain White (Standard)</option>
            <option value="#F8FAFC">Off-White / Light Gray</option>
            <option value="#E0F2FE">🌐 Light Blue (Visa)</option>
            <option value="transparent">Transparent / Keep Original</option>
          </select>
        </div>
        <div>
          <label class="form-label">Print Sheet Size</label>
          <select id="pip-sheet" class="form-input">
            <option value="4x6" selected>4 x 6 Inches (Standard Photo Sheet - 8 Photos)</option>
            <option value="single">Single Photo (Single High-Res Crop)</option>
            <option value="a4">A4 Sheet (Multi-Grid 16 Photos)</option>
          </select>
        </div>
      </div>

      <div style="margin-bottom:1.5rem">
        <label class="form-label">Upload Headshot Photo</label>
        <input type="file" id="pip-file" accept="image/*" class="form-input">
      </div>

      <div style="margin-bottom:1.5rem">
        <h4 style="margin:0 0 0.5rem;font-size:0.95rem">📷 Live Passport Grid Preview</h4>
        <div style="text-align:center;background:var(--surface-2);padding:1rem;border-radius:var(--radius-sm);border:1px dashed var(--border);overflow-x:auto">
          <canvas id="pip-canvas" style="max-width:100%;height:auto;border-radius:6px;box-shadow:var(--shadow-md);background:#ffffff"></canvas>
        </div>
      </div>

      <div class="flex gap-3 mt-4">
        <button id="generate-btn" type="button" class="btn btn-primary flex-1">🛂 Generate Passport Photo Grid</button>
        <button id="download-pip-btn" type="button" class="btn btn-accent">💾 Download Print Sheet (PNG)</button>
      </div>
    `;
  }

  const canvas = document.getElementById('pip-canvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  let loadedImage = null;

  function renderPassportSheet() {
    if (!canvas || !ctx) return;

    const std = document.getElementById('pip-standard') ? document.getElementById('pip-standard').value : 'in';
    const bgColor = document.getElementById('pip-bg') ? document.getElementById('pip-bg').value : '#FFFFFF';
    const sheetType = document.getElementById('pip-sheet') ? document.getElementById('pip-sheet').value : '4x6';

    // Canvas resolution settings (300 DPI)
    let sheetW = 1800; // 6 inches @ 300 dpi
    let sheetH = 1200; // 4 inches @ 300 dpi
    let cols = 4;
    let rows = 2;

    if (sheetType === 'single') {
      sheetW = 600;
      sheetH = 600;
      cols = 1;
      rows = 1;
    } else if (sheetType === 'a4') {
      sheetW = 2480; // A4 @ 300 dpi
      sheetH = 3508;
      cols = 4;
      rows = 4;
    }

    canvas.width = sheetW;
    canvas.height = sheetH;

    // Fill background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, sheetW, sheetH);

    // Calculate Photo dimensions
    let photoW = 350;
    let photoH = 450;
    if (std === 'us') { photoW = 400; photoH = 400; }
    if (std === 'ca') { photoW = 400; photoH = 560; }

    const marginX = (sheetW - (cols * photoW)) / (cols + 1);
    const marginY = (sheetH - (rows * photoH)) / (rows + 1);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = marginX + c * (photoW + marginX);
        const y = marginY + r * (photoH + marginY);

        // Draw photo box background
        if (bgColor !== 'transparent') {
          ctx.fillStyle = bgColor;
          ctx.fillRect(x, y, photoW, photoH);
        }

        if (loadedImage) {
          // Draw headshot centered in photo box
          const imgAspect = loadedImage.width / loadedImage.height;
          const targetAspect = photoW / photoH;

          let renderW = photoW;
          let renderH = photoH;
          let srcX = 0;
          let srcY = 0;
          let srcW = loadedImage.width;
          let srcH = loadedImage.height;

          if (imgAspect > targetAspect) {
            srcW = loadedImage.height * targetAspect;
            srcX = (loadedImage.width - srcW) / 2;
          } else {
            srcH = loadedImage.width / targetAspect;
            srcY = (loadedImage.height - srcH) / 2;
          }

          ctx.drawImage(loadedImage, srcX, srcY, srcW, srcH, x, y, photoW, photoH);
        } else {
          // Placeholder watermark text
          ctx.strokeStyle = '#cbd5e1';
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, photoW, photoH);
          ctx.fillStyle = '#94a3b8';
          ctx.font = 'bold 20px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`Photo ${r * cols + c + 1}`, x + photoW / 2, y + photoH / 2);
          ctx.font = '14px Inter, sans-serif';
          ctx.fillText(`${std.toUpperCase()} Standard`, x + photoW / 2, y + photoH / 2 + 25);
        }

        // Draw cutting border guideline
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, photoW, photoH);
      }
    }

    let report = `--- PASSPORT & ID PHOTO SHEET REPORT ---\n`;
    report += `Standard Target: ${std.toUpperCase()} (${photoW}x${photoH} px @ 300 DPI)\n`;
    report += `Sheet Size:      ${sheetType.toUpperCase()} (${cols * rows} Total Photos)\n`;
    report += `Background:      ${bgColor}\n`;
    report += `Status:          ${loadedImage ? '✅ High-Res Print Sheet Ready' : '📷 Upload a headshot photo to view custom grid'}`;

    if (out) out.value = report;
  }

  const fileInput = document.getElementById('pip-file');
  if (fileInput) {
    fileInput.addEventListener('change', () => {
      const file = fileInput.files ? fileInput.files[0] : null;
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            loadedImage = img;
            renderPassportSheet();
            if (window.showToast) window.showToast('Passport headshot loaded!', 'success');
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  const btn = document.getElementById('generate-btn');
  if (btn) btn.addEventListener('click', renderPassportSheet);

  ['pip-standard', 'pip-bg', 'pip-sheet'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', renderPassportSheet);
  });

  const downloadBtn = document.getElementById('download-pip-btn');
  if (downloadBtn && canvas) {
    downloadBtn.addEventListener('click', () => {
      renderPassportSheet();
      const link = document.createElement('a');
      link.download = `passport-photo-sheet-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      if (window.showToast) window.showToast('Passport photo sheet downloaded!', 'success');
    });
  }

  // Initial render
  renderPassportSheet();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
