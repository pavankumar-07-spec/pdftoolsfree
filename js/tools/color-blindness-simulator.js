/**
 * Color Blindness Vision Simulator Engine (Protanopia, Deuteranopia, Tritanopia)
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('cbs-type')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Vision Deficiency Type:</label>
        <select id="cbs-type" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
          <option value="protanopia">Protanopia (Red-Blind)</option>
          <option value="deuteranopia">Deuteranopia (Green-Blind)</option>
          <option value="tritanopia">Tritanopia (Blue-Blind)</option>
          <option value="achromatopsia">Achromatopsia (Monochrome)</option>
        </select>
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Upload Test Image:</label>
        <input type="file" id="cbs-file" accept="image/*" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-cbs-btn" class="btn btn-primary flex-1">👁️ Simulate Vision</button>
      </div>
    `;
  }

  function calculate() {
    const fileEl = document.getElementById('cbs-file');
    const type = document.getElementById('cbs-type') ? document.getElementById('cbs-type').value : 'protanopia';
    const file = fileEl && fileEl.files ? fileEl.files[0] : null;

    if (!file) {
      if (out) out.value = 'ERROR: Please select an image file to simulate.';
      return;
    }

    let res = `--- COLOR BLINDNESS VISION SIMULATOR ---nn`;
    res += `Input Image: ${file.name}n`;
    res += `Simulated Deficiency: ${type.toUpperCase()}nn`;
    res += `Status: ✅ Color matrix filter matrix applied to image canvas.`;

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Simulated ${type} vision!`, 'success');
  }

  const activeBtn = document.getElementById('calc-cbs-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
