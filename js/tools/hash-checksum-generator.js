/**
 * Cryptographic Hash Checksum Generator Engine (Alias)
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('hcg-str')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input Text / String Payload:</label>
        <textarea id="hcg-str" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">FreeToolsPDF Cryptographic Hash Suite</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-hcg-btn" class="btn btn-primary flex-1">🔐 Generate Hashes</button>
      </div>
    `;
  }

  async function calculate() {
    const text = document.getElementById('hcg-str') ? document.getElementById('hcg-str').value : (document.getElementById('text-input') ? document.getElementById('text-input').value : '');

    if (!text) {
      if (out) out.value = 'ERROR: Please enter text.';
      return;
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    const sha256Buf = await crypto.subtle.digest('SHA-256', data);
    const sha512Buf = await crypto.subtle.digest('SHA-512', data);

    const sha256 = Array.from(new Uint8Array(sha256Buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    const sha512 = Array.from(new Uint8Array(sha512Buf)).map(b => b.toString(16).padStart(2, '0')).join('');

    let res = `--- CRYPTOGRAPHIC HASH GENERATOR ---nn`;
    res += `SHA-256: ${sha256}nn`;
    res += `SHA-512: ${sha512}n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Hashes generated!', 'success');
  }

  const activeBtn = document.getElementById('calc-hcg-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
