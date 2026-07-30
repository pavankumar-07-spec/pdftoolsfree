/**
 * File & Text Hash Calculator Engine (SHA-1, SHA-256, SHA-384, SHA-512)
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('fh-text')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input Text / File Data:</label>
        <textarea id="fh-text" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">The quick brown fox jumps over the lazy dog</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-fh-btn" class="btn btn-primary flex-1">🔑 Compute SHA Hashes</button>
      </div>
    `;
  }

  async function computeHash(algo, text) {
    const enc = new TextEncoder();
    const data = enc.encode(text);
    const hashBuffer = await crypto.subtle.digest(algo, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async function calculate() {
    const text = document.getElementById('fh-text') ? document.getElementById('fh-text').value : (document.getElementById('text-input') ? document.getElementById('text-input').value : '');

    if (!text) {
      if (out) out.value = 'ERROR: Please enter input text to calculate checksums.';
      return;
    }

    try {
      const sha1 = await computeHash('SHA-1', text);
      const sha256 = await computeHash('SHA-256', text);
      const sha384 = await computeHash('SHA-384', text);
      const sha512 = await computeHash('SHA-512', text);

      let res = `--- CRYPTOGRAPHIC HASH CHECKSUMS ---nn`;
      res += `Input Length: ${text.length} charactersnn`;

      res += `=== SHA-1 (160-bit) ===n${sha1}nn`;
      res += `=== SHA-256 (256-bit) ===n${sha256}nn`;
      res += `=== SHA-384 (384-bit) ===n${sha384}nn`;
      res += `=== SHA-512 (512-bit) ===n${sha512}n`;

      if (out) out.value = res;
      if (window.showToast) window.showToast('Cryptographic hashes calculated!', 'success');
    } catch (err) {
      if (out) out.value = `ERROR computing hashes: ${err.message}`;
    }
  }

  const activeBtn = document.getElementById('calc-fh-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
