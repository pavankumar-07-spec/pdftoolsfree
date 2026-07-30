/**
 * PBKDF2 (Password-Based Key Derivation Function 2) Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('pb-pwd')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Password / Secret Text:</label>
        <input type="text" id="pb-pwd" class="form-input" value="MyMasterPassword123" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Salt String:</label>
          <input type="text" id="pb-salt" class="form-input" value="UniqueSaltValue321" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Iterations Count:</label>
          <input type="number" id="pb-iters" class="form-input" value="10000" min="1000" max="500000" step="1000" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Hash Algorithm:</label>
          <select id="pb-algo" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
            <option value="SHA-256">SHA-256</option>
            <option value="SHA-512">SHA-512</option>
            <option value="SHA-1">SHA-1</option>
          </select>
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Key Length (Bits):</label>
          <select id="pb-keylen" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
            <option value="256">256 bits (32 bytes)</option>
            <option value="512">512 bits (64 bytes)</option>
            <option value="128">128 bits (16 bytes)</option>
          </select>
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-pb-btn" class="btn btn-primary flex-1">🔐 Derive PBKDF2 Key</button>
      </div>
    `;
  }

  async function calculatePBKDF2(pwd, salt, iterations, algo, keyBits) {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(pwd), 'PBKDF2', false, ['deriveBits']);

    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: enc.encode(salt),
        iterations: iterations,
        hash: algo
      },
      keyMaterial,
      keyBits
    );

    const hashArray = Array.from(new Uint8Array(derivedBits));
    const hex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    const base64 = btoa(String.fromCharCode(...hashArray));

    return { hex, base64 };
  }

  async function calculate() {
    const pwd = document.getElementById('pb-pwd') ? document.getElementById('pb-pwd').value : '';
    const salt = document.getElementById('pb-salt') ? document.getElementById('pb-salt').value : '';
    const iters = parseInt(document.getElementById('pb-iters') ? document.getElementById('pb-iters').value : 10000, 10) || 10000;
    const algo = document.getElementById('pb-algo') ? document.getElementById('pb-algo').value : 'SHA-256';
    const keyBits = parseInt(document.getElementById('pb-keylen') ? document.getElementById('pb-keylen').value : 256, 10) || 256;

    if (!pwd || !salt) {
      if (out) out.value = 'ERROR: Please enter both password and salt.';
      return;
    }

    try {
      const { hex, base64 } = await calculatePBKDF2(pwd, salt, iters, algo, keyBits);

      let res = `--- PBKDF2 DERIVED CRYPTOGRAPHIC KEY ---nn`;
      res += `Algorithm:   PBKDF2-${algo}n`;
      res += `Iterations:  ${iters.toLocaleString()}n`;
      res += `Derived Len: ${keyBits} bits (${keyBits / 8} bytes)nn`;

      res += `=== DERIVED KEY (HEX) ===n${hex}nn`;
      res += `=== DERIVED KEY (BASE64) ===n${base64}n`;

      if (out) out.value = res;
      if (window.showToast) window.showToast('PBKDF2 key derived successfully!', 'success');
    } catch (err) {
      if (out) out.value = `ERROR deriving PBKDF2 key: ${err.message}`;
    }
  }

  const activeBtn = document.getElementById('calc-pb-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
