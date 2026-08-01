/**
 * Reverse Words Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const ic = document.getElementById('tool-inputs-container');
  const out = document.getElementById('main-output');
  if (ic && !document.getElementById('rw-input')) {
    ic.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label">Input Text</label>
        <textarea id="rw-input" class="form-input" rows="4" placeholder="Enter text...">Hello World from PDFToolsFree</textarea>
      </div>
      <div style="margin-bottom:1.5rem">
        <label class="form-label">Reverse Mode</label>
        <select id="rw-mode" class="form-input">
          <option value="words" selected>Reverse Word Order</option>
          <option value="chars">Reverse Each Word's Characters</option>
          <option value="both">Reverse Both</option>
        </select>
      </div>
      <button id="calc-rw-btn" class="btn btn-primary" style="width:100%">🔄 Reverse Words</button>
    `;
  }
  function reverse() {
    try {
      const input = document.getElementById('rw-input')?.value || '';
      const mode = document.getElementById('rw-mode')?.value || 'words';
      const words = input.split(/\s+/);
      let result = '';
      if (mode === 'words') result = words.reverse().join(' ');
      else if (mode === 'chars') result = words.map(w => w.split('').reverse().join('')).join(' ');
      else result = words.reverse().map(w => w.split('').reverse().join('')).join(' ');
      if (out) out.value = result;
      if (window.showToast) window.showToast('Reversed ' + words.length + ' words!', 'success');
    } catch (e) { if (out) out.value = 'Error: ' + e.message; }
  }
  const b = document.getElementById('calc-rw-btn') || document.getElementById('generate-btn');
  if (b) b.onclick = reverse;
  const sel = document.getElementById('rw-mode');
  if (sel) sel.onchange = reverse;
  reverse();
});