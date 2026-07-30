document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('xe-xml')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input Raw XML:</label>
        <textarea id="xe-xml" class="form-input" style="width:100%;height:120px;padding:0.5rem;font-family:monospace;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)"><root><user><name>John</name></user></root></textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-xe-btn" class="btn btn-primary flex-1">⚙️ Format XML Code</button>
      </div>
    `;
  }

  function formatXML(xmlStr) {
    let formatted = '';
    const reg = /(>)(<)/g;
    let xml = xmlStr.replace(reg, '$1\r\n$2');
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
    return formatted.trim();
  }

  function calculate() {
    const rawXml = document.getElementById('xe-xml') ? document.getElementById('xe-xml').value : '';
    if (!rawXml.trim()) return;

    try {
      const formatted = formatXML(rawXml);
      if (out) out.value = formatted;
      if (window.showToast) window.showToast('XML formatted!', 'success');
    } catch (e) {
      if (out) out.value = `ERROR: Invalid XML: ${e.message}`;
    }
  }

  const activeBtn = document.getElementById('calc-xe-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
