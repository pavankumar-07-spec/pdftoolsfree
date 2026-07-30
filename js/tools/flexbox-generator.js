/**
 * CSS Flexbox Playground & Code Generator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('fg-dir')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Flex Direction:</label>
          <select id="fg-dir" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
            <option value="row">row</option>
            <option value="column">column</option>
            <option value="row-reverse">row-reverse</option>
          </select>
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Justify Content:</label>
          <select id="fg-justify" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
            <option value="center">center</option>
            <option value="space-between">space-between</option>
            <option value="space-around">space-around</option>
            <option value="flex-start">flex-start</option>
            <option value="flex-end">flex-end</option>
          </select>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Align Items:</label>
          <select id="fg-align" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
            <option value="center">center</option>
            <option value="stretch">stretch</option>
            <option value="flex-start">flex-start</option>
            <option value="flex-end">flex-end</option>
          </select>
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Flex Wrap:</label>
          <select id="fg-wrap" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
            <option value="wrap">wrap</option>
            <option value="nowrap">nowrap</option>
          </select>
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-fg-btn" class="btn btn-primary flex-1">🎨 Generate Flexbox CSS</button>
      </div>
    `;
  }

  function calculate() {
    const dir = document.getElementById('fg-dir') ? document.getElementById('fg-dir').value : 'row';
    const justify = document.getElementById('fg-justify') ? document.getElementById('fg-justify').value : 'center';
    const align = document.getElementById('fg-align') ? document.getElementById('fg-align').value : 'center';
    const wrap = document.getElementById('fg-wrap') ? document.getElementById('fg-wrap').value : 'wrap';

    let css = `/* CSS Flexbox Container Rules */n`;
    css += `.flex-container {n`;
    css += `  display: flex;n`;
    css += `  flex-direction: ${dir};n`;
    css += `  justify-content: ${justify};n`;
    css += `  align-items: ${align};n`;
    css += `  flex-wrap: ${wrap};n`;
    css += `  gap: 1rem;n`;
    css += `}`;

    if (out) out.value = css;
    if (window.showToast) window.showToast('Flexbox CSS rules generated!', 'success');
  }

  const activeBtn = document.getElementById('calc-fg-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
