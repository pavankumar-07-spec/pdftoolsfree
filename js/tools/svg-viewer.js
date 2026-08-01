/**
 * SVG Code Viewer & Inspector Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('sv-svg')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input SVG Code:</label>
        <textarea id="sv-svg" class="form-input" style="width:100%;height:100px;padding:0.5rem;font-family:monospace;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)"><svg width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#FF5A1F"/></svg></textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-sv-btn" class="btn btn-primary flex-1">👁️ Inspect SVG Code</button>
      </div>
    `;
  }

  function calculate() {
    const raw = document.getElementById('sv-svg') ? document.getElementById('sv-svg').value : (document.getElementById('text-input') ? document.getElementById('text-input').value : '');

    if (!raw.trim()) {
      if (out) out.value = 'ERROR: Please enter SVG code.';
      return;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(raw, 'image/svg+xml');
    const err = doc.querySelector('parsererror');

    if (err) {
      if (out) out.value = `ERROR: XML parsing failed: ${err.textContent}`;
      return;
    }

    const svgEl = doc.querySelector('svg');
    const w = svgEl ? svgEl.getAttribute('width') || '100%' : '100%';
    const h = svgEl ? svgEl.getAttribute('height') || '100%' : '100%';

    let res = `--- SVG CODE INSPECTOR REPORT ---nn`;
    res += `Status: ✅ VALID SVG XML DOCUMENTn`;
    res += `Width:  ${w}n`;
    res += `Height: ${h}nn`;
    res += `=== FORMATTED SVG MARKUP ===n${raw.trim()}`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('SVG validated and parsed!', 'success');
  }

  const activeBtn = document.getElementById('calc-sv-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
