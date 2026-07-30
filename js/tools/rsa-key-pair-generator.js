/**
 * RSA Key Pair Generator Engine (Alias & High-Security Variant)
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('rkp-bits')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">RSA Key Bit Length:</label>
        <select id="rkp-bits" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
          <option value="2048">2048-bit (Standard RSA)</option>
          <option value="4096">4096-bit (Ultra Secure)</option>
        </select>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-rkp-btn" class="btn btn-primary flex-1">🗝️ Generate Full RSA Key Pair</button>
      </div>
    `;
  }

  function arrayBufferToPem(buffer, label) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);
    const lines = base64.match(/.{1,64}/g) || [];
    return `-----BEGIN ${label}-----n${lines.join('n')}n-----END ${label}-----`;
  }

  async function calculate() {
    const bits = parseInt(document.getElementById('rkp-bits') ? document.getElementById('rkp-bits').value : 2048, 10) || 2048;

    if (out) out.value = `Generating ${bits}-bit RSA key pair... Please wait...`;

    try {
      const keyPair = await crypto.subtle.generateKey(
        {
          name: 'RSA-OAEP',
          modulusLength: bits,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: 'SHA-256'
        },
        true,
        ['encrypt', 'decrypt']
      );

      const pubBuf = await crypto.subtle.exportKey('spki', keyPair.publicKey);
      const privBuf = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

      const pubPem = arrayBufferToPem(pubBuf, 'PUBLIC KEY');
      const privPem = arrayBufferToPem(privBuf, 'PRIVATE KEY');

      let res = `--- RSA-OAEP KEY PAIR GENERATION REPORT (${bits}-BIT) ---nn`;
      res += `=== PUBLIC KEY (FOR ENCRYPTION) ===n${pubPem}nn`;
      res += `=== PRIVATE KEY (FOR DECRYPTION) ===n${privPem}n`;

      if (out) out.value = res;
      if (window.showToast) window.showToast('RSA Key Pair generated successfully!', 'success');
    } catch (err) {
      if (out) out.value = `ERROR generating RSA key pair: ${err.message}`;
    }
  }

  const activeBtn = document.getElementById('calc-rkp-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
