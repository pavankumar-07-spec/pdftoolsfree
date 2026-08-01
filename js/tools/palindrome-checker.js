/**
 * Palindrome Checker Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('pal-text')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Enter Phrase or Word:</label>
        <input type="text" id="pal-text" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="A man, a plan, a canal: Panama">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-pal-btn" class="btn btn-primary flex-1">🔍 Check Palindrome</button>
      </div>
    `;
  }

  function calculate() {
    const raw = (document.getElementById('pal-text')?.value || '').trim();

    if (!raw) { if (out) out.value = ''; return; }

    const cleaned = raw.toLowerCase().replace(/[^a-z0-9]/g, '');
    const reversed = cleaned.split('').reverse().join('');
    const isPal = cleaned.length > 0 && cleaned === reversed;

    let res = '--- PALINDROME CHECKER RESULTS ---nn';
    res += `Input Phrase: "${raw}"n`;
    res += `Cleaned String: "${cleaned}"n`;
    res += `Reversed String: "${reversed}"nn`;
    res += isPal ? '✅ RESULT: YES! This is a valid palindrome.' : '❌ RESULT: NO. This is not a palindrome.';

    if (out) out.value = res;
    if (window.showToast) window.showToast(isPal ? 'It is a palindrome!' : 'Not a palindrome', isPal ? 'success' : 'info');
  }

  const activeBtn = document.getElementById('calc-pal-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
