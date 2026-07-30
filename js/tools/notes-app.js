/**
 * Client-Side Quick Notes Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('na-title')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Note Title:</label>
        <input type="text" id="na-title" class="form-input" value="B.Tech Math Formulas Summary" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Note Body:</label>
        <textarea id="na-body" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">- Cramer's Rule: det(Ai) / det(A)n- Exponential eigenvalues det(A - λI) = 0n- Vector Dot Product: sum(ui * vi)</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-na-btn" class="btn btn-primary flex-1">📝 Save Note</button>
      </div>
    `;
  }

  function calculate() {
    const title = document.getElementById('na-title') ? document.getElementById('na-title').value : 'Untitled Note';
    const body = document.getElementById('na-body') ? document.getElementById('na-body').value : '';

    let res = `--- QUICK NOTE ---nn`;
    res += `Title: ${title}n`;
    res += `Saved At: ${new Date().toLocaleString()}nn`;
    res += `=== NOTE CONTENT ===n`;
    res += `${body}n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Note saved!', 'success');
  }

  const activeBtn = document.getElementById('calc-na-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
