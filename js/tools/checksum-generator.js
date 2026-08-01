/**
 * Checksum Generator Engine (MD5, SHA-1, SHA-256)
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('cg-text')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input Text / Data:</label>
        <textarea id="cg-text" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">FreeToolsPDF Checksum Verification Payload</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-cg-btn" class="btn btn-primary flex-1">🔑 Compute Checksums</button>
      </div>
    `;
  }

  async function calculate() {
    const text = document.getElementById('cg-text') ? document.getElementById('cg-text').value : (document.getElementById('text-input') ? document.getElementById('text-input').value : '');

    if (!text) {
      if (out) out.value = 'ERROR: Please enter text.';
      return;
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    const sha1Buf = await crypto.subtle.digest('SHA-1', data);
    const sha256Buf = await crypto.subtle.digest('SHA-256', data);
    const sha512Buf = await crypto.subtle.digest('SHA-512', data);

    const sha1 = Array.from(new Uint8Array(sha1Buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    const sha256 = Array.from(new Uint8Array(sha256Buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    const sha512 = Array.from(new Uint8Array(sha512Buf)).map(b => b.toString(16).padStart(2, '0')).join('');

    let res = `--- CHECKSUM GENERATOR REPORT ---nn`;
    res += `Input Payload Length: ${data.length} bytesnn`;
    res += `SHA-1:   ${sha1}n`;
    res += `SHA-256: ${sha256}n`;
    res += `SHA-512: ${sha512}n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Checksums computed!', 'success');
  }

  const activeBtn = document.getElementById('calc-cg-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
