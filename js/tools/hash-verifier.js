/**
 * Cryptographic Hash Verifier Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('hv-text')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Original Text / Data:</label>
        <textarea id="hv-text" class="form-input" style="width:100%;height:80px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">FreeToolsPDF Privacy Guarantee</textarea>
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Expected Hash String (SHA-256):</label>
        <input type="text" id="hv-expected" class="form-input" placeholder="Paste expected SHA-256 hash here..." style="width:100%;padding:0.5rem;font-family:monospace;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-hv-btn" class="btn btn-primary flex-1">✔️ Verify Hash Match</button>
      </div>
    `;
  }

  async function calculate() {
    const text = document.getElementById('hv-text') ? document.getElementById('hv-text').value : '';
    const expected = document.getElementById('hv-expected') ? document.getElementById('hv-expected').value.trim().toLowerCase() : '';

    if (!text || !expected) {
      if (out) out.value = 'ERROR: Please enter both original text and expected hash.';
      return;
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const buf = await crypto.subtle.digest('SHA-256', data);
    const computed = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('').toLowerCase();

    const match = computed === expected;

    let res = `--- HASH VERIFIER REPORT ---nn`;
    res += `Computed SHA-256: ${computed}n`;
    res += `Expected SHA-256: ${expected}nn`;
    res += `=== VERIFICATION RESULT ===n`;
    res += match ? `✅ MATCH CONFIRMED: Data integrity verified.` : `❌ MISMATCH: Hash strings do not match! Data may be altered.`;

    if (out) out.value = res;
    if (window.showToast) window.showToast(match ? 'Hash Verified!' : 'Hash Mismatch!', match ? 'success' : 'info');
  }

  const activeBtn = document.getElementById('calc-hv-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
