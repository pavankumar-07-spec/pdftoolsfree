/**
 * Morse Code Decoder Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('mcd-morse')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input Morse Code (Dots '.' and Dashes '-'):</label>
        <textarea id="mcd-morse" class="form-input" style="width:100%;height:100px;padding:0.5rem;font-family:monospace;font-size:1.1rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">.... . .-.. .-.. --- / .-- --- .-. .-.. -..</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-mcd-btn" class="btn btn-primary flex-1">📻 Decode Morse Code</button>
      </div>
    `;
  }

  const morseToChar = {
    '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E', '..-.': 'F',
    '--.': 'G', '....': 'H', '..': 'I', '.---': 'J', '-.-': 'K', '.-..': 'L',
    '--': 'M', '-.': 'N', '---': 'O', '.--.': 'P', '--.-': 'Q', '.-.': 'R',
    '...': 'S', '-': 'T', '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X',
    '-.--': 'Y', '--..': 'Z',
    '-----': '0', '.----': '1', '..---': '2', '...--': '3', '....-': '4',
    '.....': '5', '-....': '6', '--...': '7', '---..': '8', '----.': '9',
    '.-.-.-': '.', '--..--': ',', '..--..': '?', '.----.': "'", '-.-.--': '!',
    '-..-.': '/', '-.--.': '(', '-.--.-': ')', '.-...': '&', '---...': ':',
    '-.-.-.': ';', '-...-': '=', '.-.-.': '+', '-....-': '-', '..--.-': '_',
    '.-..-.': '"', '...-..-': '$', '.--.-.': '@'
  };

  function decodeMorse(morseText) {
    // Standard Morse: words separated by ' / ' or double spaces, letters separated by single space
    const words = morseText.trim().split(/\s+\/\s+|\s{2,}/);

    return words.map(word => {
      const letters = word.trim().split(/s+/);
      return letters.map(code => morseToChar[code] || '?').join('');
    }).join(' ');
  }

  function calculate() {
    const rawMorse = document.getElementById('mcd-morse') ? document.getElementById('mcd-morse').value : (document.getElementById('text-input') ? document.getElementById('text-input').value : '');

    if (!rawMorse.trim()) {
      if (out) out.value = 'ERROR: Please enter Morse code to decode.';
      return;
    }

    const decoded = decodeMorse(rawMorse);

    let res = `--- MORSE CODE DECODER RESULTS ---nn`;
    res += `Input Morse: ${rawMorse}nn`;
    res += `=== DECODED ASCII TEXT ===n`;
    res += `${decoded}n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Morse code decoded!', 'success');
  }

  const activeBtn = document.getElementById('calc-mcd-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
