document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('xw-xml')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input XML String:</label>
        <textarea id="xw-xml" class="form-input" style="width:100%;height:120px;padding:0.5rem;font-family:monospace;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)"><note><to>User</to></note></textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-xw-btn" class="btn btn-primary flex-1">🔍 Format & Inspect XML</button>
      </div>
    `;
  }

  function formatXML(xml) {
    let formatted = '';
    const reg = /(>)(<)/g;
    let pad = 0;
    const xmlFormatted = xml.replace(reg, '$1\r\n$2');

    xmlFormatted.split('\r\n').forEach(node => {
      let indent = 0;
      if (node.match(/.+<\/\w[^>]*>$/)) {
        indent = 0;
      } else if (node.match(/^<\/\w/)) {
        if (pad !== 0) pad -= 2;
      } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
        indent = 2;
      }
      formatted += ' '.repeat(pad) + node + '\n';
      pad += indent;
    });

    return formatted.trim();
  }

  function calculate() {
    const rawXml = document.getElementById('xw-xml') ? document.getElementById('xw-xml').value : '';
    if (!rawXml.trim()) return;

    const formatted = formatXML(rawXml);
    if (out) out.value = formatted;
    if (window.showToast) window.showToast('XML formatted successfully!', 'success');
  }

  const activeBtn = document.getElementById('calc-xw-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
