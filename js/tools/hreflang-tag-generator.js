/**
 * Hreflang SEO Meta Tag Generator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('htg-url')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Base Page URL:</label>
        <input type="text" id="htg-url" class="form-input" value="https://pdftoolsfree.in/tools/pdf-to-word.html" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-htg-btn" class="btn btn-primary flex-1">🌐 Generate Hreflang Tags</button>
      </div>
    `;
  }

  function calculate() {
    const url = document.getElementById('htg-url') ? document.getElementById('htg-url').value.trim() : 'https://pdftoolsfree.in/';

    let tags = `<!-- Hreflang Multilingual SEO Tags -->n`;
    tags += `<link rel="alternate" hreflang="en" href="${url}" />n`;
    tags += `<link rel="alternate" hreflang="hi" href="${url}?lang=hi" />n`;
    tags += `<link rel="alternate" hreflang="x-default" href="${url}" />n`;

    if (out) out.value = tags;
    if (window.showToast) window.showToast('Hreflang tags generated!', 'success');
  }

  const activeBtn = document.getElementById('calc-htg-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
