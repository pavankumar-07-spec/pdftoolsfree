/**
 * Remove Duplicate Lines Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('rdl-text')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input List / Lines:</label>
        <textarea id="rdl-text" class="form-input" style="width:100%;height:120px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">applenbanananapplenorangenbananangrape</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-rdl-btn" class="btn btn-primary flex-1">🧹 Remove Duplicate Lines</button>
      </div>
    `;
  }

  function calculate() {
    const text = document.getElementById('rdl-text') ? document.getElementById('rdl-text').value : (document.getElementById('text-input') ? document.getElementById('text-input').value : '');

    if (!text) {
      if (out) out.value = 'ERROR: Please enter text lines.';
      return;
    }

    const lines = text.split('n');
    const uniqueLines = Array.from(new Set(lines));
    const removedCount = lines.length - uniqueLines.length;

    let res = uniqueLines.join('n');

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Removed ${removedCount} duplicate line(s)!`, 'success');
  }

  const activeBtn = document.getElementById('calc-rdl-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
