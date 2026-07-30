/**
 * UUID Validator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('uuid-src')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Enter UUID String:</label>
        <input type="text" id="uuid-src" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="123e4567-e89b-12d3-a456-426614174000">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-uuid-btn" class="btn btn-primary flex-1">✔️ Validate UUID</button>
      </div>
    `;
  }

  function calculate() {
    const raw = (document.getElementById('uuid-src')?.value || '').trim();

    if (!raw) { if (out) out.value = ''; return; }

    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
    const isValid = uuidRegex.test(raw);

    let version = 'Unknown';
    if (isValid) {
      version = raw.charAt(14);
    }

    let res = '--- UUID VALIDATION REPORT ---nn';
    res += `Input UUID: "${raw}"nn`;
    if (isValid) {
      res += `Status: ✅ VALID UUIDn`;
      res += `UUID Version: Version ${version}n`;
    } else {
      res += `Status: ❌ INVALID UUIDn`;
      res += `Reason: UUID does not conform to RFC 4122 format (8-4-4-4-12 hex digits).n`;
    }

    if (out) out.value = res;
    if (window.showToast) window.showToast(isValid ? 'UUID is valid!' : 'Invalid UUID format', isValid ? 'success' : 'error');
  }

  const activeBtn = document.getElementById('calc-uuid-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
