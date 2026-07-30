/**
 * File Name Cleaner & Sanitizer Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('fnc-raw')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Raw File Name / String:</label>
        <input type="text" id="fnc-raw" class="form-input" value="My Draft & Final Document #1 (v2.0)?.pdf" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-fnc-btn" class="btn btn-primary flex-1">✨ Clean File Name</button>
      </div>
    `;
  }

  function calculate() {
    const raw = document.getElementById('fnc-raw') ? document.getElementById('fnc-raw').value.trim() : '';

    if (!raw) {
      if (out) out.value = 'ERROR: Please enter a file name to clean.';
      return;
    }

    const sanitized = raw
      .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace illegal file name chars with underscores
      .replace(/_{2,}/g, '_');          // Collapse consecutive underscores

    let res = `--- FILE NAME CLEANER REPORT ---nn`;
    res += `Raw File Name:       "${raw}"n`;
    res += `Sanitized File Name: "${sanitized}"n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('File name sanitized!', 'success');
  }

  const activeBtn = document.getElementById('calc-fnc-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
