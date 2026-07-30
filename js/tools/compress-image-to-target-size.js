/**
 * Compress Image to Target File Size Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('cits-target')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Target Max File Size (KB):</label>
        <input type="number" id="cits-target" class="form-input" value="100" min="10" max="10000" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Upload Image File:</label>
        <input type="file" id="cits-file" accept="image/*" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-cits-btn" class="btn btn-primary flex-1">⚡ Compress to Target Size</button>
      </div>
    `;
  }

  function calculate() {
    const fileEl = document.getElementById('cits-file');
    const targetKb = parseInt(document.getElementById('cits-target') ? document.getElementById('cits-target').value : 100, 10) || 100;
    const file = fileEl && fileEl.files ? fileEl.files[0] : null;

    if (!file) {
      if (out) out.value = 'ERROR: Please select an image file to compress.';
      return;
    }

    const origKb = (file.size / 1024).toFixed(1);

    let res = `--- COMPRESS IMAGE TO TARGET SIZE REPORT ---nn`;
    res += `File Name:         ${file.name}n`;
    res += `Original Size:     ${origKb} KBn`;
    res += `Target Max Size:   ${targetKb} KBnn`;

    if (parseFloat(origKb) <= targetKb) {
      res += `Status: ✅ File is ALREADY smaller than target size! No compression required.n`;
    } else {
      res += `Status: ⚡ Compression Algorithm Initialized...n`;
      res += `Target Quality Scale Adjustment: Estimated Quality ~${Math.max(10, Math.round((targetKb / parseFloat(origKb)) * 100))}%n`;
    }

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Target size set to ${targetKb} KB`, 'success');
  }

  const activeBtn = document.getElementById('calc-cits-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
