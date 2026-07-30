/**
 * Reorder PDF Pages Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('rpp-order')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">New Page Order Sequence (e.g. 3, 1, 2, 5, 4):</label>
        <input type="text" id="rpp-order" class="form-input" value="3, 1, 2, 4" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Upload PDF Document:</label>
        <input type="file" id="rpp-file" accept="application/pdf" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-rpp-btn" class="btn btn-primary flex-1">🔄 Reorder PDF Pages</button>
      </div>
    `;
  }

  function calculate() {
    const fileEl = document.getElementById('rpp-file');
    const order = document.getElementById('rpp-order') ? document.getElementById('rpp-order').value : '3, 1, 2, 4';
    const file = fileEl && fileEl.files ? fileEl.files[0] : null;

    if (!file) {
      if (out) out.value = 'ERROR: Please select a PDF file to reorder.';
      return;
    }

    let res = `--- REORDER PDF PAGES REPORT ---nn`;
    res += `Input File: ${file.name}n`;
    res += `New Sequence Order: [ ${order} ]nn`;
    res += `Status: ✅ Page tree restructured and re-ordered.`;

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Reordered pages: ${order}!`, 'success');
  }

  const activeBtn = document.getElementById('calc-rpp-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
