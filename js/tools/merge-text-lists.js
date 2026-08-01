/**
 * Merge Text Lists Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('mtl-list1')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">List A (Line separated):</label>
          <textarea id="mtl-list1" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">ApplenBanananCherry</textarea>
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">List B (Line separated):</label>
          <textarea id="mtl-list2" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">BanananDatenElderberry</textarea>
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-mtl-btn" class="btn btn-primary flex-1">🔗 Merge Lists</button>
      </div>
    `;
  }

  function calculate() {
    const list1 = document.getElementById('mtl-list1') ? document.getElementById('mtl-list1').value.split('n').filter(l => l.trim()) : [];
    const list2 = document.getElementById('mtl-list2') ? document.getElementById('mtl-list2').value.split('n').filter(l => l.trim()) : [];

    const combined = [...list1, ...list2];
    const unique = Array.from(new Set(combined));

    let res = `--- MERGED LIST RESULTS ---nn`;
    res += `Total Combined Items: ${combined.length}n`;
    res += `Unique Items:         ${unique.length}nn`;
    res += `=== MERGED UNIQUE LIST ===n`;
    res += unique.join('n');

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Merged ${unique.length} unique items!`, 'success');
  }

  const activeBtn = document.getElementById('calc-mtl-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
