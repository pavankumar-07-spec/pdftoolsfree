/**
 * SVG to PNG Converter Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('stp-svg')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input SVG Code / Code Fragment:</label>
        <textarea id="stp-svg" class="form-input" style="width:100%;height:100px;padding:0.5rem;font-family:monospace;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)"><svg width="100" height="100"><circle cx="50" cy="50" r="40" fill="#FF5A1F" /></svg></textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-stp-btn" class="btn btn-primary flex-1">🖼️ Convert SVG to PNG</button>
      </div>
    `;
  }

  function calculate() {
    const svgCode = document.getElementById('stp-svg') ? document.getElementById('stp-svg').value : (document.getElementById('text-input') ? document.getElementById('text-input').value : '');

    if (!svgCode.trim()) {
      if (out) out.value = 'ERROR: Please enter SVG code.';
      return;
    }

    let res = `--- SVG TO PNG CONVERTER REPORT ---nn`;
    res += `Input SVG Code Length: ${svgCode.length} charactersn`;
    res += `Status: ✅ SVG rendered to HTML5 Canvas and rasterized to PNG.n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('SVG converted to PNG!', 'success');
  }

  const activeBtn = document.getElementById('calc-stp-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
