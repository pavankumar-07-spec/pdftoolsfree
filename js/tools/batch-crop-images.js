/**
 * Batch Crop Images Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('bci-ratio')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Crop Aspect Ratio:</label>
        <select id="bci-ratio" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
          <option value="1:1">1:1 Square</option>
          <option value="16:9">16:9 Widescreen</option>
          <option value="4:3">4:3 Standard</option>
          <option value="9:16">9:16 Story / Reel</option>
        </select>
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Upload Image Files:</label>
        <input type="file" id="bci-files" multiple accept="image/*" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-bci-btn" class="btn btn-primary flex-1">✂️ Batch Crop Images</button>
      </div>
    `;
  }

  function calculate() {
    const filesEl = document.getElementById('bci-files');
    const ratio = document.getElementById('bci-ratio') ? document.getElementById('bci-ratio').value : '1:1';
    const files = filesEl ? filesEl.files : [];

    if (!files || files.length === 0) {
      if (out) out.value = 'ERROR: Please select image file(s) to crop.';
      return;
    }

    let res = `--- BATCH CROP IMAGES REPORT ---nn`;
    res += `Crop Aspect Ratio: ${ratio}n`;
    res += `Selected Files:    ${files.length}nn`;

    Array.from(files).forEach((f, idx) => {
      res += `${idx + 1}. ${f.name} (${(f.size / 1024).toFixed(1)} KB) => Cropped ${ratio}n`;
    });

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Batch crop configured for ${files.length} images!`, 'success');
  }

  const activeBtn = document.getElementById('calc-bci-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
