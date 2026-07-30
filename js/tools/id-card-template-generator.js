/**
 * ID Card Template Generator Engine - Real-Time Live Canvas Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const nameIn = document.getElementById('id-name');
  const titleIn = document.getElementById('id-title');
  const numIn = document.getElementById('id-number');
  const deptIn = document.getElementById('id-dept');
  const compIn = document.getElementById('id-company');
  const colorIn = document.getElementById('id-color');
  const photoIn = document.getElementById('id-photo');
  const btn = document.getElementById('generate-btn');
  const downloadBtn = document.getElementById('download-btn');
  const out = document.getElementById('main-output');
  const canvas = document.getElementById('id-card-canvas');

  let uploadedImg = null;

  if (photoIn) {
    photoIn.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const img = new Image();
          img.onload = () => { uploadedImg = img; drawCanvasBadge(); };
          img.src = ev.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  function drawCanvasBadge() {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    const name = nameIn ? nameIn.value : 'Alex Morgan';
    const jobTitle = titleIn ? titleIn.value : 'Senior Engineer';
    const id = numIn ? numIn.value : 'EMP-2026-8940';
    const dept = deptIn ? deptIn.value : 'Engineering';
    const comp = compIn ? compIn.value : 'Acme Tech Corp';
    const brandColor = colorIn ? colorIn.value : '#FF5A1F';

    // Clear Canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    // Header Background Accent
    ctx.fillStyle = brandColor;
    ctx.fillRect(0, 0, w, 110);

    // Company Name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(comp.toUpperCase(), w / 2, 45);

    ctx.font = '11px Inter, sans-serif';
    ctx.fillText('OFFICIAL IDENTIFICATION PASS', w / 2, 65);

    // Photo Box / Circle Frame
    const photoRadius = 45;
    const photoY = 120;
    ctx.save();
    ctx.beginPath();
    ctx.arc(w / 2, photoY, photoRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#f1f5f9';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = brandColor;
    ctx.stroke();
    ctx.clip();

    if (uploadedImg) {
      ctx.drawImage(uploadedImg, (w / 2) - photoRadius, photoY - photoRadius, photoRadius * 2, photoRadius * 2);
    } else {
      ctx.fillStyle = '#94a3b8';
      ctx.font = '36px sans-serif';
      ctx.fillText('👤', w / 2, photoY + 12);
    }
    ctx.restore();

    // Name & Title Details
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 18px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(name, w / 2, 205);

    ctx.fillStyle = '#64748b';
    ctx.font = '500 13px Inter, sans-serif';
    ctx.fillText(jobTitle, w / 2, 225);

    // Metadata Card Box
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(24, 250, w - 48, 110);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.strokeRect(24, 250, w - 48, 110);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#64748b';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText('ID NUMBER:', 40, 275);
    ctx.fillText('DEPARTMENT:', 40, 305);
    ctx.fillText('STATUS:', 40, 335);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.fillText(id, 135, 275);
    ctx.fillText(dept, 135, 305);

    ctx.fillStyle = '#16a34a';
    ctx.fillText('● ACTIVE', 135, 335);

    // Vector Barcode Simulation
    ctx.fillStyle = '#0f172a';
    for (let x = 40; x < w - 40; x += 4) {
      const barW = Math.random() > 0.4 ? 2 : 1;
      ctx.fillRect(x, 385, barW, 45);
    }

    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(id, w / 2, 445);

    // Update Textarea Summary
    if (out) {
      out.value = `Badge Generated for ${name} (${id}) - ${comp}`;
    }
  }

  // Live Event Listeners
  [nameIn, titleIn, numIn, deptIn, compIn, colorIn].forEach(el => {
    if (el) el.addEventListener('input', drawCanvasBadge);
  });

  if (btn) btn.addEventListener('click', () => { drawCanvasBadge(); if (window.showToast) window.showToast('ID Badge canvas rendered!', 'success'); });

  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      if (!canvas) return;
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'id-card-badge.png';
      a.click();
      if (window.showToast) window.showToast('Downloaded High-Res PNG Badge!', 'success');
    });
  }

  drawCanvasBadge();
});