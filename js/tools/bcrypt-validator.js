/**
 * Bcrypt Hash Validator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('bv-hash')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Bcrypt Hash String:</label>
        <input type="text" id="bv-hash" class="form-input" value="$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy" style="width:100%;padding:0.5rem;font-family:monospace;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-bv-btn" class="btn btn-primary flex-1">🔍 Validate Bcrypt Format</button>
      </div>
    `;
  }

  function validateBcrypt(hashStr) {
    const regex = /^$(2a|2b|2y)$(d{2})$([A-Za-z0-9./]{53})$/;
    const match = hashStr.match(regex);

    if (!match) {
      return { valid: false, error: 'Invalid format. A valid Bcrypt hash must match regex ^$(2a|2b|2y)$(d{2})$([A-Za-z0-9./]{53})$' };
    }

    const algo = match[1];
    const cost = parseInt(match[2], 10);
    const body = match[3];
    const salt = body.slice(0, 22);
    const hash = body.slice(22);

    return {
      valid: true,
      algo: `$${algo}$`,
      cost,
      iterations: Math.pow(2, cost),
      salt,
      hash,
      totalLength: hashStr.length
    };
  }

  function calculate() {
    const hashStr = document.getElementById('bv-hash') ? document.getElementById('bv-hash').value.trim() : '';

    if (!hashStr) {
      if (out) out.value = 'ERROR: Please enter a bcrypt hash to validate.';
      return;
    }

    const result = validateBcrypt(hashStr);

    let res = `--- BCRYPT HASH VALIDATION REPORT ---nn`;
    res += `Input Hash: ${hashStr}nn`;

    if (!result.valid) {
      res += `Status: ❌ INVALID BCRYPT HASHn`;
      res += `Reason: ${result.error}n`;
    } else {
      res += `Status: ✅ VALID BCRYPT HASHnn`;
      res += `=== STRUCTURE ANALYSIS ===n`;
      res += `• Algorithm Version: ${result.algo}n`;
      res += `• Cost Factor:        ${result.cost} (${result.iterations.toLocaleString()} rounds)n`;
      res += `• Salt String (22ch): ${result.salt}n`;
      res += `• Hash Digest (31ch): ${result.hash}n`;
      res += `• Total Character Len:${result.totalLength} charsn`;
    }

    if (out) out.value = res;
    if (window.showToast) window.showToast(result.valid ? 'Bcrypt hash is valid!' : 'Invalid bcrypt hash format', result.valid ? 'success' : 'error');
  }

  const activeBtn = document.getElementById('calc-bv-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
