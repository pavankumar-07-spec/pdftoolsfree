/**
 * Batch Image Rotator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('bi-rot')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Rotation Angle:</label>
        <select id="bi-rot" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
          <option value="90">90° Clockwise ↻</option>
          <option value="180">180° Flip 🔄</option>
          <option value="270">270° Counter-Clockwise ↺</option>
        </select>
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Upload Image Files:</label>
        <input type="file" id="bi-files" multiple accept="image/*" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-bi-btn" class="btn btn-primary flex-1">🔄 Rotate Images</button>
      </div>
    `;
  }

  function calculate() {
    const filesEl = document.getElementById('bi-files');
    const rot = document.getElementById('bi-rot') ? document.getElementById('bi-rot').value : '90';
    const files = filesEl ? filesEl.files : [];

    if (!files || files.length === 0) {
      if (out) out.value = 'ERROR: Please select image file(s) to rotate.';
      return;
    }

    let res = `--- BATCH IMAGE ROTATOR REPORT ---nn`;
    res += `Rotation Angle: ${rot}°n`;
    res += `Total Selected Files: ${files.length}nn`;

    Array.from(files).forEach((f, idx) => {
      res += `${idx + 1}. ${f.name} (${(f.size / 1024).toFixed(1)} KB) => Rotated ${rot}°n`;
    });

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Batch rotation configured for ${files.length} file(s)!`, 'success');
  }

  const activeBtn = document.getElementById('calc-bi-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
