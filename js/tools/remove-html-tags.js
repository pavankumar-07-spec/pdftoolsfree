/**
 * Remove HTML Tags Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('rht-html')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input HTML String:</label>
        <textarea id="rht-html" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)"><div class="card"><h1>Hello World</h1><p>This is <strong>bold text</strong> and <em>italicized text</em>.</p></div></textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-rht-btn" class="btn btn-primary flex-1">🏷️ Strip HTML Tags</button>
      </div>
    `;
  }

  function stripHtml(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  }

  function calculate() {
    const rawHtml = document.getElementById('rht-html') ? document.getElementById('rht-html').value : (document.getElementById('text-input') ? document.getElementById('text-input').value : '');

    if (!rawHtml) {
      if (out) out.value = 'ERROR: Please enter HTML content.';
      return;
    }

    const textOnly = stripHtml(rawHtml);

    if (out) out.value = textOnly;
    if (window.showToast) window.showToast('HTML tags stripped successfully!', 'success');
  }

  const activeBtn = document.getElementById('calc-rht-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
