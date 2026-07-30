/**
 * Octal Converter Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('oct-input')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Enter Octal, Decimal, Binary or Hex value:</label>
        <input type="text" id="oct-input" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="755">
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input Base:</label>
        <select id="oct-base" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
          <option value="8">Octal (base 8)</option>
          <option value="10">Decimal (base 10)</option>
          <option value="2">Binary (base 2)</option>
          <option value="16">Hexadecimal (base 16)</option>
        </select>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-oct-btn" class="btn btn-primary flex-1">🔄 Convert Octal</button>
      </div>
    `;
  }

  function calculate() {
    const val = (document.getElementById('oct-input')?.value || '').trim();
    const base = parseInt(document.getElementById('oct-base')?.value || '8');

    if (!val) { if (out) out.value = 'ERROR: Enter a value.'; return; }

    const dec = parseInt(val, base);
    if (isNaN(dec)) { if (out) out.value = `ERROR: "${val}" is not a valid base-${base} number.`; return; }

    let res = '--- OCTAL / BASE CONVERTER ---nn';
    res += `Input: ${val} (Base ${base})nn`;
    res += `Decimal: ${dec}n`;
    res += `Octal: ${dec.toString(8)}n`;
    res += `Binary: ${dec.toString(2)}n`;
    res += `Hexadecimal: 0x${dec.toString(16).toUpperCase()}n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Conversion complete!', 'success');
  }

  const activeBtn = document.getElementById('calc-oct-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
