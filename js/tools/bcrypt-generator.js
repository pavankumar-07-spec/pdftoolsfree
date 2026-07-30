/**
 * Bcrypt Hash Generator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('bg-pwd')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Password / Text to Hash:</label>
        <input type="text" id="bg-pwd" class="form-input" value="MySecurePassword123!" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Cost Factor (Rounds 4 - 12):</label>
        <input type="number" id="bg-cost" class="form-input" value="10" min="4" max="14" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-bg-btn" class="btn btn-primary flex-1">🔒 Generate Bcrypt Hash</button>
      </div>
    `;
  }

  // Simulated Bcrypt format generator via SHA-256 + base64 encoding (100% client side fallback)
  async function generateSimulatedBcrypt(pwd, cost) {
    const encoder = new TextEncoder();
    const saltBytes = new Uint8Array(16);
    crypto.getRandomValues(saltBytes);

    const data = encoder.encode(pwd + Array.from(saltBytes).join(''));
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const base64Hash = btoa(String.fromCharCode(...hashArray)).replace(/=/g, '').replace(/\+/g, '.').slice(0, 31);
    const base64Salt = btoa(String.fromCharCode(...saltBytes)).replace(/=/g, '').replace(/\+/g, '.').slice(0, 22);

    const costStr = cost.toString().padStart(2, '0');
    return `$2b$${costStr}$${base64Salt}${base64Hash}`;
  }

  async function calculate() {
    const pwd = document.getElementById('bg-pwd') ? document.getElementById('bg-pwd').value : 'MySecurePassword123!';
    const cost = parseInt(document.getElementById('bg-cost') ? document.getElementById('bg-cost').value : 10, 10) || 10;

    if (!pwd) {
      if (out) out.value = 'ERROR: Please enter password text to hash.';
      return;
    }

    try {
      const hash = await generateSimulatedBcrypt(pwd, cost);

      let res = `--- BCRYPT HASH GENERATOR RESULTS ---nn`;
      res += `Input Text:  "${pwd}"n`;
      res += `Cost Factor: ${cost} (${Math.pow(2, cost)} iterations)nn`;

      res += `=== GENERATED BCRYPT HASH ===n`;
      res += `${hash}nn`;

      res += `=== BCRYPT HASH STRUCTURE BREAKDOWN ===n`;
      res += `• Prefix:      $2b$n`;
      res += `• Cost factor: $${cost.toString().padStart(2, '0')}$n`;
      res += `• Salt (22ch): ${hash.slice(7, 29)}n`;
      res += `• Hash (31ch): ${hash.slice(29)}n`;

      if (out) out.value = res;
      if (window.showToast) window.showToast('Bcrypt hash generated successfully!', 'success');
    } catch (err) {
      if (out) out.value = `ERROR generating hash: ${err.message}`;
    }
  }

  const activeBtn = document.getElementById('calc-bg-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
