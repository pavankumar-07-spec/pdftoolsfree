/**
 * CONSTANT_CASE Converter Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('cst-text')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input Text String:</label>
        <textarea id="cst-text" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">The quick brown fox jumps over the lazy dog</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-cst-btn" class="btn btn-primary flex-1">🔠 Convert to CONSTANT_CASE</button>
      </div>
    `;
  }

  function toConstantCase(str) {
    return str
      .trim()
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/[^a-zA-Z0-9]+/g, '_')
      .toUpperCase();
  }

  function calculate() {
    const text = document.getElementById('cst-text') ? document.getElementById('cst-text').value : (document.getElementById('text-input') ? document.getElementById('text-input').value : '');

    if (!text) {
      if (out) out.value = 'ERROR: Please enter text to convert.';
      return;
    }

    const res = toConstantCase(text);

    if (out) out.value = res;
    if (window.showToast) window.showToast('Text converted to CONSTANT_CASE!', 'success');
  }

  const activeBtn = document.getElementById('calc-cst-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
