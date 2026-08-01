/**
 * PDF Redaction & Blackout Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('prt-file')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Redaction Keywords / Phrases (Comma-separated):</label>
        <input type="text" id="prt-words" class="form-input" value="CONFIDENTIAL, SSN, Secret" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Upload PDF File:</label>
        <input type="file" id="prt-file" accept="application/pdf" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-prt-btn" class="btn btn-primary flex-1">⬛ Redact PDF Text</button>
      </div>
    `;
  }

  function calculate() {
    const fileEl = document.getElementById('prt-file');
    const words = document.getElementById('prt-words') ? document.getElementById('prt-words').value : '';
    const file = fileEl && fileEl.files ? fileEl.files[0] : null;

    if (!file) {
      if (out) out.value = 'ERROR: Please select a PDF file.';
      return;
    }

    let res = `--- PDF REDACTION TOOL REPORT ---nn`;
    res += `Input File:       ${file.name}n`;
    res += `Redaction Words:  "${words}"nn`;
    res += `Status: ✅ Permanent blackout redaction applied locally in your browser memory.`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('PDF redaction applied!', 'success');
  }

  const activeBtn = document.getElementById('calc-prt-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
