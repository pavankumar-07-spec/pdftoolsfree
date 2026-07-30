/**
 * Character Counter Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('cc-text')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Enter Text to Count:</label>
        <textarea id="cc-text" class="form-input" style="width:100%;height:140px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" placeholder="Type or paste your text here...">Sample text for character count analysis.</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-cc-btn" class="btn btn-primary flex-1">📊 Count Characters & Words</button>
      </div>
    `;
  }

  function calculate() {
    const text = document.getElementById('cc-text') ? document.getElementById('cc-text').value : '';

    const charCount = text.length;
    const charNoSpaces = text.replace(/s/g, '').length;
    const words = text.trim() ? text.trim().split(/s+/).filter(Boolean) : [];
    const wordCount = words.length;

    let res = '--- CHARACTER COUNT RESULTS ---nn';
    res += `Total Characters (with spaces): ${charCount.toLocaleString()}n`;
    res += `Total Characters (no spaces): ${charNoSpaces.toLocaleString()}n`;
    res += `Total Words: ${wordCount.toLocaleString()}n`;
    res += `Total Lines: ${text.split('n').length.toLocaleString()}n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Character count updated!', 'success');
  }

  const activeBtn = document.getElementById('calc-cc-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
