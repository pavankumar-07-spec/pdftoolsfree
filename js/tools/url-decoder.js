/**
 * URL Decoder Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('url-dec-input')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input Encoded URL String:</label>
        <textarea id="url-dec-input" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">https%3A%2F%2Fpdftoolsfree.in%2Fsearch%3Fq%3DPDF%20Tools%20%26%20Free%20%3D%20100%25</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-url-dec-btn" class="btn btn-primary flex-1">🔓 Decode URL</button>
      </div>
    `;
  }

  function calculate() {
    const raw = document.getElementById('url-dec-input') ? document.getElementById('url-dec-input').value : '';

    if (!raw) {
      if (out) out.value = '';
      return;
    }

    try {
      const decoded = decodeURIComponent(raw);

      let res = '--- URL DECODED RESULT ---nn';
      res += decoded;

      if (out) out.value = res;
      if (window.showToast) window.showToast('URL decoded successfully!', 'success');
    } catch (e) {
      if (out) out.value = 'ERROR: Invalid URL encoding sequence.';
    }
  }

  const activeBtn = document.getElementById('calc-url-dec-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
