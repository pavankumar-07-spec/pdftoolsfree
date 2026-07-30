/**
 * String Splitter & Text Delimiter Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('ss-text')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input Text:</label>
        <textarea id="ss-text" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">apple, banana, orange, grape, watermelon</textarea>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Split Delimiter:</label>
          <input type="text" id="ss-delim" class="form-input" value="," style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Output Joiner:</label>
          <select id="ss-join" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
            <option value="newline">New Line (n)</option>
            <option value="comma">Comma & Space (, )</option>
            <option value="pipe">Pipe ( | )</option>
            <option value="json">JSON Array</option>
          </select>
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-ss-btn" class="btn btn-primary flex-1">✂️ Split String</button>
      </div>
    `;
  }

  function calculate() {
    const text = document.getElementById('ss-text') ? document.getElementById('ss-text').value : (document.getElementById('text-input') ? document.getElementById('text-input').value : '');
    const delim = document.getElementById('ss-delim') ? document.getElementById('ss-delim').value : ',';
    const joinMode = document.getElementById('ss-join') ? document.getElementById('ss-join').value : 'newline';

    if (!text) {
      if (out) out.value = 'ERROR: Please enter input text to split.';
      return;
    }

    const parts = text.split(delim).map(p => p.trim()).filter(p => p.length > 0);

    let res = '';
    if (joinMode === 'json') {
      res = JSON.stringify(parts, null, 2);
    } else if (joinMode === 'pipe') {
      res = parts.join(' | ');
    } else if (joinMode === 'comma') {
      res = parts.join(', ');
    } else {
      res = parts.join('n');
    }

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Split into ${parts.length} segments!`, 'success');
  }

  const activeBtn = document.getElementById('calc-ss-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
