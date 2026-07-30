/**
 * Hex → RGB Converter Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('hex-input')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Enter Hex Color (e.g. #FF5733 or FF5733):</label>
        <input type="text" id="hex-input" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="#FF5733">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-hex-rgb-btn" class="btn btn-primary flex-1">🎨 Convert Hex → RGB / HSL</button>
      </div>
    `;
  }

  function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const bigint = parseInt(hex, 16);
    return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
  }

  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) { h = s = 0; }
    else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  }

  function calculate() {
    const hex = (document.getElementById('hex-input')?.value || '').trim();

    if (!hex || !/^#?[0-9a-fA-F]{3,8}$/.test(hex)) {
      if (out) out.value = 'ERROR: Invalid hex color format.';
      return;
    }

    const { r, g, b } = hexToRgb(hex);
    const { h, s, l } = rgbToHsl(r, g, b);
    const pureHex = hex.replace(/^#/, '').toUpperCase();

    let res = '--- HEX → RGB COLOR CONVERTER ---nn';
    res += `Hex: #${pureHex}nn`;
    res += `RGB: rgb(${r}, ${g}, ${b})n`;
    res += `HSL: hsl(${h}, ${s}%, ${l}%)nn`;
    res += `Red Channel:   ${r} (${Math.round(r/255*100)}%)n`;
    res += `Green Channel: ${g} (${Math.round(g/255*100)}%)n`;
    res += `Blue Channel:  ${b} (${Math.round(b/255*100)}%)n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Color converted!', 'success');
  }

  const activeBtn = document.getElementById('calc-hex-rgb-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
