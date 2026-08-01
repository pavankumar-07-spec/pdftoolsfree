/**
 * Color Space Converter Engine (HEX, RGB, HSL, HSV, CMYK)
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('csc-color')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 2fr;gap:1rem;margin-bottom:1rem;align-items:center">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Base Color:</label>
          <input type="color" id="csc-color" class="form-input" value="#007ACC" style="width:100%;height:50px;padding:0.25rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);cursor:pointer">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">HEX String:</label>
          <input type="text" id="csc-hex" class="form-input" value="#007ACC" style="width:100%;padding:0.6rem;font-family:monospace;font-size:1.1rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-csc-btn" class="btn btn-primary flex-1">🌈 Convert Color Spaces</button>
      </div>
    `;

    document.getElementById('csc-color').addEventListener('input', (e) => {
      document.getElementById('csc-hex').value = e.target.value.toUpperCase();
    });
  }

  function rgbToCmyk(r, g, b) {
    if (r === 0 && g === 0 && b === 0) return { c: 0, m: 0, y: 0, k: 100 };
    const rN = r / 255, gN = g / 255, bN = b / 255;
    const k = 1 - Math.max(rN, gN, bN);
    const c = (1 - rN - k) / (1 - k);
    const m = (1 - gN - k) / (1 - k);
    const y = (1 - bN - k) / (1 - k);
    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100)
    };
  }

  function rgbToHsv(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const d = max - min;
    let h, s = max === 0 ? 0 : d / max;
    const v = max;

    if (max === min) {
      h = 0;
    } else {
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      v: Math.round(v * 100)
    };
  }

  function calculate() {
    let hex = document.getElementById('csc-hex') ? document.getElementById('csc-hex').value.trim() : '#007ACC';
    if (!hex.startsWith('#')) hex = '#' + hex;

    if (!/^#[0-9A-F]{6}$/i.test(hex)) {
      if (out) out.value = 'ERROR: Invalid 6-character HEX color format (e.g. #007ACC).';
      return;
    }

    const c = hex.replace('#', '');
    const num = parseInt(c, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;

    const cmyk = rgbToCmyk(r, g, b);
    const hsv = rgbToHsv(r, g, b);

    let res = `--- ALL COLOR SPACE CONVERSIONS ---nn`;
    res += `HEX Code:   ${hex.toUpperCase()}nn`;

    res += `=== 1. RGB (Red, Green, Blue) ===n`;
    res += `rgb(${r}, ${g}, ${b})n`;
    res += `Normalized: rgb(${(r/255).toFixed(2)}, ${(g/255).toFixed(2)}, ${(b/255).toFixed(2)})nn`;

    res += `=== 2. CMYK (Cyan, Magenta, Yellow, Key/Black - Print) ===n`;
    res += `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)nn`;

    res += `=== 3. HSV / HSB (Hue, Saturation, Value/Brightness) ===n`;
    res += `hsv(${hsv.h}°, ${hsv.s}%, ${hsv.v}%)nn`;

    res += `=== 4. CSS CODE FRAGMENTS ===n`;
    res += `color: ${hex.toUpperCase()};n`;
    res += `background-color: rgb(${r}, ${g}, ${b});n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Color spaces converted!', 'success');
  }

  const activeBtn = document.getElementById('calc-csc-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
