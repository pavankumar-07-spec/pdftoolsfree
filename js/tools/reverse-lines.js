/**
 * Reverse Lines Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('rl-text')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input Text Lines:</label>
        <textarea id="rl-text" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">First linenSecond linenThird line</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-rl-btn" class="btn btn-primary flex-1">↕️ Reverse Line Order</button>
      </div>
    `;
  }

  function calculate() {
    const text = document.getElementById('rl-text') ? document.getElementById('rl-text').value : (document.getElementById('text-input') ? document.getElementById('text-input').value : '');

    if (!text) {
      if (out) out.value = 'ERROR: Please enter text.';
      return;
    }

    const reversed = text.split('n').reverse().join('n');

    if (out) out.value = reversed;
    if (window.showToast) window.showToast('Line order reversed!', 'success');
  }

  const activeBtn = document.getElementById('calc-rl-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
