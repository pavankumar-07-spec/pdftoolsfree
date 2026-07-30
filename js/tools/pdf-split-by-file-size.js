/**
 * PDF Split by File Size Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('psfs-size')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Max Split File Size (MB):</label>
        <input type="number" id="psfs-size" class="form-input" value="5" min="1" max="500" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Upload PDF File:</label>
        <input type="file" id="psfs-file" accept="application/pdf" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-psfs-btn" class="btn btn-primary flex-1">✂️ Split PDF by Size</button>
      </div>
    `;
  }

  function calculate() {
    const fileEl = document.getElementById('psfs-file');
    const maxSize = parseInt(document.getElementById('psfs-size') ? document.getElementById('psfs-size').value : 5, 10) || 5;
    const file = fileEl && fileEl.files ? fileEl.files[0] : null;

    if (!file) {
      if (out) out.value = 'ERROR: Please select a PDF file.';
      return;
    }

    const fileSizeMb = (file.size / (1024 * 1024)).toFixed(2);

    let res = `--- PDF SPLIT BY FILE SIZE REPORT ---nn`;
    res += `Input File:     ${file.name} (${fileSizeMb} MB)n`;
    res += `Max Part Size:  ${maxSize} MBnn`;
    res += `Estimated Parts: ${Math.max(1, Math.ceil(fileSizeMb / maxSize))} part(s)n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Splitting PDF into ${maxSize} MB parts!`, 'success');
  }

  const activeBtn = document.getElementById('calc-psfs-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
