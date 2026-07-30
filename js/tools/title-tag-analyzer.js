/**
 * SEO Title Tag Analyzer Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('tta-title')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Title Tag Text:</label>
        <input type="text" id="tta-title" class="form-input" value="Convert PDF to Word Online Free - Fast & Private" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-tta-btn" class="btn btn-primary flex-1">📊 Analyze Title Tag Quality</button>
      </div>
    `;
  }

  function calculate() {
    const title = document.getElementById('tta-title') ? document.getElementById('tta-title').value.trim() : '';

    if (!title) {
      if (out) out.value = 'ERROR: Please enter a title tag.';
      return;
    }

    const len = title.length;
    const wordCount = title.split(/s+/).length;
    const hasNumbers = /d/.test(title);
    const hasPowerWords = /(free|best|fast|online|private|tools|guide|top|easy)/i.test(title);

    let res = `--- SEO TITLE TAG QUALITY REPORT ---nn`;
    res += `Length:     ${len} charactersn`;
    res += `Word Count: ${wordCount} wordsnn`;

    res += `=== QUALITY CHECKLIST ===n`;
    res += `• Length Fit (50-60 chars):  ${len >= 45 && len <= 60 ? 'PASS ✅' : 'FAIL ❌'}n`;
    res += `• Power Words Included:      ${hasPowerWords ? 'PASS ✅' : 'INFO ℹ️ (Consider adding words like Free, Fast, Best)'}n`;
    res += `• Contains Numbers:          ${hasNumbers ? 'PASS ✅' : 'INFO ℹ️ (Titles with numbers often get higher CTR)'}n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Title Tag Score Analyzed (${len} chars)!`, 'success');
  }

  const activeBtn = document.getElementById('calc-tta-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
