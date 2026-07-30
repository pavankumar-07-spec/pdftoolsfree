/**
 * Shopping & Grocery List Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('sl-items')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Shopping Items (One per line):</label>
        <textarea id="sl-items" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">Milk - 2 GallonsnOrganic Eggs - 1 DozennWhole Wheat Bread - 2 LoavesnFresh Apples - 1 Bag</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-sl-btn" class="btn btn-primary flex-1">🛒 Generate Shopping List</button>
      </div>
    `;
  }

  function calculate() {
    const text = document.getElementById('sl-items') ? document.getElementById('sl-items').value : (document.getElementById('text-input') ? document.getElementById('text-input').value : '');

    if (!text.trim()) {
      if (out) out.value = 'ERROR: Please enter shopping list items.';
      return;
    }

    const items = text.split('n').filter(i => i.trim());

    let res = `--- SHOPPING & GROCERY LIST ---nn`;
    res += `Total Items to Buy: ${items.length}nn`;
    items.forEach((item, idx) => {
      res += `☐ ${idx + 1}. ${item}n`;
    });

    if (out) out.value = res;
    if (window.showToast) window.showToast('Shopping list generated!', 'success');
  }

  const activeBtn = document.getElementById('calc-sl-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
