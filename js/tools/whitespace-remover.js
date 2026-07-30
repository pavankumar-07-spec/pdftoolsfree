/**
 * Whitespace Remover Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('ws-text')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input Text:</label>
        <textarea id="ws-text" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">The   quick   brown    fox   jumps  over   the  lazy   dog</textarea>
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Removal Mode:</label>
        <select id="ws-mode" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
          <option value="single" selected>Collapse multiple spaces to 1 space</option>
          <option value="all">Remove ALL spaces & whitespace entirely</option>
          <option value="newlines">Remove all newlines / line breaks</option>
        </select>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-ws-btn" class="btn btn-primary flex-1">🧹 Remove Whitespace</button>
      </div>
    `;
  }

  function calculate() {
    const raw = (document.getElementById('ws-text')?.value || '').trim();
    const mode = document.getElementById('ws-mode')?.value || 'single';

    if (!raw) { if (out) out.value = ''; return; }

    let result = '';
    if (mode === 'single') {
      result = raw.replace(/s+/g, ' ');
    } else if (mode === 'all') {
      result = raw.replace(/s+/g, '');
    } else if (mode === 'newlines') {
      result = raw.replace(/[rn]+/g, ' ');
    }

    if (out) out.value = result;
    if (window.showToast) window.showToast('Whitespace cleaned!', 'success');
  }

  const activeBtn = document.getElementById('calc-ws-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
