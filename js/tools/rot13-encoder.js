/**
 * ROT13 Cipher Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('rot-src')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input Text:</label>
        <textarea id="rot-src" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">Hello World!</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-rot-btn" class="btn btn-primary flex-1">🔄 Encode / Decode ROT13</button>
      </div>
    `;
  }

  function rot13(str) {
    return str.replace(/[a-zA-Z]/g, c => {
      const base = c <= 'Z' ? 65 : 97;
      return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
    });
  }

  function calculate() {
    const raw = (document.getElementById('rot-src')?.value || '').trim();

    if (!raw) { if (out) out.value = ''; return; }

    const res = '--- ROT13 CIPHER RESULT ---nn' + rot13(raw);

    if (out) out.value = res;
    if (window.showToast) window.showToast('ROT13 processed!', 'success');
  }

  const activeBtn = document.getElementById('calc-rot-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
