/**
 * HTML Decoder Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('hd-src')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Enter Encoded HTML String:</label>
        <textarea id="hd-src" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">&lt;script&gt;alert(&quot;Hello &amp; Welcome!&quot;);&lt;/script&gt;</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-hd-btn" class="btn btn-primary flex-1">🔓 Decode HTML Entities</button>
      </div>
    `;
  }

  function calculate() {
    const raw = (document.getElementById('hd-src')?.value || '').trim();

    if (!raw) { if (out) out.value = ''; return; }

    const parser = new DOMParser();
    const dom = parser.parseFromString(`<!doctype html><body>${raw}`, 'text/html');
    const decoded = dom.body.textContent;

    let res = '--- HTML DECODED OUTPUT ---nn';
    res += decoded;

    if (out) out.value = res;
    if (window.showToast) window.showToast('HTML entities decoded!', 'success');
  }

  const activeBtn = document.getElementById('calc-hd-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
