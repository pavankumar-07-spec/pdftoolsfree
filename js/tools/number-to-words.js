/**
 * Number to Words Converter Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('nw-num')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Enter Number (e.g. 1250000):</label>
        <input type="number" id="nw-num" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="1234567">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-nw-btn" class="btn btn-primary flex-1">🔢 Convert Number to Words</button>
      </div>
    `;
  }

  const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  function numToWords(n) {
    if (n === 0) return 'zero';
    if (n < 0) return 'minus ' + numToWords(Math.abs(n));
    let words = '';
    if (Math.floor(n / 1e9) > 0) { words += numToWords(Math.floor(n / 1e9)) + ' billion '; n %= 1e9; }
    if (Math.floor(n / 1e6) > 0) { words += numToWords(Math.floor(n / 1e6)) + ' million '; n %= 1e6; }
    if (Math.floor(n / 1000) > 0) { words += numToWords(Math.floor(n / 1000)) + ' thousand '; n %= 1000; }
    if (Math.floor(n / 100) > 0) { words += numToWords(Math.floor(n / 100)) + ' hundred '; n %= 100; }
    if (n > 0) {
      if (n < 20) words += ones[n];
      else {
        words += tens[Math.floor(n / 10)];
        if (n % 10 > 0) words += '-' + ones[n % 10];
      }
    }
    return words.trim();
  }

  function calculate() {
    const num = parseInt(document.getElementById('nw-num')?.value || 0);

    if (isNaN(num)) { if (out) out.value = 'ERROR: Enter a valid integer.'; return; }

    const english = numToWords(num);
    const capitalized = english.charAt(0).toUpperCase() + english.slice(1);

    let res = '--- NUMBER TO WORDS ---nn';
    res += `Number: ${num.toLocaleString()}nn`;
    res += `Words (English International):n${capitalized}nn`;
    res += `Financial / Cheque Format:n${capitalized} Onlyn`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Number converted to words!', 'success');
  }

  const activeBtn = document.getElementById('calc-nw-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
