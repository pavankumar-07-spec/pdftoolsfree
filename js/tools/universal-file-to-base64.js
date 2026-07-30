/**
 * Universal File to Base64 Encoder Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('ufb-file')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Upload Any File to Encode to Base64:</label>
        <input type="file" id="ufb-file" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-ufb-btn" class="btn btn-primary flex-1">⚡ Encode File to Base64</button>
      </div>
    `;
  }

  function calculate() {
    const fileEl = document.getElementById('ufb-file');
    const file = fileEl && fileEl.files ? fileEl.files[0] : null;

    if (!file) {
      if (out) out.value = 'ERROR: Please select a file to encode.';
      return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
      const b64Data = e.target.result;
      let res = `--- UNIVERSAL BASE64 ENCODER REPORT ---nn`;
      res += `File Name: ${file.name}n`;
      res += `File Size: ${(file.size / 1024).toFixed(1)} KB (${file.size} bytes)n`;
      res += `MIME Type: ${file.type || 'application/octet-stream'}nn`;
      res += `=== BASE64 DATA URI ===n${b64Data}n`;

      if (out) out.value = res;
      if (window.showToast) window.showToast('File encoded to Base64!', 'success');
    };
    reader.readAsDataURL(file);
  }

  const activeBtn = document.getElementById('calc-ufb-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
