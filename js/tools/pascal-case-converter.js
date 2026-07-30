/**
 * PascalCase Converter Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('pc-text')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input Text String:</label>
        <textarea id="pc-text" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">The quick brown fox jumps over the lazy dog</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-pc-btn" class="btn btn-primary flex-1">📐 Convert to PascalCase</button>
      </div>
    `;
  }

  function toPascalCase(str) {
    return str
      .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
      .replace(/^[a-z]/, c => c.toUpperCase());
  }

  function calculate() {
    const text = document.getElementById('pc-text') ? document.getElementById('pc-text').value : (document.getElementById('text-input') ? document.getElementById('text-input').value : '');

    if (!text) {
      if (out) out.value = 'ERROR: Please enter text to convert.';
      return;
    }

    const res = toPascalCase(text);

    if (out) out.value = res;
    if (window.showToast) window.showToast('Text converted to PascalCase!', 'success');
  }

  const activeBtn = document.getElementById('calc-pc-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
