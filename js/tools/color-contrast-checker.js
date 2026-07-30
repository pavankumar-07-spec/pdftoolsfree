/**
 * Color Contrast Checker Engine (WCAG 2.1 Compliance)
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('cc-fg')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Foreground / Text Color (Hex):</label>
          <input type="text" id="cc-fg" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="#FFFFFF">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Background Color (Hex):</label>
          <input type="text" id="cc-bg" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="#4F46E5">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-cc2-btn" class="btn btn-primary flex-1">👁️ Check Contrast & WCAG Compliance</button>
      </div>
    `;
  }

  function getLuminance(r, g, b) {
    const a = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const num = parseInt(hex, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
  }

  function calculate() {
    const fgHex = (document.getElementById('cc-fg')?.value || '#FFFFFF').trim();
    const bgHex = (document.getElementById('cc-bg')?.value || '#4F46E5').trim();

    try {
      const fg = hexToRgb(fgHex);
      const bg = hexToRgb(bgHex);

      const l1 = getLuminance(fg.r, fg.g, fg.b);
      const l2 = getLuminance(bg.r, bg.g, bg.b);

      const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      const roundedRatio = ratio.toFixed(2);

      const aaNormal = ratio >= 4.5;
      const aaLarge = ratio >= 3.0;
      const aaaNormal = ratio >= 7.0;
      const aaaLarge = ratio >= 4.5;

      let res = '--- WCAG 2.1 COLOR CONTRAST REPORT ---nn';
      res += `Foreground: ${fgHex} | Background: ${bgHex}n`;
      res += `Contrast Ratio: ${roundedRatio} : 1nn`;
      res += `WCAG Compliance Results:n`;
      res += `- AA Normal Text (>= 4.5:1): ${aaNormal ? 'PASS ✅' : 'FAIL ❌'}n`;
      res += `- AA Large Text (>= 3.0:1):  ${aaLarge ? 'PASS ✅' : 'FAIL ❌'}n`;
      res += `- AAA Normal Text (>= 7.0:1): ${aaaNormal ? 'PASS ✅' : 'FAIL ❌'}n`;
      res += `- AAA Large Text (>= 4.5:1):  ${aaaLarge ? 'PASS ✅' : 'FAIL ❌'}n`;

      if (out) out.value = res;
      if (window.showToast) window.showToast(`Contrast Ratio: ${roundedRatio}:1`, aaNormal ? 'success' : 'warning');
    } catch (e) {
      if (out) out.value = 'ERROR: Invalid hex color format.';
    }
  }

  const activeBtn = document.getElementById('calc-cc2-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
