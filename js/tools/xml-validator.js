/**
 * XML Syntax Validator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('xv-xml')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input XML String:</label>
        <textarea id="xv-xml" class="form-input" style="width:100%;height:120px;padding:0.5rem;font-family:monospace;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)"><?xml version="1.0" encoding="UTF-8"?>n<root>n  <element id="1">Content</element>n</root></textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-xv-btn" class="btn btn-primary flex-1">🔍 Validate XML Syntax</button>
      </div>
    `;
  }

  function validateXML(xmlStr) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlStr, 'application/xml');
    const parserError = doc.querySelector('parsererror');

    if (parserError) {
      return { valid: false, error: parserError.textContent };
    }
    return { valid: true, rootTag: doc.documentElement.tagName };
  }

  function calculate() {
    const xmlText = document.getElementById('xv-xml') ? document.getElementById('xv-xml').value : (document.getElementById('text-input') ? document.getElementById('text-input').value : '');

    if (!xmlText.trim()) {
      if (out) out.value = 'ERROR: Please enter XML content to validate.';
      return;
    }

    const result = validateXML(xmlText);

    let res = `--- XML VALIDATION REPORT ---nn`;
    if (result.valid) {
      res += `Status:   ✅ VALID XMLn`;
      res += `Root Tag: <${result.rootTag}>n`;
    } else {
      res += `Status:   ❌ INVALID XML SYNTAXn`;
      res += `Details:  ${result.error}n`;
    }

    if (out) out.value = res;
    if (window.showToast) window.showToast(result.valid ? 'XML syntax is valid!' : 'Invalid XML syntax', result.valid ? 'success' : 'error');
  }

  const activeBtn = document.getElementById('calc-xv-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
