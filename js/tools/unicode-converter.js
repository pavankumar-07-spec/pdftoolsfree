/**
 * Unicode Converter Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('uc-text')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Enter Text or Unicode (e.g. Hello or U+0048 U+0065):</label>
        <textarea id="uc-text" class="form-input" style="width:100%;height:80px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">Hello 🌍</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-uc2-btn" class="btn btn-primary flex-1">🔠 Inspect Unicode Points</button>
      </div>
    `;
  }

  function calculate() {
    const text = document.getElementById('uc-text')?.value || '';
    if (!text) { if (out) out.value = 'ERROR: Enter text.'; return; }

    let res = '--- UNICODE INSPECTION ---nn';
    res += `Input: ${text}nn`;
    res += 'Char   | Code Point | Hex       | Namen';
    res += '-------+------------+-----------+-----n';

    for (const ch of text) {
      const cp = ch.codePointAt(0);
      const hex = 'U+' + cp.toString(16).toUpperCase().padStart(4, '0');
      res += ` ${ch}     | ${String(cp).padStart(10)} | ${hex.padEnd(10)}|n`;
    }

    res += `nTotal Characters: ${[...text].length}n`;
    res += `UTF-8 Bytes (approx): ${new TextEncoder().encode(text).length}`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Unicode inspection complete!', 'success');
  }

  const activeBtn = document.getElementById('calc-uc2-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
