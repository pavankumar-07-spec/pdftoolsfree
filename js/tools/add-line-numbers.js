/**
 * Add Line Numbers Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('aln-text')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input Text:</label>
        <textarea id="aln-text" class="form-input" style="width:100%;height:120px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">First line of contentnSecond line of contentnThird line of content</textarea>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Start Number:</label>
          <input type="number" id="aln-start" class="form-input" value="1" min="0" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Separator:</label>
          <input type="text" id="aln-sep" class="form-input" value=". " style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-aln-btn" class="btn btn-primary flex-1">🔢 Add Line Numbers</button>
      </div>
    `;
  }

  function calculate() {
    const text = document.getElementById('aln-text') ? document.getElementById('aln-text').value : (document.getElementById('text-input') ? document.getElementById('text-input').value : '');
    const startNum = parseInt(document.getElementById('aln-start') ? document.getElementById('aln-start').value : 1, 10) || 1;
    const sep = document.getElementById('aln-sep') ? document.getElementById('aln-sep').value : '. ';

    if (!text) {
      if (out) out.value = 'ERROR: Please enter text content.';
      return;
    }

    const lines = text.split('n');
    const totalDigits = (startNum + lines.length).toString().length;
    const numbered = lines.map((line, idx) => {
      const numStr = (startNum + idx).toString().padStart(totalDigits, ' ');
      return `${numStr}${sep}${line}`;
    }).join('n');

    if (out) out.value = numbered;
    if (window.showToast) window.showToast('Line numbers added successfully!', 'success');
  }

  const activeBtn = document.getElementById('calc-aln-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
