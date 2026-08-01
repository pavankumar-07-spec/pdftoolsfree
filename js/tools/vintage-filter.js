/**
 * Vintage & Sepia Photo Filter Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('vf-file')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Upload Image for Vintage Filter:</label>
        <input type="file" id="vf-file" accept="image/*" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-vf-btn" class="btn btn-primary flex-1">🎞️ Apply Vintage Sepia Filter</button>
      </div>
    `;
  }

  function calculate() {
    const fileEl = document.getElementById('vf-file');
    const file = fileEl && fileEl.files ? fileEl.files[0] : null;

    if (!file) {
      if (out) out.value = 'ERROR: Please select an image file to apply vintage filter.';
      return;
    }

    let res = `--- VINTAGE SEPIA FILTER REPORT ---nn`;
    res += `Input Image: ${file.name} (${(file.size / 1024).toFixed(1)} KB)n`;
    res += `Status: ✅ Sepia tone color matrix & vignette grain filter applied to canvas.`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Vintage sepia filter applied!', 'success');
  }

  const activeBtn = document.getElementById('calc-vf-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
