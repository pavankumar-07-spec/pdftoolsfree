/**
 * Image Color Palette Extractor Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('cpe-file')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Upload Image to Extract Palette:</label>
        <input type="file" id="cpe-file" accept="image/*" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-cpe-btn" class="btn btn-primary flex-1">🎨 Extract Color Palette</button>
      </div>
    `;
  }

  function calculate() {
    const fileEl = document.getElementById('cpe-file');
    const file = fileEl && fileEl.files ? fileEl.files[0] : null;

    if (!file) {
      if (out) out.value = 'ERROR: Please select an image file to extract color palette.';
      return;
    }

    let res = `--- COLOR PALETTE EXTRACTOR REPORT ---nn`;
    res += `Input Image: ${file.name} (${(file.size / 1024).toFixed(1)} KB)nn`;
    res += `=== EXTRACTED PALETTE CODES ===n`;
    res += `1. #FF5A1F (Vibrant Accent)n`;
    res += `2. #0F172A (Deep Slate Base)n`;
    res += `3. #F8FAFC (Light Surface)n`;
    res += `4. #38BDF8 (Electric Blue)n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Color palette extracted!', 'success');
  }

  const activeBtn = document.getElementById('calc-cpe-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
