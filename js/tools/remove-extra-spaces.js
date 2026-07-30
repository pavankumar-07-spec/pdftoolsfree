/**
 * Remove Extra Spaces Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('res-text')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input Text with Excess Spaces:</label>
        <textarea id="res-text" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">The   quick   brown   fox    jumps   over   the   lazy   dog.</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-res-btn" class="btn btn-primary flex-1">🧹 Clean Excess Spaces</button>
      </div>
    `;
  }

  function calculate() {
    const text = document.getElementById('res-text') ? document.getElementById('res-text').value : (document.getElementById('text-input') ? document.getElementById('text-input').value : '');

    if (!text) {
      if (out) out.value = 'ERROR: Please enter text.';
      return;
    }

    const cleaned = text.split('n').map(l => l.replace(/s+/g, ' ').trim()).join('n');

    if (out) out.value = cleaned;
    if (window.showToast) window.showToast('Extra whitespace cleaned!', 'success');
  }

  const activeBtn = document.getElementById('calc-res-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
