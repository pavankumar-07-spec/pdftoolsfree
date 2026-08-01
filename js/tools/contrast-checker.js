/**
 * Color Contrast Ratio & WCAG Accessibility Engine (Alias)
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('cchk-fg')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Foreground Text Color:</label>
          <input type="color" id="cchk-fg" value="#FFFFFF" style="width:100%;height:40px;padding:0.25rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Background Color:</label>
          <input type="color" id="cchk-bg" value="#FF5A1F" style="width:100%;height:40px;padding:0.25rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2)">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-cchk-btn" class="btn btn-primary flex-1">🎨 Evaluate WCAG Contrast</button>
      </div>
    `;
  }

  function getLuminance(hex) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    const a = [r, g, b].map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  function calculate() {
    const fg = document.getElementById('cchk-fg') ? document.getElementById('cchk-fg').value : '#FFFFFF';
    const bg = document.getElementById('cchk-bg') ? document.getElementById('cchk-bg').value : '#FF5A1F';

    const l1 = getLuminance(fg);
    const l2 = getLuminance(bg);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

    let res = `--- WCAG COLOR CONTRAST REPORT ---nn`;
    res += `Foreground: ${fg.toUpperCase()}n`;
    res += `Background: ${bg.toUpperCase()}n`;
    res += `Contrast Ratio: ${ratio.toFixed(2)}:1nn`;

    res += `=== WCAG 2.1 COMPLIANCE ===n`;
    res += `• AA Normal Text (4.5:1): ${ratio >= 4.5 ? 'PASS ✅' : 'FAIL ❌'}n`;
    res += `• AA Large Text  (3.0:1): ${ratio >= 3.0 ? 'PASS ✅' : 'FAIL ❌'}n`;
    res += `• AAA Normal Text (7.0:1): ${ratio >= 7.0 ? 'PASS ✅' : 'FAIL ❌'}n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Contrast Ratio: ${ratio.toFixed(2)}:1`, 'success');
  }

  const activeBtn = document.getElementById('calc-cchk-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
