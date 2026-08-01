/**
 * Upgraded Real JSON Beautifier Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('json-beau-input')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label">Minified or Raw JSON Input</label>
        <textarea id="json-beau-input" class="form-input" rows="5" placeholder='{"name":"PDFToolsFree","tools":405}'>{"name":"PDFToolsFree","tools":405,"active":true,"categories":["PDF","Calculators","Converters"]}</textarea>
      </div>
      <div style="margin-bottom:1.5rem">
        <label class="form-label">Indentation Spaces</label>
        <select id="json-indent-select" class="form-input">
          <option value="2" selected>2 Spaces (Standard)</option>
          <option value="4">4 Spaces (Wide)</option>
          <option value="tab">Tabs</option>
        </select>
      </div>
      <div class="flex gap-3 mt-4">
        <button id="calc-beau-btn" type="button" class="btn btn-primary flex-1">✨ Beautify & Format JSON</button>
      </div>
    `;
  }

  function beautifyJSON() {
    const raw = (document.getElementById('json-beau-input')?.value || '{"name":"PDFToolsFree"}').trim();
    const indentVal = document.getElementById('json-indent-select')?.value || '2';

    if (!raw) {
      if (out) out.value = 'ERROR: Please enter JSON string.';
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      let indent = 2;
      if (indentVal === '4') indent = 4;
      if (indentVal === 'tab') indent = '\t';

      const beautified = JSON.stringify(parsed, null, indent);

      if (out) out.value = beautified;
      if (window.showToast) window.showToast('JSON beautified cleanly!', 'success');
    } catch (err) {
      let report = `==========================================================\n⚠️ INVALID JSON SYNTAX ERROR\n==========================================================\nError Message: ${err.message}\n==========================================================`;
      if (out) out.value = report;
      if (window.showToast) window.showToast(`JSON Error: ${err.message}`, 'error');
    }
  }

  const select = document.getElementById('json-indent-select');
  if (select) select.onchange = beautifyJSON;

  const activeBtn = document.getElementById('calc-beau-btn') || btn;
  if (activeBtn) activeBtn.onclick = () => beautifyJSON();

  beautifyJSON();
});
