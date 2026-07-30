/**
 * Bullet List Generator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('bl-text')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input Items (one per line):</label>
        <textarea id="bl-text" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">First itemnSecond itemnThird item</textarea>
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">List Style:</label>
        <select id="bl-style" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
          <option value="dash" selected>- Dash (- Item)</option>
          <option value="bullet">• Bullet (• Item)</option>
          <option value="num">1. Numbered (1. Item)</option>
          <option value="html">HTML (&lt;li&gt;Item&lt;/li&gt;)</option>
        </select>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-bl-btn" class="btn btn-primary flex-1">📋 Format Bullet List</button>
      </div>
    `;
  }

  function calculate() {
    const raw = (document.getElementById('bl-text')?.value || '').trim();
    const style = document.getElementById('bl-style')?.value || 'dash';

    if (!raw) { if (out) out.value = ''; return; }

    const lines = raw.split('n').map(l => l.trim()).filter(Boolean);
    let result = '';

    if (style === 'dash') {
      result = lines.map(l => `- ${l}`).join('n');
    } else if (style === 'bullet') {
      result = lines.map(l => `• ${l}`).join('n');
    } else if (style === 'num') {
      result = lines.map((l, i) => `${i + 1}. ${l}`).join('n');
    } else if (style === 'html') {
      result = '<ul>n' + lines.map(l => `  <li>${l}</li>`).join('n') + 'n</ul>';
    }

    if (out) out.value = result;
    if (window.showToast) window.showToast('List generated!', 'success');
  }

  const activeBtn = document.getElementById('calc-bl-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
