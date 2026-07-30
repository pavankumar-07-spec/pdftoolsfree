/**
 * camelCase Converter Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('cc-text')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input Text String:</label>
        <textarea id="cc-text" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">The quick brown fox jumps over the lazy dog</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-cc-btn" class="btn btn-primary flex-1">🐪 Convert to camelCase</button>
      </div>
    `;
  }

  function toCamelCase(str) {
    return str
      .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
      .replace(/^[A-Z]/, c => c.toLowerCase());
  }

  function calculate() {
    const text = document.getElementById('cc-text') ? document.getElementById('cc-text').value : (document.getElementById('text-input') ? document.getElementById('text-input').value : '');

    if (!text) {
      if (out) out.value = 'ERROR: Please enter text.';
      return;
    }

    const res = toCamelCase(text);

    if (out) out.value = res;
    if (window.showToast) window.showToast('Text converted to camelCase!', 'success');
  }

  const activeBtn = document.getElementById('calc-cc-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
