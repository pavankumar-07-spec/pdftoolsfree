/**
 * Unicode Normalizer Engine (NFC, NFD, NFKC, NFKD)
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('nu-text')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input Unicode Text:</label>
        <textarea id="nu-text" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">eu0301 vs é (Combining Accent vs Canonical Composite)</textarea>
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Normalization Form:</label>
        <select id="nu-form" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
          <option value="NFC">NFC (Canonical Composition - Standard Web)</option>
          <option value="NFD">NFD (Canonical Decomposition)</option>
          <option value="NFKC">NFKC (Compatibility Composition)</option>
          <option value="NFKD">NFKD (Compatibility Decomposition)</option>
        </select>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-nu-btn" class="btn btn-primary flex-1">✨ Normalize Unicode Text</button>
      </div>
    `;
  }

  function calculate() {
    const text = document.getElementById('nu-text') ? document.getElementById('nu-text').value : (document.getElementById('text-input') ? document.getElementById('text-input').value : '');
    const form = document.getElementById('nu-form') ? document.getElementById('nu-form').value : 'NFC';

    if (!text) {
      if (out) out.value = 'ERROR: Please enter text.';
      return;
    }

    const normalized = text.normalize(form);

    let res = `--- UNICODE NORMALIZATION REPORT ---nn`;
    res += `Normalization Form: ${form}n`;
    res += `Original Length:    ${text.length} charsn`;
    res += `Normalized Length:  ${normalized.length} charsnn`;
    res += `=== NORMALIZED OUTPUT ===n${normalized}n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Normalized via ${form}!`, 'success');
  }

  const activeBtn = document.getElementById('calc-nu-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
