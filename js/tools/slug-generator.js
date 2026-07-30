/**
 * Slug Generator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('slug-title')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Enter Title or String:</label>
        <input type="text" id="slug-title" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="Free Online PDF & Developer Tools 2026!">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-slug-btn" class="btn btn-primary flex-1">🔗 Generate URL Slug</button>
      </div>
    `;
  }

  function calculate() {
    const val = (document.getElementById('slug-title')?.value || '').trim();

    if (!val) {
      if (out) out.value = '';
      return;
    }

    const slug = val
      .toLowerCase()
      .normalize('NFD')
      .replace(/[u0300-u036f]/g, '')
      .replace(/[^a-z0-9s-]/g, '')
      .trim()
      .replace(/s+/g, '-')
      .replace(/-+/g, '-');

    let res = '--- GENERATED URL SLUG ---nn';
    res += slug;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Slug generated!', 'success');
  }

  const activeBtn = document.getElementById('calc-slug-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
