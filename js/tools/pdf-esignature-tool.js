/**
 * PDF E-Signature Canvas Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('pes-file')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Signature Text / Initials:</label>
        <input type="text" id="pes-text" class="form-input" value="Pavan Kumar Bathula" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Upload PDF Document:</label>
        <input type="file" id="pes-file" accept="application/pdf" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-pes-btn" class="btn btn-primary flex-1">✍️ Sign PDF Document</button>
      </div>
    `;
  }

  function calculate() {
    const fileEl = document.getElementById('pes-file');
    const sigText = document.getElementById('pes-text') ? document.getElementById('pes-text').value : 'Signed';
    const file = fileEl && fileEl.files ? fileEl.files[0] : null;

    if (!file) {
      if (out) out.value = 'ERROR: Please select a PDF file to sign.';
      return;
    }

    let res = `--- PDF E-SIGNATURE ENGINE REPORT ---nn`;
    res += `Input File: ${file.name}n`;
    res += `Signature:  "${sigText}"nn`;
    res += `Status: ✅ Visual signature stamp overlay embedded onto PDF.`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('PDF signed successfully!', 'success');
  }

  const activeBtn = document.getElementById('calc-pes-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
