/**
 * Shuffle Lines Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('sl-text')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input Lines to Shuffle:</label>
        <textarea id="sl-text" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">Line 1nLine 2nLine 3nLine 4nLine 5</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-sl-btn" class="btn btn-primary flex-1">🔀 Shuffle Lines Randomly</button>
      </div>
    `;
  }

  function calculate() {
    const raw = (document.getElementById('sl-text')?.value || '').trim();

    if (!raw) { if (out) out.value = ''; return; }

    const lines = raw.split('n');
    for (let i = lines.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [lines[i], lines[j]] = [lines[j], lines[i]];
    }

    if (out) out.value = lines.join('n');
    if (window.showToast) window.showToast('Lines shuffled!', 'success');
  }

  const activeBtn = document.getElementById('calc-sl-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
