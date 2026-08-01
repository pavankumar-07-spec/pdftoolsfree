/**
 * Upgraded Bulk UUID v4 Generator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('uuid-count')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:1rem;margin-bottom:1.5rem">
        <div>
          <label class="form-label">Quantity to Generate (1 to 500)</label>
          <input type="number" id="uuid-count" class="form-input" value="10" min="1" max="500">
        </div>
        <div>
          <label class="form-label">Letter Case Format</label>
          <select id="uuid-case" class="form-input">
            <option value="lower" selected>lowercase (e.g. 550e8400...)</option>
            <option value="upper">UPPERCASE (e.g. 550E8400...)</option>
          </select>
        </div>
        <div>
          <label class="form-label">Hyphen Formatting</label>
          <select id="uuid-hyphen" class="form-input">
            <option value="yes" selected>Include Hyphens (Standard 8-4-4-4-12)</option>
            <option value="no">Remove Hyphens (32-character continuous)</option>
          </select>
        </div>
      </div>
      <div class="flex gap-3 mt-4">
        <button id="calc-uuid-btn" type="button" class="btn btn-primary flex-1">🔑 Generate Bulk UUIDs (v4)</button>
      </div>
    `;
  }

  function generateSingleUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  function generateUUIDs() {
    const count = parseInt(document.getElementById('uuid-count')?.value || 10, 10);
    const letterCase = document.getElementById('uuid-case')?.value || 'lower';
    const useHyphen = document.getElementById('uuid-hyphen')?.value || 'yes';

    const safeCount = Math.max(1, Math.min(500, count));
    const list = [];

    for (let i = 0; i < safeCount; i++) {
      let u = generateSingleUUID();
      if (useHyphen === 'no') u = u.replace(/-/g, '');
      if (letterCase === 'upper') u = u.toUpperCase();
      list.push(u);
    }

    let report = `==========================================================
              BULK UUID (v4) GENERATOR
==========================================================
Generated Count:   ${safeCount} UUIDs
Format:            ${letterCase.toUpperCase()} | ${useHyphen === 'yes' ? 'Hyphenated (8-4-4-4-12)' : 'Continuous 32-char'}

GENERATED UUID LIST:
` + list.join('\n');

    if (out) out.value = report;
    if (window.showToast) window.showToast(`Generated ${safeCount} UUIDs!`, 'success');
  }

  const activeBtn = document.getElementById('calc-uuid-btn') || btn;
  if (activeBtn) activeBtn.onclick = () => generateUUIDs();

  generateUUIDs();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
