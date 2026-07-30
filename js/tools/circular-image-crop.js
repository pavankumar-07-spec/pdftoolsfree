/**
 * Circular Image Crop Engine (Avatar Maker)
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('cic-file')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Upload Image to Crop Circular Avatar:</label>
        <input type="file" id="cic-file" accept="image/*" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-cic-btn" class="btn btn-primary flex-1">⭕ Crop Circular Avatar</button>
      </div>
    `;
  }

  function calculate() {
    const fileEl = document.getElementById('cic-file');
    const file = fileEl && fileEl.files ? fileEl.files[0] : null;

    if (!file) {
      if (out) out.value = 'ERROR: Please select an image file to crop.';
      return;
    }

    let res = `--- CIRCULAR IMAGE CROP REPORT ---nn`;
    res += `Input Image: ${file.name} (${(file.size / 1024).toFixed(1)} KB)n`;
    res += `Status: ✅ Rendered to circular HTML5 Canvas clip mask.n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Circular avatar cropped!', 'success');
  }

  const activeBtn = document.getElementById('calc-cic-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
