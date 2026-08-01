/**
 * Roman Numerals Converter Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('rn-input')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Enter Number (1-3999) or Roman Numeral (e.g. 2026 or MMXXVI):</label>
        <input type="text" id="rn-input" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="2026">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-rn-btn" class="btn btn-primary flex-1">🏛️ Convert Roman Numerals</button>
      </div>
    `;
  }

  function toRoman(num) {
    const map = [
      [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
      [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
      [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
    ];
    let result = '';
    for (const [val, roman] of map) {
      while (num >= val) { result += roman; num -= val; }
    }
    return result;
  }

  function fromRoman(str) {
    const map = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
    let total = 0;
    str = str.toUpperCase();
    for (let i = 0; i < str.length; i++) {
      const current = map[str[i]] || 0;
      const next = map[str[i + 1]] || 0;
      if (current < next) { total -= current; }
      else { total += current; }
    }
    return total;
  }

  function calculate() {
    const val = (document.getElementById('rn-input')?.value || '').trim();

    if (!val) { if (out) out.value = ''; return; }

    let res = '--- ROMAN NUMERAL CONVERTER ---nn';

    if (/^d+$/.test(val)) {
      const num = parseInt(val, 10);
      if (num < 1 || num > 3999) {
        if (out) out.value = 'ERROR: Standard Roman numerals support numbers between 1 and 3999.';
        return;
      }
      res += `Decimal Input: ${num}n`;
      res += `Roman Numeral: ${toRoman(num)}n`;
    } else if (/^[IVXLCDMivxlcdm]+$/.test(val)) {
      const num = fromRoman(val);
      res += `Roman Numeral Input: ${val.toUpperCase()}n`;
      res += `Decimal Output: ${num}n`;
    } else {
      res += 'ERROR: Invalid input. Enter a decimal number or Roman numeral string (I, V, X, L, C, D, M).';
    }

    if (out) out.value = res;
    if (window.showToast) window.showToast('Roman numeral converted!', 'success');
  }

  const activeBtn = document.getElementById('calc-rn-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
