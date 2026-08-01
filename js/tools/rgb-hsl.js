/**
 * RGB → HSL Converter Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('rgb-r')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Red (0-255):</label>
          <input type="number" id="rgb-r" min="0" max="255" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="255">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Green (0-255):</label>
          <input type="number" id="rgb-g" min="0" max="255" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="87">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Blue (0-255):</label>
          <input type="number" id="rgb-b" min="0" max="255" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="51">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-rgb-hsl-btn" class="btn btn-primary flex-1">🎨 Convert RGB → HSL / Hex</button>
      </div>
    `;
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
    const r = parseInt(document.getElementById('rgb-r')?.value || 255);
    const g = parseInt(document.getElementById('rgb-g')?.value || 87);
    const b = parseInt(document.getElementById('rgb-b')?.value || 51);

    if ([r, g, b].some(v => isNaN(v) || v < 0 || v > 255)) {
      if (out) out.value = 'ERROR: RGB values must be 0–255.'; return;
    }

    const { h, s, l } = rgbToHsl(r, g, b);
    const hex = '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();

    let res = '--- RGB → HSL / HEX CONVERTER ---nn';
    res += `RGB: rgb(${r}, ${g}, ${b})nn`;
    res += `Hex: ${hex}n`;
    res += `HSL: hsl(${h}, ${s}%, ${l}%)nn`;
    res += `Hue: ${h}°nSaturation: ${s}%nLightness: ${l}%n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Color converted!', 'success');
  }

  const activeBtn = document.getElementById('calc-rgb-hsl-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
