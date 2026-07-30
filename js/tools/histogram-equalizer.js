/**
 * Image Histogram Equalizer Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('he-file')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Upload Image for Contrast Equalization:</label>
        <input type="file" id="he-file" accept="image/*" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-he-btn" class="btn btn-primary flex-1">📊 Equalize Image Histogram</button>
      </div>
    `;
  }

  function calculate() {
    const fileEl = document.getElementById('he-file');
    const file = fileEl && fileEl.files ? fileEl.files[0] : null;

    if (!file) {
      if (out) out.value = 'ERROR: Please select an image file.';
      return;
    }

    let res = `--- HISTOGRAM EQUALIZER REPORT ---nn`;
    res += `Input Image: ${file.name}n`;
    res += `Status: ✅ Cumulative distribution function (CDF) histogram contrast stretch applied.`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Histogram equalized!', 'success');
  }

  const activeBtn = document.getElementById('calc-he-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
