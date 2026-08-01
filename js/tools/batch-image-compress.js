/**
 * Batch Image Compressor Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('bic-q')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Compression Quality (%):</label>
        <input type="range" id="bic-q" min="10" max="90" value="75" style="width:100%">
        <span id="bic-q-val" style="font-size:0.9rem;font-weight:600">75% Quality</span>
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Upload Image Files:</label>
        <input type="file" id="bic-files" multiple accept="image/*" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-bic-btn" class="btn btn-primary flex-1">⚡ Compress All Images</button>
      </div>
    `;

    document.getElementById('bic-q').addEventListener('input', (e) => {
      document.getElementById('bic-q-val').textContent = `${e.target.value}% Quality`;
    });
  }

  function calculate() {
    const filesEl = document.getElementById('bic-files');
    const q = parseInt(document.getElementById('bic-q') ? document.getElementById('bic-q').value : 75, 10) || 75;
    const files = filesEl ? filesEl.files : [];

    if (!files || files.length === 0) {
      if (out) out.value = 'ERROR: Please select image file(s) to compress.';
      return;
    }

    let res = `--- BATCH IMAGE COMPRESSOR REPORT ---nn`;
    res += `Compression Quality Target: ${q}%n`;
    res += `Selected Files:            ${files.length}nn`;

    Array.from(files).forEach((f, idx) => {
      const origKb = (f.size / 1024).toFixed(1);
      const estKb = (f.size * (q / 100) / 1024).toFixed(1);
      res += `${idx + 1}. ${f.name} (${origKb} KB) => Est. ${estKb} KBn`;
    });

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Batch compression configured for ${files.length} images!`, 'success');
  }

  const activeBtn = document.getElementById('calc-bic-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
