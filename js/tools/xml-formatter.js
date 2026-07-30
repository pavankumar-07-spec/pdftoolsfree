document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('xml-src')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Enter XML String:</label>
        <textarea id="xml-src" class="form-input" style="width:100%;height:140px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)"><root><item id="1">Text</item></root></textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-xml-btn" class="btn btn-primary flex-1">📄 Format / Beautify XML</button>
      </div>
    `;
  }

  function calculate() {
    const raw = (document.getElementById('xml-src')?.value || '').trim();
    if (!raw) { if (out) out.value = ''; return; }

    try {
      let formatted = '';
      const reg = /(>)(<)/g;
      let xml = raw.replace(reg, '$1\r\n$2');
      let pad = 0;

      xml.split('\r\n').forEach(node => {
        let indent = 0;
        if (node.match(/.+<\/\w[^>]*>$/)) {
          indent = 0;
        } else if (node.match(/^<\/\w/)) {
          if (pad !== 0) pad -= 1;
        } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
          indent = 1;
        } else {
          indent = 0;
        }

        let padding = '';
        for (let i = 0; i < pad; i++) padding += '  ';

        formatted += padding + node + '\r\n';
        pad += indent;
      });

      if (out) out.value = formatted.trim();
      if (window.showToast) window.showToast('XML formatted successfully!', 'success');
    } catch (e) {
      if (out) out.value = `ERROR: ${e.message}`;
    }
  }

  const activeBtn = document.getElementById('calc-xml-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
