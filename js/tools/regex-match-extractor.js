/**
 * Regex Match Extractor Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('rme-pattern')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Regex Pattern:</label>
        <input type="text" id="rme-pattern" class="form-input" value="https?://[^s]+" style="width:100%;padding:0.5rem;font-family:monospace;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Source Text:</label>
        <textarea id="rme-text" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">Visit https://pdftoolsfree.in for PDF tools or https://example.org for examples.</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-rme-btn" class="btn btn-primary flex-1">✂️ Extract Regex Matches</button>
      </div>
    `;
  }

  function calculate() {
    const pattern = document.getElementById('rme-pattern') ? document.getElementById('rme-pattern').value : '';
    const text = document.getElementById('rme-text') ? document.getElementById('rme-text').value : (document.getElementById('text-input') ? document.getElementById('text-input').value : '');

    if (!pattern || !text) {
      if (out) out.value = 'ERROR: Please enter both regex pattern and source text.';
      return;
    }

    try {
      const regex = new RegExp(pattern, 'gi');
      const matches = text.match(regex) || [];

      let res = `--- REGEX MATCH EXTRACTOR REPORT ---nn`;
      res += `Pattern: /${pattern}/gin`;
      res += `Total Extracted Matches: ${matches.length}nn`;

      res += `=== EXTRACTED LIST ===n`;
      res += matches.join('n');

      if (out) out.value = res;
      if (window.showToast) window.showToast(`Extracted ${matches.length} matches!`, 'success');
    } catch (err) {
      if (out) out.value = `ERROR: Invalid regex pattern: ${err.message}`;
    }
  }

  const activeBtn = document.getElementById('calc-rme-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
