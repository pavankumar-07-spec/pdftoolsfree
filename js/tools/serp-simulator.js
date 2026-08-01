/**
 * Google SERP Simulator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('ss-title')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">SEO Meta Title:</label>
        <input type="text" id="ss-title" class="form-input" value="Free PDF Tools & B.Tech Math Calculators Online | FreeToolsPDF" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Canonical URL:</label>
        <input type="text" id="ss-url" class="form-input" value="https://pdftoolsfree.in/tools/pdf-to-word.html" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">SEO Meta Description:</label>
        <textarea id="ss-desc" class="form-input" style="width:100%;height:70px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">Convert PDF to Word online for free. Fast, 100% private, and local browser processing without registration.</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-ss-btn" class="btn btn-primary flex-1">🌐 Render SERP Snippet Preview</button>
      </div>
    `;
  }

  function calculate() {
    const title = document.getElementById('ss-title') ? document.getElementById('ss-title').value.trim() : '';
    const url = document.getElementById('ss-url') ? document.getElementById('ss-url').value.trim() : '';
    const desc = document.getElementById('ss-desc') ? document.getElementById('ss-desc').value.trim() : '';

    const titleTrunc = title.length > 60 ? title.slice(0, 57) + '...' : title;
    const descTrunc = desc.length > 160 ? desc.slice(0, 157) + '...' : desc;

    let res = `--- GOOGLE SERP SIMULATOR REPORT ---nn`;
    res += `=== DESKTOP SEARCH RESULT PREVIEW ===n`;
    res += `URL:   ${url}n`;
    res += `TITLE: ${titleTrunc} (${title.length} chars)n`;
    res += `DESC:  ${descTrunc} (${desc.length} chars)nn`;

    res += `=== TRUNCATION ANALYSIS ===n`;
    res += `• Title Truncation:       ${title.length > 60 ? '⚠️ Exceeds 60 chars' : '✅ Fits desktop 600px width'}n`;
    res += `• Description Truncation: ${desc.length > 160 ? '⚠️ Exceeds 160 chars' : '✅ Fits desktop 960px snippet'}n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('SERP Preview generated!', 'success');
  }

  const activeBtn = document.getElementById('calc-ss-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
