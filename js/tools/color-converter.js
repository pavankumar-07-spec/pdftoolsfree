/**
 * Color Space Converter Engine (HEX, RGB, HSL, CMYK)
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('cc-hex')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Hex Color Code:</label>
        <input type="text" id="cc-hex" class="form-input" value="#FF5A1F" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-cc-btn" class="btn btn-primary flex-1">🎨 Convert Color Spaces</button>
      </div>
    `;
  }

  function hexToRgb(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const num = parseInt(hex, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
  }

  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  }

  function calculate() {
    const hex = document.getElementById('cc-hex') ? document.getElementById('cc-hex').value.trim() : '#FF5A1F';

    try {
      const rgb = hexToRgb(hex);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

      let res = `--- COLOR SPACE CONVERTER REPORT ---nn`;
      res += `HEX Code: #${hex.replace('#', '').toUpperCase()}n`;
      res += `RGB:      rgb(${rgb.r}, ${rgb.g}, ${rgb.b})n`;
      res += `HSL:      hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)n`;

      if (out) out.value = res;
      if (window.showToast) window.showToast('Color spaces converted!', 'success');
    } catch (e) {
      if (out) out.value = 'ERROR: Invalid HEX color code.';
    }
  }

  const activeBtn = document.getElementById('calc-cc-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
