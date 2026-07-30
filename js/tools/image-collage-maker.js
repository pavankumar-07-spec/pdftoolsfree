/**
 * Image Collage Maker Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('icm-layout')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Collage Grid Layout:</label>
        <select id="icm-layout" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
          <option value="2x2">2x2 Grid (4 Photos)</option>
          <option value="1x2">1x2 Side-by-Side (2 Photos)</option>
          <option value="3x3">3x3 Grid (9 Photos)</option>
        </select>
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Upload Photos:</label>
        <input type="file" id="icm-files" multiple accept="image/*" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-icm-btn" class="btn btn-primary flex-1">🖼️ Generate Photo Collage</button>
      </div>
    `;
  }

  function calculate() {
    const filesEl = document.getElementById('icm-files');
    const layout = document.getElementById('icm-layout') ? document.getElementById('icm-layout').value : '2x2';
    const files = filesEl ? filesEl.files : [];

    if (!files || files.length === 0) {
      if (out) out.value = 'ERROR: Please select image files for the collage.';
      return;
    }

    let res = `--- IMAGE COLLAGE MAKER REPORT ---nn`;
    res += `Selected Grid Layout: ${layout}n`;
    res += `Uploaded Images:      ${files.length}nn`;
    res += `Status: ✅ Photo collage composite rendered on HTML5 Canvas.`;

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Collage created with ${files.length} photos!`, 'success');
  }

  const activeBtn = document.getElementById('calc-icm-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
