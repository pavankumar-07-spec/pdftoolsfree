/**
 * HTML Encoder Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('he-src')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Enter Plain / HTML Text to Encode:</label>
        <textarea id="he-src" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)"><script>alert("Hello & Welcome!");</script></textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-he-btn" class="btn btn-primary flex-1">🔒 Encode HTML Entities</button>
      </div>
    `;
  }

  function calculate() {
    const raw = (document.getElementById('he-src')?.value || '').trim();

    if (!raw) { if (out) out.value = ''; return; }

    const encoded = raw.replace(/[u00A0-u9999<>&"']/g, i => `&#${i.charCodeAt(0)};`);

    let res = '--- HTML ENCODED OUTPUT ---nn';
    res += encoded;

    if (out) out.value = res;
    if (window.showToast) window.showToast('HTML entities encoded!', 'success');
  }

  const activeBtn = document.getElementById('calc-he-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
