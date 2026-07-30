/**
 * Add Prefix/Suffix to Lines Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('ps-text')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input Text (one item per line):</label>
        <textarea id="ps-text" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">applenbananancherry</textarea>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Prefix to add:</label>
          <input type="text" id="ps-prefix" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value='"'>
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Suffix to add:</label>
          <input type="text" id="ps-suffix" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value='",'>
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-ps-btn" class="btn btn-primary flex-1">✏️ Add Prefix & Suffix</button>
      </div>
    `;
  }

  function calculate() {
    const raw = (document.getElementById('ps-text')?.value || '').trim();
    const prefix = document.getElementById('ps-prefix')?.value || '';
    const suffix = document.getElementById('ps-suffix')?.value || '';

    if (!raw) { if (out) out.value = ''; return; }

    const lines = raw.split('n').map(line => `${prefix}${line}${suffix}`);
    const res = lines.join('n');

    if (out) out.value = res;
    if (window.showToast) window.showToast('Prefix & suffix added!', 'success');
  }

  const activeBtn = document.getElementById('calc-ps-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
