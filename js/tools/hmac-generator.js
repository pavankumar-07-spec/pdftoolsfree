/**
 * HMAC (Hash-based Message Authentication Code) Generator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('hm-msg')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Secret Key:</label>
        <input type="text" id="hm-key" class="form-input" value="SecretHMACKey123" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Message String:</label>
        <textarea id="hm-msg" class="form-input" style="width:100%;height:90px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">Message payload requiring HMAC signature verification.</textarea>
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Hash Algorithm:</label>
        <select id="hm-algo" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
          <option value="SHA-256">HMAC-SHA256</option>
          <option value="SHA-512">HMAC-SHA512</option>
          <option value="SHA-1">HMAC-SHA1</option>
        </select>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-hm-btn" class="btn btn-primary flex-1">🔐 Compute HMAC Signature</button>
      </div>
    `;
  }

  async function calculateHMAC(keyStr, msgStr, algoName) {
    const enc = new TextEncoder();
    const keyData = enc.encode(keyStr);
    const msgData = enc.encode(msgStr);

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: algoName },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', cryptoKey, msgData);
    const hashArray = Array.from(new Uint8Array(signature));
    const hex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    const base64 = btoa(String.fromCharCode(...hashArray));

    return { hex, base64 };
  }

  async function calculate() {
    const keyStr = document.getElementById('hm-key') ? document.getElementById('hm-key').value : '';
    const msgStr = document.getElementById('hm-msg') ? document.getElementById('hm-msg').value : '';
    const algoName = document.getElementById('hm-algo') ? document.getElementById('hm-algo').value : 'SHA-256';

    if (!keyStr || !msgStr) {
      if (out) out.value = 'ERROR: Please enter both secret key and message.';
      return;
    }

    try {
      const { hex, base64 } = await calculateHMAC(keyStr, msgStr, algoName);

      let res = `--- HMAC SIGNATURE RESULTS ---nn`;
      res += `Algorithm:  ${algoName}n`;
      res += `Secret Key: "${keyStr}"nn`;

      res += `=== HMAC HEX ENCODED SIGNATURE ===n`;
      res += `${hex}nn`;

      res += `=== HMAC BASE64 ENCODED SIGNATURE ===n`;
      res += `${base64}n`;

      if (out) out.value = res;
      if (window.showToast) window.showToast('HMAC signature generated!', 'success');
    } catch (err) {
      if (out) out.value = `ERROR generating HMAC: ${err.message}`;
    }
  }

  const activeBtn = document.getElementById('calc-hm-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
