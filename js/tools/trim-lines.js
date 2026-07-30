/**
 * Trim Lines Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('tl-text')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input Text with Leading / Trailing Spaces:</label>
        <textarea id="tl-text" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">   Line 1 with spaces   n   Line 2 with spaces   n   Line 3 with spaces   </textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-tl-btn" class="btn btn-primary flex-1">✂️ Trim Line Spaces</button>
      </div>
    `;
  }

  function calculate() {
    const raw = (document.getElementById('tl-text')?.value || '').trim();

    if (!raw) { if (out) out.value = ''; return; }

    const trimmed = raw.split('n').map(line => line.trim()).join('n');

    if (out) out.value = trimmed;
    if (window.showToast) window.showToast('Lines trimmed!', 'success');
  }

  const activeBtn = document.getElementById('calc-tl-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
