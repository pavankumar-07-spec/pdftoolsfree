/**
 * CSS Formatter Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('css-src')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Enter CSS Code:</label>
        <textarea id="css-src" class="form-input" style="width:100%;height:140px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text);font-family:monospace">body{margin:0;padding:0;background:#fff;color:#333}.container{max-width:1200px;margin:0 auto;display:flex}</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-css-btn" class="btn btn-primary flex-1">🎨 Format / Beautify CSS</button>
      </div>
    `;
  }

  function calculate() {
    const raw = (document.getElementById('css-src')?.value || '').trim();

    if (!raw) {
      if (out) out.value = '';
      return;
    }

    let formatted = raw
      .replace(/s*{s*/g, ' {n  ')
      .replace(/;s*/g, ';n  ')
      .replace(/s*}s*/g, 'n}nn')
      .replace(/s*:s*/g, ': ')
      .trim();

    let res = '/* --- BEAUTIFIED CSS --- */nn' + formatted;

    if (out) out.value = res;
    if (window.showToast) window.showToast('CSS formatted!', 'success');
  }

  const activeBtn = document.getElementById('calc-css-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
