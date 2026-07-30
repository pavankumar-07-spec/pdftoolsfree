/**
 * Reverse Words Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('rw-text')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input Text:</label>
        <textarea id="rw-text" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">The quick brown fox jumps over the lazy dog</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-rw-btn" class="btn btn-primary flex-1">🔄 Reverse Words</button>
      </div>
    `;
  }

  function calculate() {
    const raw = (document.getElementById('rw-text')?.value || '').trim();

    if (!raw) { if (out) out.value = ''; return; }

    const reversed = raw.split(/s+/).reverse().join(' ');

    if (out) out.value = reversed;
    if (window.showToast) window.showToast('Words reversed!', 'success');
  }

  const activeBtn = document.getElementById('calc-rw-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
