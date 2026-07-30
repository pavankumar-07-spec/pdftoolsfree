/**
 * AES-GCM Encryption & Decryption Engine (Web Crypto API)
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('ed-mode')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Operation Mode:</label>
        <select id="ed-mode" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
          <option value="encrypt">Encrypt Plaintext -> Ciphertext (AES-256-GCM)</option>
          <option value="decrypt">Decrypt Ciphertext -> Plaintext</option>
        </select>
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Secret Passphrase / Key:</label>
        <input type="password" id="ed-pass" class="form-input" value="MySuperSecretKey123" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input Text Content:</label>
        <textarea id="ed-text" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">Confidential message for client-side AES encryption.</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-ed-btn" class="btn btn-primary flex-1">🔐 Process Encryption / Decryption</button>
      </div>
    `;
  }

  async function getKey(passphrase, salt) {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(passphrase), 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  async function encryptText(plainText, passphrase) {
    const enc = new TextEncoder();
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await getKey(passphrase, salt);

    const encryptedContent = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(plainText));

    const combined = new Uint8Array(salt.length + iv.length + encryptedContent.byteLength);
    combined.set(salt, 0);
    combined.set(iv, salt.length);
    combined.set(new Uint8Array(encryptedContent), salt.length + iv.length);

    return btoa(String.fromCharCode(...combined));
  }

  async function decryptText(cipherTextBase64, passphrase) {
    const combined = new Uint8Array(atob(cipherTextBase64).split('').map(c => c.charCodeAt(0)));
    const salt = combined.slice(0, 16);
    const iv = combined.slice(16, 28);
    const data = combined.slice(28);

    const key = await getKey(passphrase, salt);
    const decryptedContent = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);

    const dec = new TextDecoder();
    return dec.decode(decryptedContent);
  }

  async function calculate() {
    const mode = document.getElementById('ed-mode') ? document.getElementById('ed-mode').value : 'encrypt';
    const pass = document.getElementById('ed-pass') ? document.getElementById('ed-pass').value : '';
    const text = document.getElementById('ed-text') ? document.getElementById('ed-text').value.trim() : '';

    if (!pass || !text) {
      if (out) out.value = 'ERROR: Please enter both passphrase and text content.';
      return;
    }

    try {
      if (mode === 'encrypt') {
        const cipherText = await encryptText(text, pass);
        let res = `--- AES-256-GCM ENCRYPTION RESULT ---nn`;
        res += `Status: 🔒 ENCRYPTED SUCCESSnn`;
        res += `=== CIPHERTEXT (BASE64 ENCODED) ===n`;
        res += `${cipherText}n`;
        if (out) out.value = res;
      } else {
        const plainText = await decryptText(text, pass);
        let res = `--- AES-256-GCM DECRYPTION RESULT ---nn`;
        res += `Status: 🔓 DECRYPTED SUCCESSnn`;
        res += `=== PLAINTEXT CONTENT ===n`;
        res += `${plainText}n`;
        if (out) out.value = res;
      }
      if (window.showToast) window.showToast('Crypto operation successful!', 'success');
    } catch (err) {
      if (out) out.value = `ERROR processing crypto operation:n${err.message}. (Check if secret key matches)`;
    }
  }

  const activeBtn = document.getElementById('calc-ed-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
