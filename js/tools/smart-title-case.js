/**
 * Smart Title Case Converter Engine (Alias)
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('stc-text')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input Text:</label>
        <textarea id="stc-text" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">a guide to client side javascript engines and pdf utilities</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-stc-btn" class="btn btn-primary flex-1">🔤 Smart Title Case</button>
      </div>
    `;
  }

  const minorWords = new Set(['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from', 'by', 'of', 'in', 'over', 'with']);

  function smartTitleCase(str) {
    return str.toLowerCase().split(/s+/).map((w, idx, arr) => {
      if (idx === 0 || idx === arr.length - 1 || !minorWords.has(w)) {
        return w.charAt(0).toUpperCase() + w.slice(1);
      }
      return w;
    }).join(' ');
  }

  function calculate() {
    const text = document.getElementById('stc-text') ? document.getElementById('stc-text').value : (document.getElementById('text-input') ? document.getElementById('text-input').value : '');

    if (!text) {
      if (out) out.value = 'ERROR: Please enter text.';
      return;
    }

    const converted = smartTitleCase(text);

    if (out) out.value = converted;
    if (window.showToast) window.showToast('Converted to Smart Title Case!', 'success');
  }

  const activeBtn = document.getElementById('calc-stc-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
