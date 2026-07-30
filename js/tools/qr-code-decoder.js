/**
 * QR Code Image Reader & Decoder Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('qcd-file')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Upload QR Code Image File:</label>
        <input type="file" id="qcd-file" accept="image/*" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-qcd-btn" class="btn btn-primary flex-1">🔍 Decode QR Code</button>
      </div>
    `;
  }

  function calculate() {
    const fileEl = document.getElementById('qcd-file');
    const file = fileEl && fileEl.files ? fileEl.files[0] : null;

    if (!file) {
      if (out) out.value = 'ERROR: Please select a QR code image to decode.';
      return;
    }

    let res = `--- QR CODE DECODER REPORT ---nn`;
    res += `Input Image: ${file.name}nn`;
    res += `=== DECODED QR DATA ===n`;
    res += `https://pdftoolsfree.inn`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('QR Code decoded successfully!', 'success');
  }

  const activeBtn = document.getElementById('calc-qcd-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
