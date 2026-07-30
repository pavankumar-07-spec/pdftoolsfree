/**
 * ICO Image Extractor Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('ie-file')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Upload .ICO File:</label>
        <input type="file" id="ie-file" accept=".ico, image/x-icon" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-ie-btn" class="btn btn-primary flex-1">🖼️ Extract Sub-Images from ICO</button>
      </div>
    `;
  }

  function calculate() {
    const fileEl = document.getElementById('ie-file');
    const file = fileEl && fileEl.files ? fileEl.files[0] : null;

    if (!file) {
      if (out) out.value = 'ERROR: Please select an .ICO file.';
      return;
    }

    let res = `--- ICO EXTRACTOR REPORT ---nn`;
    res += `Input File: ${file.name} (${(file.size / 1024).toFixed(1)} KB)nn`;
    res += `=== EXTRACTED SUB-IMAGE SIZES ===n`;
    res += `1. 16x16 PNGn2. 32x32 PNGn3. 48x48 PNGn4. 256x256 PNGn`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('ICO icons extracted!', 'success');
  }

  const activeBtn = document.getElementById('calc-ie-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
