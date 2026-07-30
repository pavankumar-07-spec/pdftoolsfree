/**
 * Extract Hashtags Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('hash-text')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input Social Media Post or Article Text:</label>
        <textarea id="hash-text" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">Check out #FreeToolsPDF for 100% free #PDF #Tools and #WebDev utilities! #Coding #JavaScript</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-hash-btn" class="btn btn-primary flex-1">#️⃣ Extract All Hashtags</button>
      </div>
    `;
  }

  function calculate() {
    const raw = (document.getElementById('hash-text')?.value || '').trim();

    if (!raw) { if (out) out.value = ''; return; }

    const hashtagRegex = /#[a-zA-Z0-9_]+/g;
    const matches = Array.from(new Set(raw.match(hashtagRegex) || []));

    let res = '--- EXTRACTED HASHTAGS ---nn';
    res += `Total Unique Hashtags Found: ${matches.length}nn`;
    if (matches.length > 0) {
      res += matches.join(' ');
      res += 'nnList view:n';
      res += matches.join('n');
    } else {
      res += 'No hashtags (#tag) found in text.';
    }

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Extracted ${matches.length} hashtag(s)!`, 'success');
  }

  const activeBtn = document.getElementById('calc-hash-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
