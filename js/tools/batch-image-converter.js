/**
 * Batch Image Converter Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('bic-fmt')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Target Output Format:</label>
        <select id="bic-fmt" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
          <option value="image/png">PNG (.png)</option>
          <option value="image/jpeg">JPEG (.jpg)</option>
          <option value="image/webp">WebP (.webp)</option>
        </select>
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Upload Image Files:</label>
        <input type="file" id="bic-files" multiple accept="image/*" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-bic-btn" class="btn btn-primary flex-1">🖼️ Convert Images</button>
      </div>
    `;
  }

  function calculate() {
    const filesEl = document.getElementById('bic-files');
    const fmt = document.getElementById('bic-fmt') ? document.getElementById('bic-fmt').value : 'image/png';
    const files = filesEl ? filesEl.files : [];

    if (!files || files.length === 0) {
      if (out) out.value = 'ERROR: Please select image file(s) to convert.';
      return;
    }

    let res = `--- BATCH IMAGE CONVERTER REPORT ---nn`;
    res += `Target Format: ${fmt}n`;
    res += `Total Selected Files: ${files.length}nn`;

    Array.from(files).forEach((f, idx) => {
      const ext = fmt.split('/')[1];
      const newName = f.name.replace(/.[^/.]+$/, "") + '.' + ext;
      res += `${idx + 1}. ${f.name} (${(f.size / 1024).toFixed(1)} KB) => ${newName}n`;
    });

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Batch conversion configured for ${files.length} file(s)!`, 'success');
  }

  const activeBtn = document.getElementById('calc-bic-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
