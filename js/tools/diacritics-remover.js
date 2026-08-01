/**
 * Diacritics Remover Engine (Alias)
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('dr-text')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input Text:</label>
        <textarea id="dr-text" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">Resumé of Señor Fernando with façades & naïveté.</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-dr-btn" class="btn btn-primary flex-1">✨ Remove Diacritics</button>
      </div>
    `;
  }

  function calculate() {
    const text = document.getElementById('dr-text') ? document.getElementById('dr-text').value : (document.getElementById('text-input') ? document.getElementById('text-input').value : '');

    if (!text) {
      if (out) out.value = 'ERROR: Please enter text.';
      return;
    }

    const cleaned = text.normalize('NFD').replace(/[u0300-u036f]/g, '');

    if (out) out.value = cleaned;
    if (window.showToast) window.showToast('Diacritics stripped!', 'success');
  }

  const activeBtn = document.getElementById('calc-dr-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
