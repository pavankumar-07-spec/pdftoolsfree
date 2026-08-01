/**
 * Meta Description Length & Pixel Width Checker Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('mdlc-desc')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Meta Description Snippet:</label>
        <textarea id="mdlc-desc" class="form-input" style="width:100%;height:80px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">FreeToolsPDF offers 100% free and private client-side online PDF conversion and engineering math tools. No login or registration required.</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-mdlc-btn" class="btn btn-primary flex-1">🔍 Analyze Meta Description Length</button>
      </div>
    `;
  }

  function calculate() {
    const desc = document.getElementById('mdlc-desc') ? document.getElementById('mdlc-desc').value.trim() : '';

    const len = desc.length;
    const estPixelWidth = Math.round(len * 6.2); // ~960px Google desktop snippet limit (around 150-160 chars)

    let status = 'Optimal Length (120-160 chars) ✅';
    if (len < 120) status = 'Too Short (< 120 chars) ⚠️';
    if (len > 160) status = 'Too Long (> 160 chars - Truncation likely) ❌';

    let res = `--- META DESCRIPTION LENGTH REPORT ---nn`;
    res += `Status: ${status}n`;
    res += `Character Count: ${len} / 160 charactersn`;
    res += `Est. Pixel Width: ~${estPixelWidth}px / 960pxnn`;

    res += `=== GOOGLE SERP PREVIEW ===n`;
    res += `${len > 160 ? desc.slice(0, 157) + '...' : desc}n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Meta Description: ${len} chars`, 'success');
  }

  const activeBtn = document.getElementById('calc-mdlc-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
