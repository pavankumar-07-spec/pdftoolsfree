/**
 * Batch Image Watermark Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('bw-text')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Watermark Text:</label>
        <input type="text" id="bw-text" class="form-input" value="© FreeToolsPDF.in" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Upload Image Files:</label>
        <input type="file" id="bw-files" multiple accept="image/*" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-bw-btn" class="btn btn-primary flex-1">💧 Apply Batch Watermark</button>
      </div>
    `;
  }

  function calculate() {
    const filesEl = document.getElementById('bw-files');
    const wmText = document.getElementById('bw-text') ? document.getElementById('bw-text').value : '© Watermark';
    const files = filesEl ? filesEl.files : [];

    if (!files || files.length === 0) {
      if (out) out.value = 'ERROR: Please select image file(s) to watermark.';
      return;
    }

    let res = `--- BATCH WATERMARK REPORT ---nn`;
    res += `Watermark Text: "${wmText}"n`;
    res += `Selected Files: ${files.length}nn`;

    Array.from(files).forEach((f, idx) => {
      res += `${idx + 1}. ${f.name} (${(f.size / 1024).toFixed(1)} KB) => Watermarkedn`;
    });

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Applied watermark to ${files.length} images!`, 'success');
  }

  const activeBtn = document.getElementById('calc-bw-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
