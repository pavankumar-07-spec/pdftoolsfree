/**
 * URL Encoder / Decoder Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('url-enc-input')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input URL / Query String:</label>
        <textarea id="url-enc-input" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">https://pdftoolsfree.in/search?q=PDF Tools & Free = 100%</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-url-enc-btn" class="btn btn-primary flex-1">🔒 Encode URL</button>
      </div>
    `;
  }

  function calculate() {
    const raw = document.getElementById('url-enc-input') ? document.getElementById('url-enc-input').value : '';

    if (!raw) {
      if (out) out.value = '';
      return;
    }

    const encoded = encodeURIComponent(raw);

    let res = '--- URL ENCODED RESULT ---nn';
    res += encoded;

    if (out) out.value = res;
    if (window.showToast) window.showToast('URL encoded successfully!', 'success');
  }

  const activeBtn = document.getElementById('calc-url-enc-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
