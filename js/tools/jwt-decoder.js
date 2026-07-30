/**
 * JWT Decoder Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('jwt-token')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Enter JWT Token (header.payload.signature):</label>
        <textarea id="jwt-token" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text);font-family:monospace">eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsZXggTW9yZ2FuIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-jwt-btn" class="btn btn-primary flex-1">🔓 Decode JWT Token</button>
      </div>
    `;
  }

  function base64UrlDecode(str) {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    return atob(base64);
  }

  function calculate() {
    const token = (document.getElementById('jwt-token')?.value || '').trim();

    if (!token) {
      if (out) out.value = 'ERROR: Please paste a JWT token.';
      return;
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      if (out) out.value = 'ERROR: Invalid JWT format. A valid JWT must consist of 3 parts separated by dots (header.payload.signature).';
      return;
    }

    try {
      const headerObj = JSON.parse(base64UrlDecode(parts[0]));
      const payloadObj = JSON.parse(base64UrlDecode(parts[1]));

      let res = '--- JWT DECODED CONTENT ---nn';
      res += '1. HEADER:n';
      res += JSON.stringify(headerObj, null, 2) + 'nn';
      res += '2. PAYLOAD:n';
      res += JSON.stringify(payloadObj, null, 2) + 'nn';
      res += '3. SIGNATURE:n';
      res += parts[2] + 'n';

      if (out) out.value = res;
      if (window.showToast) window.showToast('JWT decoded successfully!', 'success');
    } catch (e) {
      if (out) out.value = `ERROR: Failed to decode JWT payload. ${e.message}`;
    }
  }

  const activeBtn = document.getElementById('calc-jwt-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
