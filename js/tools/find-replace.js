/**
 * Find & Replace Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('fr-source')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Source Text:</label>
        <textarea id="fr-source" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">The quick brown fox jumps over the lazy dog.</textarea>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Find Text / Pattern:</label>
          <input type="text" id="fr-find" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="fox">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Replace With:</label>
          <input type="text" id="fr-replace" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="cat">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-fr-btn" class="btn btn-primary flex-1">🔍 Perform Find & Replace</button>
      </div>
    `;
  }

  function calculate() {
    const source = document.getElementById('fr-source') ? document.getElementById('fr-source').value : '';
    const find = document.getElementById('fr-find') ? document.getElementById('fr-find').value : '';
    const replaceVal = document.getElementById('fr-replace') ? document.getElementById('fr-replace').value : '';

    if (!find) {
      if (out) out.value = source;
      return;
    }

    // Escape regex special chars
    const escapedFind = find.replace(/[.*+?^${}()|[]]/g, '$&');
    const regex = new RegExp(escapedFind, 'gi');

    const occurrences = (source.match(regex) || []).length;
    const resultText = source.replace(regex, replaceVal);

    let res = '--- FIND & REPLACE RESULTS ---nn';
    res += `Replacements Made: ${occurrences}nn`;
    res += `Result Text:n${resultText}n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Replaced ${occurrences} occurrence(s)!`, 'success');
  }

  const activeBtn = document.getElementById('calc-fr-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
