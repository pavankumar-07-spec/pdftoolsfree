/**
 * Batch Image Rename Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('bri-prefix')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Base Filename Prefix:</label>
          <input type="text" id="bri-prefix" class="form-input" value="vacation_photo" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Start Index Number:</label>
          <input type="number" id="bri-start" class="form-input" value="1" min="1" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Upload Image Files:</label>
        <input type="file" id="bri-files" multiple accept="image/*" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-bri-btn" class="btn btn-primary flex-1">✏️ Batch Rename Images</button>
      </div>
    `;
  }

  function calculate() {
    const filesEl = document.getElementById('bri-files');
    const prefix = document.getElementById('bri-prefix') ? document.getElementById('bri-prefix').value : 'image';
    const startIdx = parseInt(document.getElementById('bri-start') ? document.getElementById('bri-start').value : 1, 10) || 1;
    const files = filesEl ? filesEl.files : [];

    if (!files || files.length === 0) {
      if (out) out.value = 'ERROR: Please select image file(s) to rename.';
      return;
    }

    let res = `--- BATCH RENAME IMAGES REPORT ---nn`;
    res += `Prefix Pattern: "${prefix}"n`;
    res += `Selected Files: ${files.length}nn`;

    Array.from(files).forEach((f, idx) => {
      const ext = f.name.split('.').pop() || 'jpg';
      const newName = `${prefix}_${(startIdx + idx).toString().padStart(3, '0')}.${ext}`;
      res += `${idx + 1}. ${f.name} => ${newName}n`;
    });

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Renamed ${files.length} images!`, 'success');
  }

  const activeBtn = document.getElementById('calc-bri-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
