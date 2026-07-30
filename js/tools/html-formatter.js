document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('hf-html')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input HTML Code:</label>
        <textarea id="hf-html" class="form-input" style="width:100%;height:140px;padding:0.5rem;font-family:monospace;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)"><div class="card"><h1>Title</h1><p>Description text</p></div></textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-hf-btn" class="btn btn-primary flex-1">⚙️ Format HTML</button>
      </div>
    `;
  }

  function formatHTML(html) {
    let tab = '  ';
    let result = '';
    let indent = 0;

    html.split(/>\s*</).forEach(element => {
      if (element.match(/^\/\w/)) {
        indent--;
      }
      result += tab.repeat(indent) + '<' + element + '>\n';
      if (element.match(/^\w[^>]*[^\/]$/) && !element.startsWith('input') && !element.startsWith('img') && !element.startsWith('br') && !element.startsWith('hr')) {
        indent++;
      }
    });

    return result.substring(1, result.length - 3);
  }

  function calculate() {
    const raw = (document.getElementById('hf-html')?.value || '').trim();
    if (!raw) { if (out) out.value = ''; return; }

    try {
      const formatted = formatHTML(raw);
      if (out) out.value = formatted;
      if (window.showToast) window.showToast('HTML Formatted!', 'success');
    } catch (e) {
      if (out) out.value = raw;
    }
  }

  const activeBtn = document.getElementById('calc-hf-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
