/**
 * String Length Checker & Inspector Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('slc-text')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input Text:</label>
        <textarea id="slc-text" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">The quick brown fox jumps over the lazy dog.</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-slc-btn" class="btn btn-primary flex-1">📏 Inspect String Length</button>
      </div>
    `;
  }

  function calculate() {
    const text = document.getElementById('slc-text') ? document.getElementById('slc-text').value : (document.getElementById('text-input') ? document.getElementById('text-input').value : '');

    const totalChars = text.length;
    const charsNoSpaces = text.replace(/s+/g, '').length;
    const wordCount = (text.trim().match(/S+/g) || []).length;
    const lineCount = text ? text.split('n').length : 0;
    const byteSize = new Blob([text]).size;

    let res = `--- STRING LENGTH & METRICS REPORT ---nn`;
    res += `Total Characters (with spaces):    ${totalChars}n`;
    res += `Total Characters (without spaces): ${charsNoSpaces}n`;
    res += `Total Words:                       ${wordCount}n`;
    res += `Total Lines:                       ${lineCount}n`;
    res += `UTF-8 Byte Size:                    ${byteSize} bytesn`;

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Length: ${totalChars} characters`, 'success');
  }

  const activeBtn = document.getElementById('calc-slc-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
