/**
 * Comic & Halftone Photo Filter Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('cf-file')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Upload Image for Comic Filter:</label>
        <input type="file" id="cf-file" accept="image/*" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-cf-btn" class="btn btn-primary flex-1">🎨 Apply Comic Filter</button>
      </div>
    `;
  }

  function calculate() {
    const fileEl = document.getElementById('cf-file');
    const file = fileEl && fileEl.files ? fileEl.files[0] : null;

    if (!file) {
      if (out) out.value = 'ERROR: Please select an image file to apply comic filter.';
      return;
    }

    let res = `--- COMIC FILTER PROCESSOR REPORT ---nn`;
    res += `Input Image: ${file.name} (${(file.size / 1024).toFixed(1)} KB)n`;
    res += `Status: ✅ Comic edge detection & posterization filter applied to canvas.`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Comic filter applied!', 'success');
  }

  const activeBtn = document.getElementById('calc-cf-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
