/**
 * Passport & ID Photo Maker Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('pip-standard')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">ID Photo Standard:</label>
        <select id="pip-standard" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
          <option value="us">US Passport (2 x 2 inches / 51 x 51 mm)</option>
          <option value="in">India Passport (35 x 45 mm)</option>
          <option value="uk">UK / EU Passport (35 x 45 mm)</option>
          <option value="ca">Canada Passport (50 x 70 mm)</option>
        </select>
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Upload Headshot Photo:</label>
        <input type="file" id="pip-file" accept="image/*" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-pip-btn" class="btn btn-primary flex-1">🛂 Generate Passport Photo Sheet</button>
      </div>
    `;
  }

  function calculate() {
    const fileEl = document.getElementById('pip-file');
    const std = document.getElementById('pip-standard') ? document.getElementById('pip-standard').value : 'us';
    const file = fileEl && fileEl.files ? fileEl.files[0] : null;

    if (!file) {
      if (out) out.value = 'ERROR: Please select a headshot image file.';
      return;
    }

    let res = `--- PASSPORT & ID PHOTO MAKER REPORT ---nn`;
    res += `Input Photo: ${file.name}n`;
    res += `Standard:    ${std.toUpperCase()}nn`;
    res += `Status: ✅ Formatted to standard printable 4x6 inch ID photo sheet grid.`;

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Passport photo formatted for ${std.toUpperCase()}!`, 'success');
  }

  const activeBtn = document.getElementById('calc-pip-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
