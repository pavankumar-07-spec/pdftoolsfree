/**
 * Upgraded Real JSON Validator & Formatter Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('json-str-input')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label">Raw JSON String to Format / Validate</label>
        <textarea id="json-str-input" class="form-input" rows="5" placeholder='{"name":"PDFToolsFree","tools":405,"active":true}'>{"name":"PDFToolsFree","tools":405,"active":true,"categories":["PDF","Calculators","Converters"]}</textarea>
      </div>
      <div style="margin-bottom:1.5rem">
        <label class="form-label">Formatting Indentation Style</label>
        <select id="json-indent-select" class="form-input">
          <option value="2" selected>Pretty Print (2 Spaces)</option>
          <option value="4">Pretty Print (4 Spaces)</option>
          <option value="tab">Pretty Print (Tabs)</option>
          <option value="0">Minified (Compact No Whitespace)</option>
        </select>
      </div>
      <div class="flex gap-3 mt-4">
        <button id="calc-json-btn" type="button" class="btn btn-primary flex-1">✨ Format & Validate JSON</button>
      </div>
    `;
  }

  function formatJSON() {
    const raw = (document.getElementById('json-str-input')?.value || '{"name":"PDFToolsFree"}').trim();
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
      if (indentVal === '0') indent = 0;

      const formatted = JSON.stringify(parsed, null, indent);

      if (out) out.value = formatted;
      if (window.showToast) window.showToast('JSON formatted and validated cleanly!', 'success');
    } catch (err) {
      let report = `==========================================================\n⚠️ INVALID JSON SYNTAX ERROR\n==========================================================\nError Message: ${err.message}\n\nTroubleshooting Checklist:\n• Check for unclosed brackets { } or [ ]\n• Ensure keys are wrapped in double quotes "key"\n• Ensure trailing commas are removed before closing brackets\n==========================================================`;
      if (out) out.value = report;
      if (window.showToast) window.showToast(`JSON Error: ${err.message}`, 'error');
    }
  }

  const select = document.getElementById('json-indent-select');
  if (select) select.onchange = formatJSON;

  const activeBtn = document.getElementById('calc-json-btn') || btn;
  if (activeBtn) activeBtn.onclick = () => formatJSON();

  formatJSON();
});
