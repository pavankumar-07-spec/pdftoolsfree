/**
 * Responsive Design Viewport Tester Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('rdt-preset')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Select Device Viewport Preset:</label>
        <select id="rdt-preset" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
          <option value="375x812">Mobile - iPhone 13 / 14 (375 x 812 px)</option>
          <option value="768x1024">Tablet - iPad Portrait (768 x 1024 px)</option>
          <option value="1280x800">Laptop - HD Display (1280 x 800 px)</option>
          <option value="1920x1080">Desktop - Full HD (1920 x 1080 px)</option>
        </select>
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Target Web Page URL:</label>
        <input type="text" id="rdt-url" class="form-input" value="https://pdftoolsfree.in" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-rdt-btn" class="btn btn-primary flex-1">📱 Test Viewport Dimensions</button>
      </div>
    `;
  }

  function calculate() {
    const preset = document.getElementById('rdt-preset') ? document.getElementById('rdt-preset').value : '375x812';
    const url = document.getElementById('rdt-url') ? document.getElementById('rdt-url').value.trim() : 'https://pdftoolsfree.in';

    const [w, h] = preset.split('x');

    let res = `--- RESPONSIVE DESIGN TESTER REPORT ---nn`;
    res += `Tested URL:        ${url}n`;
    res += `Target Viewport:  ${w}px width x ${h}px heightn`;
    res += `Aspect Ratio:     ${(w / h).toFixed(2)}nn`;

    res += `=== CSS MEDIA QUERY BREAKPOINT MATCH ===n`;
    res += w < 768 ? `• Match: Mobile Viewport (< 768px)n` : w < 1200 ? `• Match: Tablet Viewport (768px - 1199px)n` : `• Match: Desktop Viewport (>= 1200px)n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Configured ${w}x${h} viewport test!`, 'success');
  }

  const activeBtn = document.getElementById('calc-rdt-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
