/**
 * Text Reverser Engine
 * Supports Reversing Characters, Words, Lines, & Upside-Down Flip
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('tr-text')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input Text:</label>
        <textarea id="tr-text" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">Hello World! The quick brown fox jumps over the lazy dog.</textarea>
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Reversal Mode:</label>
        <select id="tr-mode" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
          <option value="all">Display All Reversal Modes</option>
          <option value="chars">Reverse Entire Text (Character by Character)</option>
          <option value="words">Reverse Words Order</option>
          <option value="lines">Reverse Lines Order</option>
          <option value="flip">Flip Upside-Down 🙃</option>
        </select>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-tr-btn" class="btn btn-primary flex-1">🔄 Reverse Text</button>
      </div>
    `;
  }

  const flipMap = {
    'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': 'ɟ', 'g': 'ƃ', 'h': 'ɥ', 'i': 'ᴉ', 'j': 'ɾ',
    'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u', 'o': 'o', 'p': 'd', 'q': 'b', 'r': 'ɹ', 's': 's', 't': 'ʇ',
    'u': 'n', 'v': 'ʌ', 'w': 'ʍ', 'x': 'x', 'y': 'ʎ', 'z': 'z',
    'A': '∀', 'B': '𐐒', 'C': 'Ɔ', 'D': '◖', 'E': 'Ǝ', 'F': 'Ⅎ', 'G': '⅁', 'H': 'H', 'I': 'I', 'J': 'ſ',
    'K': 'ʞ', 'L': 'Ꞁ', 'M': 'W', 'N': 'N', 'O': 'O', 'P': 'Ԁ', 'Q': 'Ό', 'R': 'ᴚ', 'S': 'S', 'T': '┴',
    'U': '∩', 'V': 'Λ', 'W': 'M', 'X': 'X', 'Y': '⅄', 'Z': 'Z',
    '0': '0', '1': 'Ɩ', '2': '乙', '3': 'Ɛ', '4': 'ㄣ', '5': 'ϛ', '6': '9', '7': 'ㄥ', '8': '8', '9': '6',
    '.': '˙', ',': '\'', '\'': ',', '"': '„', '!': '¡', '?': '¿', '(': ')', ')': '(', '[': ']', ']': '[',
    '{': '}', '}': '{', '<': '>', '>': '<', '_': '‾'
  };

  function flipUpsideDown(str) {
    return str.split('').map(c => flipMap[c] || c).reverse().join('');
  }

  function calculate() {
    const text = document.getElementById('tr-text') ? document.getElementById('tr-text').value : (document.getElementById('text-input') ? document.getElementById('text-input').value : '');
    const mode = document.getElementById('tr-mode') ? document.getElementById('tr-mode').value : 'all';

    if (!text) {
      if (out) out.value = 'ERROR: Please enter text to reverse.';
      return;
    }

    const revChars = text.split('').reverse().join('');
    const revWords = text.split(/s+/).reverse().join(' ');
    const revLines = text.split('n').reverse().join('n');
    const flipped = flipUpsideDown(text);

    let res = '';
    if (mode === 'chars') {
      res = revChars;
    } else if (mode === 'words') {
      res = revWords;
    } else if (mode === 'lines') {
      res = revLines;
    } else if (mode === 'flip') {
      res = flipped;
    } else {
      res = `--- TEXT REVERSER RESULTS ---nn`;
      res += `1. REVERSED CHARACTERS:n${revChars}nn`;
      res += `2. REVERSED WORDS:n${revWords}nn`;
      res += `3. REVERSED LINES:n${revLines}nn`;
      res += `4. UPSIDE-DOWN FLIPPED:n${flipped}n`;
    }

    if (out) out.value = res;
    if (window.showToast) window.showToast('Text reversed successfully!', 'success');
  }

  const activeBtn = document.getElementById('calc-tr-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
