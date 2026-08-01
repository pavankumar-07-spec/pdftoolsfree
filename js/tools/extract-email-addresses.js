/**
 * Extract Email Addresses Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('email-src')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input Text containing emails:</label>
        <textarea id="email-src" class="form-input" style="width:100%;height:120px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">Contact support@pdftoolsfree.in or info@acmetech.com for assistance. Sales queries: sales.team@acmetech.org.</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-email-btn" class="btn btn-primary flex-1">📧 Extract All Emails</button>
      </div>
    `;
  }

  function calculate() {
    const text = document.getElementById('email-src') ? document.getElementById('email-src').value : '';

    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}/g;
    const matches = Array.from(new Set(text.match(emailRegex) || []));

    let res = '--- EXTRACTED EMAIL ADDRESSES ---nn';
    res += `Total Unique Emails Found: ${matches.length}nn`;
    if (matches.length > 0) {
      res += matches.join('n');
    } else {
      res += 'No email addresses were found in the provided text.';
    }

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Found ${matches.length} email(s)!`, 'success');
  }

  const activeBtn = document.getElementById('calc-email-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
