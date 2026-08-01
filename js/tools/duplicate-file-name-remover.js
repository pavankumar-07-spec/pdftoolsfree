/**
 * Duplicate File Name Deduplicator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('dfnr-names')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">List of File Names (Line separated):</label>
        <textarea id="dfnr-names" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">document.pdfnimage.pngndocument.pdfnnotes.txtnimage.png</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-dfnr-btn" class="btn btn-primary flex-1">✂️ Deduplicate File Names</button>
      </div>
    `;
  }

  function calculate() {
    const text = document.getElementById('dfnr-names') ? document.getElementById('dfnr-names').value : (document.getElementById('text-input') ? document.getElementById('text-input').value : '');

    if (!text.trim()) {
      if (out) out.value = 'ERROR: Please enter file names.';
      return;
    }

    const lines = text.split('n').filter(l => l.trim());
    const unique = Array.from(new Set(lines));

    let res = `--- DUPLICATE FILE NAME REMOVER REPORT ---nn`;
    res += `Total Scanned Names: ${lines.length}n`;
    res += `Duplicates Removed:  ${lines.length - unique.length}n`;
    res += `Unique File Names:   ${unique.length}nn`;

    res += `=== DEDUPLICATED FILE LIST ===n`;
    res += unique.join('n');

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Removed ${lines.length - unique.length} duplicate file names!`, 'success');
  }

  const activeBtn = document.getElementById('calc-dfnr-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
