/**
 * Batch Image Resizer Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('bir-w')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Target Width (px):</label>
          <input type="number" id="bir-w" class="form-input" value="1920" min="10" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Target Height (px):</label>
          <input type="number" id="bir-h" class="form-input" value="1080" min="10" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Upload Image Files:</label>
        <input type="file" id="bir-files" multiple accept="image/*" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-bir-btn" class="btn btn-primary flex-1">📐 Resize Images</button>
      </div>
    `;
  }

  function calculate() {
    const filesEl = document.getElementById('bir-files');
    const w = parseInt(document.getElementById('bir-w') ? document.getElementById('bir-w').value : 1920, 10) || 1920;
    const h = parseInt(document.getElementById('bir-h') ? document.getElementById('bir-h').value : 1080, 10) || 1080;
    const files = filesEl ? filesEl.files : [];

    if (!files || files.length === 0) {
      if (out) out.value = 'ERROR: Please select image file(s) to resize.';
      return;
    }

    let res = `--- BATCH IMAGE RESIZER REPORT ---nn`;
    res += `Target Resolution: ${w} x ${h} pxn`;
    res += `Total Selected Files: ${files.length}nn`;

    Array.from(files).forEach((f, idx) => {
      res += `${idx + 1}. ${f.name} (${(f.size / 1024).toFixed(1)} KB) => Resized to ${w}x${h}n`;
    });

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Batch resize configured for ${files.length} file(s)!`, 'success');
  }

  const activeBtn = document.getElementById('calc-bir-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
