/**
 * Interactive Color Picker & Palette Harmony Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('cp-color')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 2fr;gap:1rem;margin-bottom:1rem;align-items:center">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Select Base Color:</label>
          <input type="color" id="cp-color" class="form-input" value="#FF5A1F" style="width:100%;height:50px;padding:0.25rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);cursor:pointer">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">HEX Code Input:</label>
          <input type="text" id="cp-hex" class="form-input" value="#FF5A1F" style="width:100%;padding:0.6rem;font-family:monospace;font-size:1.1rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-cp-btn" class="btn btn-primary flex-1">🎨 Inspect Color & Harmonies</button>
      </div>
    `;

    document.getElementById('cp-color').addEventListener('input', (e) => {
      document.getElementById('cp-hex').value = e.target.value.toUpperCase();
    });
    document.getElementById('cp-hex').addEventListener('input', (e) => {
      const val = e.target.value;
      if (/^#[0-9A-F]{6}$/i.test(val)) {
        document.getElementById('cp-color').value = val;
      }
    });
  }

  function hexToRgb(hex) {
    const c = hex.replace('#', '');
    const num = parseInt(c, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
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
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }

  function hslToHex(h, s, l) {
    h = (h % 360 + 360) % 360;
    s /= 100; l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n, k = (n + h / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    const toHex = x => Math.round(x * 255).toString(16).padStart(2, '0');
    return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`.toUpperCase();
  }

  function calculate() {
    let hex = document.getElementById('cp-hex') ? document.getElementById('cp-hex').value.trim() : '#FF5A1F';
    if (!hex.startsWith('#')) hex = '#' + hex;

    if (!/^#[0-9A-F]{6}$/i.test(hex)) {
      if (out) out.value = 'ERROR: Invalid 6-character HEX color format (e.g. #FF5A1F).';
      return;
    }

    const { r, g, b } = hexToRgb(hex);
    const { h, s, l } = rgbToHsl(r, g, b);

    // Color Harmonies
    const complementary = hslToHex(h + 180, s, l);
    const triadic1 = hslToHex(h + 120, s, l);
    const triadic2 = hslToHex(h + 240, s, l);
    const analogous1 = hslToHex(h + 30, s, l);
    const analogous2 = hslToHex(h - 30, s, l);

    let res = `--- COLOR PICKER & HARMONY REPORT ---nn`;
    res += `Selected Color: ${hex.toUpperCase()}nn`;

    res += `=== COLOR CODES ===n`;
    res += `HEX:  ${hex.toUpperCase()}n`;
    res += `RGB:  rgb(${r}, ${g}, ${b})n`;
    res += `HSL:  hsl(${h}, ${s}%, ${l}%)n`;
    res += `RGBA: rgba(${r}, ${g}, ${b}, 1.0)nn`;

    res += `=== COLOR HARMONIES ===n`;
    res += `Complementary (180°): ${complementary}n`;
    res += `Triadic 1 (120°):      ${triadic1}n`;
    res += `Triadic 2 (240°):      ${triadic2}n`;
    res += `Analogous (+30°):      ${analogous1}n`;
    res += `Analogous (-30°):      ${analogous2}nn`;

    res += `=== CSS VARIABLE VARIABLE OUTPUT ===n`;
    res += `--primary-color: ${hex.toUpperCase()};n`;
    res += `--primary-rgb: ${r}, ${g}, ${b};n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Color code and harmonies calculated!', 'success');
  }

  const activeBtn = document.getElementById('calc-cp-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
