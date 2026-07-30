/**
 * File Checksum & Hash Calculator Engine (Web Crypto API)
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('fcc-file')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Upload Any File to Compute Hash:</label>
        <input type="file" id="fcc-file" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-fcc-btn" class="btn btn-primary flex-1">🔐 Compute File Digest</button>
      </div>
    `;
  }

  async function calculate() {
    const fileEl = document.getElementById('fcc-file');
    const file = fileEl && fileEl.files ? fileEl.files[0] : null;

    if (!file) {
      if (out) out.value = 'ERROR: Please select a file to compute checksum.';
      return;
    }

    const arrayBuffer = await file.arrayBuffer();

    const sha1Buf = await crypto.subtle.digest('SHA-1', arrayBuffer);
    const sha256Buf = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const sha512Buf = await crypto.subtle.digest('SHA-512', arrayBuffer);

    const sha1 = Array.from(new Uint8Array(sha1Buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    const sha256 = Array.from(new Uint8Array(sha256Buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    const sha512 = Array.from(new Uint8Array(sha512Buf)).map(b => b.toString(16).padStart(2, '0')).join('');

    let res = `--- FILE CHECKSUM CALCULATOR REPORT ---nn`;
    res += `File Name: ${file.name}n`;
    res += `File Size: ${(file.size / 1024).toFixed(1)} KB (${file.size} bytes)nn`;
    res += `=== CRYPTOGRAPHIC DIGESTS ===n`;
    res += `SHA-1:   ${sha1}n`;
    res += `SHA-256: ${sha256}n`;
    res += `SHA-512: ${sha512}n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('File checksum calculated!', 'success');
  }

  const activeBtn = document.getElementById('calc-fcc-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
