/**
 * Title Length & Pixel Width Checker Engine (Alias)
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('tlc-title')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">SEO Title Tag:</label>
        <input type="text" id="tlc-title" class="form-input" value="100% Free Online PDF Tools & Calculators | FreeToolsPDF" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-tlc-btn" class="btn btn-primary flex-1">🔍 Analyze Title Tag</button>
      </div>
    `;
  }

  function calculate() {
    const title = document.getElementById('tlc-title') ? document.getElementById('tlc-title').value.trim() : '';

    const len = title.length;
    const estPx = Math.round(len * 9.5); // ~600px desktop limit (50-60 chars)

    let status = 'Optimal Length (50-60 chars) ✅';
    if (len < 40) status = 'Too Short (< 40 chars) ⚠️';
    if (len > 60) status = 'Too Long (> 60 chars - Truncation likely) ❌';

    let res = `--- SEO TITLE TAG LENGTH REPORT ---nn`;
    res += `Status: ${status}n`;
    res += `Character Count: ${len} / 60 charactersn`;
    res += `Est. Pixel Width: ~${estPx}px / 600pxnn`;

    res += `=== SERP TITLE PREVIEW ===n`;
    res += `${len > 60 ? title.slice(0, 57) + '...' : title}n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Title Tag: ${len} chars`, 'success');
  }

  const activeBtn = document.getElementById('calc-tlc-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
