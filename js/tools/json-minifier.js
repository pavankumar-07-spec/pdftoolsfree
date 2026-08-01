/**
 * Upgraded Real JSON Minifier Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('json-min-input')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label">Pretty Formatted JSON Input</label>
        <textarea id="json-min-input" class="form-input" rows="6" placeholder='{\n  "name": "PDFToolsFree",\n  "tools": 405\n}'>{\n  "name": "PDFToolsFree",\n  "tools": 405,\n  "status": "Active"\n}</textarea>
      </div>
      <div class="flex gap-3 mt-4">
        <button id="calc-min-btn" type="button" class="btn btn-primary flex-1">⚡ Compress & Minify JSON</button>
      </div>
    `;
  }

  function minifyJSON() {
    const raw = (document.getElementById('json-min-input')?.value || '{"name":"PDFToolsFree"}').trim();

    if (!raw) {
      if (out) out.value = 'ERROR: Please enter JSON string.';
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      const minified = JSON.stringify(parsed);

      const origBytes = new Blob([raw]).size;
      const minBytes = new Blob([minified]).size;
      const savedBytes = origBytes - minBytes;
      const pctSaved = origBytes > 0 ? ((savedBytes / origBytes) * 100).toFixed(1) : 0;

      let report = `==========================================================
              JSON COMPRESSION & MINIFIER
==========================================================
Original Size:  ${origBytes} bytes
Minified Size:  ${minBytes} bytes
Saved Space:    ${savedBytes} bytes (${pctSaved}% reduction)

MINIFIED JSON OUTPUT:
${minified}`;

      if (out) out.value = minified;
      if (window.showToast) window.showToast(`JSON minified! Saved ${pctSaved}% space`, 'success');
    } catch (err) {
      let report = `==========================================================\n⚠️ INVALID JSON SYNTAX ERROR\n==========================================================\nError Message: ${err.message}\n==========================================================`;
      if (out) out.value = report;
      if (window.showToast) window.showToast(`JSON Error: ${err.message}`, 'error');
    }
  }

  const activeBtn = document.getElementById('calc-min-btn') || btn;
  if (activeBtn) activeBtn.onclick = () => minifyJSON();

  minifyJSON();
});
