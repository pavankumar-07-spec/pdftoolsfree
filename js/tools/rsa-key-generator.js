/**
 * RSA Key Generator Engine (Web Crypto API)
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('rk-modulus')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Key Length (Modulus):</label>
          <select id="rk-modulus" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
            <option value="2048">2048-bit (Standard Security)</option>
            <option value="4096">4096-bit (High Security)</option>
            <option value="1024">1024-bit (Legacy / Testing)</option>
          </select>
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Hash Algorithm:</label>
          <select id="rk-hash" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
            <option value="SHA-256">SHA-256</option>
            <option value="SHA-512">SHA-512</option>
          </select>
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-rk-btn" class="btn btn-primary flex-1">🗝️ Generate RSA Key Pair</button>
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

  async function generateRSAKeys(modulusLength, hashAlgo) {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: 'RSASSA-PKCS1-v1_5',
        modulusLength: modulusLength,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: hashAlgo
      },
      true,
      ['sign', 'verify']
    );

    const publicKeyBuffer = await crypto.subtle.exportKey('spki', keyPair.publicKey);
    const privateKeyBuffer = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

    const publicKeyPem = arrayBufferToPem(publicKeyBuffer, 'PUBLIC KEY');
    const privateKeyPem = arrayBufferToPem(privateKeyBuffer, 'PRIVATE KEY');

    return { publicKeyPem, privateKeyPem };
  }

  async function calculate() {
    const modulus = parseInt(document.getElementById('rk-modulus') ? document.getElementById('rk-modulus').value : 2048, 10) || 2048;
    const hash = document.getElementById('rk-hash') ? document.getElementById('rk-hash').value : 'SHA-256';

    if (out) out.value = `Generating ${modulus}-bit RSA key pair in browser... Please wait...`;

    try {
      const { publicKeyPem, privateKeyPem } = await generateRSAKeys(modulus, hash);

      let res = `--- RSA KEY PAIR GENERATOR (${modulus}-BIT) ---nn`;
      res += `=== PUBLIC KEY (SPKI PEM) ===n${publicKeyPem}nn`;
      res += `=== PRIVATE KEY (PKCS#8 PEM) ===n${privateKeyPem}n`;

      if (out) out.value = res;
      if (window.showToast) window.showToast('RSA Key Pair generated!', 'success');
    } catch (err) {
      if (out) out.value = `ERROR generating RSA keys: ${err.message}`;
    }
  }

  const activeBtn = document.getElementById('calc-rk-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
