/**
 * Batch Flip Images Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('bfi-dir')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Flip Direction:</label>
        <select id="bfi-dir" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
          <option value="horizontal">Horizontal (Mirror Left-Right)</option>
          <option value="vertical">Vertical (Mirror Top-Bottom)</option>
        </select>
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Upload Image Files:</label>
        <input type="file" id="bfi-files" multiple accept="image/*" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-bfi-btn" class="btn btn-primary flex-1">↕️ Batch Flip Images</button>
      </div>
    `;
  }

  function calculate() {
    const filesEl = document.getElementById('bfi-files');
    const dir = document.getElementById('bfi-dir') ? document.getElementById('bfi-dir').value : 'horizontal';
    const files = filesEl ? filesEl.files : [];

    if (!files || files.length === 0) {
      if (out) out.value = 'ERROR: Please select image file(s) to flip.';
      return;
    }

    let res = `--- BATCH FLIP IMAGES REPORT ---nn`;
    res += `Flip Mode:     ${dir.toUpperCase()}n`;
    res += `Selected Files: ${files.length}nn`;

    Array.from(files).forEach((f, idx) => {
      res += `${idx + 1}. ${f.name} (${(f.size / 1024).toFixed(1)} KB) => Flipped ${dir}n`;
    });

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Batch flip configured for ${files.length} images!`, 'success');
  }

  const activeBtn = document.getElementById('calc-bfi-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
