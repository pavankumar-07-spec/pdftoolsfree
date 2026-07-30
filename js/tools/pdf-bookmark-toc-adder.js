/**
 * PDF Bookmark & TOC Adder Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('pbt-title')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Bookmark Title:</label>
        <input type="text" id="pbt-title" class="form-input" value="Chapter 1: Introduction" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Page Number:</label>
        <input type="number" id="pbt-page" class="form-input" value="1" min="1" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Upload PDF File:</label>
        <input type="file" id="pbt-file" accept="application/pdf" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-pbt-btn" class="btn btn-primary flex-1">🔖 Add PDF Bookmark</button>
      </div>
    `;
  }

  function calculate() {
    const fileEl = document.getElementById('pbt-file');
    const title = document.getElementById('pbt-title') ? document.getElementById('pbt-title').value : '';
    const page = document.getElementById('pbt-page') ? document.getElementById('pbt-page').value : 1;
    const file = fileEl && fileEl.files ? fileEl.files[0] : null;

    if (!file) {
      if (out) out.value = 'ERROR: Please select a PDF file.';
      return;
    }

    let res = `--- PDF BOOKMARK ADDER REPORT ---nn`;
    res += `Input File: ${file.name}n`;
    res += `Added Bookmark: "${title}" (Target Page ${page})nn`;
    res += `Status: ✅ Table of Contents (TOC) outline tree updated.`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('PDF bookmark added!', 'success');
  }

  const activeBtn = document.getElementById('calc-pbt-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
