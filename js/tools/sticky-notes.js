/**
 * Sticky Notes Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('sn-text')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Sticky Note Text:</label>
        <textarea id="sn-text" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">📌 Remember to push client-side JS engine updates before end of week!</textarea>
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Note Color Theme:</label>
        <select id="sn-color" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
          <option value="Yellow 🟡">Yellow 🟡</option>
          <option value="Blue 🔵">Blue 🔵</option>
          <option value="Green 🟢">Green 🟢</option>
          <option value="Pink 💗">Pink 💗</option>
        </select>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-sn-btn" class="btn btn-primary flex-1">📌 Create Sticky Note</button>
      </div>
    `;
  }

  function calculate() {
    const text = document.getElementById('sn-text') ? document.getElementById('sn-text').value : '';
    const color = document.getElementById('sn-color') ? document.getElementById('sn-color').value : 'Yellow 🟡';

    if (!text.trim()) {
      if (out) out.value = 'ERROR: Please enter note content.';
      return;
    }

    let res = `--- STICKY NOTE [${color.toUpperCase()}] ---nn`;
    res += `Created: ${new Date().toLocaleString()}nn`;
    res += `${text}n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Sticky note created!', 'success');
  }

  const activeBtn = document.getElementById('calc-sn-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
