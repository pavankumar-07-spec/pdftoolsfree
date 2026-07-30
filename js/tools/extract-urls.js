/**
 * Extract URLs Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('url-src')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input Text containing URLs:</label>
        <textarea id="url-src" class="form-input" style="width:100%;height:120px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">Visit https://pdftoolsfree.in/ or check http://example.com/blog and https://github.com/pavankumar-07-spec/pdftoolsfree.</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-url-btn" class="btn btn-primary flex-1">🔗 Extract All URLs</button>
      </div>
    `;
  }

  function calculate() {
    const text = document.getElementById('url-src') ? document.getElementById('url-src').value : '';

    const urlRegex = /(https?:\/\/[^\s<>"']+)/gi;
    const matches = Array.from(new Set(text.match(urlRegex) || []));

    let res = '--- EXTRACTED URLS ---nn';
    res += `Total Unique URLs Found: ${matches.length}nn`;
    if (matches.length > 0) {
      res += matches.join('n');
    } else {
      res += 'No URLs were found in the provided text.';
    }

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Found ${matches.length} URL(s)!`, 'success');
  }

  const activeBtn = document.getElementById('calc-url-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
