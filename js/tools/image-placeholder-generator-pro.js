/**
 * Image Placeholder Generator Pro Engine - Exact Tool Output
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const wIn = document.getElementById('ph-width');
  const hIn = document.getElementById('ph-height');
  const textIn = document.getElementById('ph-text');
  const bgIn = document.getElementById('ph-bg');
  const fgIn = document.getElementById('ph-fg');
  const btn = document.getElementById('generate-btn');
  const downloadBtn = document.getElementById('download-btn');
  const out = document.getElementById('main-output');

  function renderPlaceholder() {
    const w = parseInt(wIn ? wIn.value : 600) || 600;
    const h = parseInt(hIn ? hIn.value : 400) || 400;
    const text = textIn && textIn.value ? textIn.value : `${w} x ${h}`;
    const bg = bgIn ? bgIn.value : '#CBD5E1';
    const fg = fgIn ? fgIn.value : '#475569';

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = fg;
    const fontSize = Math.max(14, Math.min(w, h) / 10);
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (ctx && typeof ctx.fillText === 'function') {
      ctx.fillText(text, w / 2, h / 2);
    }

    const dataUrl = canvas.toDataURL('image/png');
    const svgCode = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="100%" height="100%" fill="${bg}"/>
  <text x="50%" y="50%" fill="${fg}" font-family="sans-serif" font-size="${fontSize}" font-weight="bold" text-anchor="middle" dominant-baseline="middle">${text}</text>
</svg>`;

    if (out) out.value = svgCode;
    if (window.showToast) window.showToast('Image Placeholder generated!', 'success');
  }

  [wIn, hIn, textIn, bgIn, fgIn].forEach(el => { if (el) el.addEventListener('input', renderPlaceholder); });
  if (btn) btn.addEventListener('click', renderPlaceholder);
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const w = parseInt(wIn ? wIn.value : 600) || 600;
      const h = parseInt(hIn ? hIn.value : 400) || 400;
      const text = textIn && textIn.value ? textIn.value : `${w} x ${h}`;
      const bg = bgIn ? bgIn.value : '#CBD5E1';
      const fg = fgIn ? fgIn.value : '#475569';

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = fg;
      const fontSize = Math.max(14, Math.min(w, h) / 10);
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(text, w / 2, h / 2);

      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `placeholder-${w}x${h}.png`;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { if(a.parentNode) a.parentNode.removeChild(a); }, 1000);
      if (window.showToast) window.showToast('Downloaded PNG Placeholder!', 'success');
    });
  }

  renderPlaceholder();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});