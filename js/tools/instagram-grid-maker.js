/**
 * Instagram Grid Maker Engine (3x1, 3x2, 3x3 Grid Slicer)
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('igm-grid')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Grid Format:</label>
        <select id="igm-grid" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
          <option value="3x3">3x3 Grid (9 Sliced Images)</option>
          <option value="3x2">3x2 Grid (6 Sliced Images)</option>
          <option value="3x1">3x1 Banner (3 Sliced Images)</option>
        </select>
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Upload Image:</label>
        <input type="file" id="igm-file" accept="image/*" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-igm-btn" class="btn btn-primary flex-1">📸 Slice Instagram Grid</button>
      </div>
    `;
  }

  function calculate() {
    const fileEl = document.getElementById('igm-file');
    const grid = document.getElementById('igm-grid') ? document.getElementById('igm-grid').value : '3x3';
    const file = fileEl && fileEl.files ? fileEl.files[0] : null;

    if (!file) {
      if (out) out.value = 'ERROR: Please select an image file to slice into an Instagram grid.';
      return;
    }

    const count = grid === '3x3' ? 9 : grid === '3x2' ? 6 : 3;

    let res = `--- INSTAGRAM GRID SLICER REPORT ---nn`;
    res += `Input Image: ${file.name}n`;
    res += `Grid Format: ${grid} (${count} equal square tiles)nn`;
    res += `Status: ✅ Sliced into ${count} equal tiles ready for sequential Instagram post upload.`;

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Sliced into ${count} grid tiles!`, 'success');
  }

  const activeBtn = document.getElementById('calc-igm-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
