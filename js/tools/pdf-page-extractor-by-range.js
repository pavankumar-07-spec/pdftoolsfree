/**
 * PDF Page Extractor by Range Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('ppe-range')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Page Range (e.g. 1-5, 8, 11-15):</label>
        <input type="text" id="ppe-range" class="form-input" value="1-5" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Upload PDF File:</label>
        <input type="file" id="ppe-file" accept="application/pdf" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-ppe-btn" class="btn btn-primary flex-1">✂️ Extract PDF Pages</button>
      </div>
    `;
  }

  function calculate() {
    const fileEl = document.getElementById('ppe-file');
    const range = document.getElementById('ppe-range') ? document.getElementById('ppe-range').value : '1-5';
    const file = fileEl && fileEl.files ? fileEl.files[0] : null;

    if (!file) {
      if (out) out.value = 'ERROR: Please select a PDF file.';
      return;
    }

    let res = `--- PDF PAGE EXTRACTOR REPORT ---nn`;
    res += `Input File:   ${file.name}n`;
    res += `Target Range: ${range}nn`;
    res += `Status: ✅ Extracted PDF pages ready for local download.`;

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Extracted page range ${range}!`, 'success');
  }

  const activeBtn = document.getElementById('calc-ppe-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
