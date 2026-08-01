/**
 * Alternating Case Converter Engine (aLtErNaTiNg cAsE)
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('ac-text')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input Text:</label>
        <textarea id="ac-text" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">The quick brown fox jumps over the lazy dog</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-ac-btn" class="btn btn-primary flex-1">🔠 Convert to aLtErNaTiNg cAsE</button>
      </div>
    `;
  }

  function toAlternatingCase(text) {
    let lower = true;
    return text.split('').map(c => {
      if (/[a-zA-Z]/.test(c)) {
        const res = lower ? c.toLowerCase() : c.toUpperCase();
        lower = !lower;
        return res;
      }
      return c;
    }).join('');
  }

  function calculate() {
    const text = document.getElementById('ac-text') ? document.getElementById('ac-text').value : (document.getElementById('text-input') ? document.getElementById('text-input').value : '');

    if (!text) {
      if (out) out.value = 'ERROR: Please enter text to convert.';
      return;
    }

    const converted = toAlternatingCase(text);

    if (out) out.value = converted;
    if (window.showToast) window.showToast('Text converted to alternating case!', 'success');
  }

  const activeBtn = document.getElementById('calc-ac-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
