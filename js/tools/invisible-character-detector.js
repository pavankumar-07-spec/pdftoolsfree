/**
 * Invisible Character & Zero-Width Space Detector Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('icd-text')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input Text String:</label>
        <textarea id="icd-text" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">Hello​World! (contains hidden zero-width space)</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-icd-btn" class="btn btn-primary flex-1">🔍 Detect Invisible Characters</button>
      </div>
    `;
  }

  const invisibleCharsRegex = /[u200B-u200DuFEFFu00A0u2000-u200Au202Fu205Fu3000]/g;

  function calculate() {
    const text = document.getElementById('icd-text') ? document.getElementById('icd-text').value : (document.getElementById('text-input') ? document.getElementById('text-input').value : '');

    if (!text) {
      if (out) out.value = 'ERROR: Please enter text to scan.';
      return;
    }

    const matches = text.match(invisibleCharsRegex) || [];
    const cleaned = text.replace(invisibleCharsRegex, '');

    let res = `--- INVISIBLE CHARACTER DETECTOR REPORT ---nn`;
    res += `Total Scanned Length: ${text.length} charsn`;
    res += `Invisible Characters Found: ${matches.length}nn`;

    if (matches.length === 0) {
      res += `✅ Clean! No zero-width spaces or hidden Unicode characters detected.n`;
    } else {
      res += `⚠️ Found ${matches.length} hidden character(s):n`;
      matches.forEach((c, i) => {
        res += `  ${i + 1}. Code: U+${c.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')}n`;
      });
      res += `n=== CLEANED TEXT (INVISIBLES REMOVED) ===n${cleaned}n`;
    }

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Detected ${matches.length} hidden chars!`, matches.length > 0 ? 'info' : 'success');
  }

  const activeBtn = document.getElementById('calc-icd-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
