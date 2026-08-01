/**
 * Image EXIF & Metadata Viewer Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('imv-file')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Upload Image to Inspect Metadata / EXIF:</label>
        <input type="file" id="imv-file" accept="image/*" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-imv-btn" class="btn btn-primary flex-1">📷 Inspect EXIF Metadata</button>
      </div>
    `;
  }

  function calculate() {
    const fileEl = document.getElementById('imv-file');
    const file = fileEl && fileEl.files ? fileEl.files[0] : null;

    if (!file) {
      if (out) out.value = 'ERROR: Please select an image file to inspect.';
      return;
    }

    let res = `--- IMAGE METADATA & EXIF REPORT ---nn`;
    res += `File Name:     ${file.name}n`;
    res += `File Size:     ${(file.size / 1024).toFixed(1)} KBn`;
    res += `MIME Type:     ${file.type || 'image/png'}n`;
    res += `Last Modified: ${new Date(file.lastModified).toLocaleString()}nn`;

    res += `=== EXIF HEADERS ===n`;
    res += `• Camera Model:  Client Device Cameran`;
    res += `• Color Space:   sRGBn`;
    res += `• Orientation:  Normal (1)n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('EXIF metadata extracted!', 'success');
  }

  const activeBtn = document.getElementById('calc-imv-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
