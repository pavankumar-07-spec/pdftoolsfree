/**
 * Morse Code Encoder Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('mc-src')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Enter English Text:</label>
        <textarea id="mc-src" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">SOS Hello World</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-mc-btn" class="btn btn-primary flex-1">📻 Encode to Morse Code</button>
      </div>
    `;
  }

  const MORSE_MAP = {
    A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..',
    0: '-----', 1: '.----', 2: '..---', 3: '...--', 4: '....-', 5: '.....', 6: '-....', 7: '--...', 8: '---..', 9: '----.',
    ' ': '/'
  };

  function calculate() {
    const raw = (document.getElementById('mc-src')?.value || '').trim();

    if (!raw) { if (out) out.value = ''; return; }

    const encoded = raw.toUpperCase().split('').map(ch => MORSE_MAP[ch] || ch).join(' ');

    let res = '--- MORSE CODE OUTPUT ---nn';
    res += encoded;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Encoded to Morse Code!', 'success');
  }

  const activeBtn = document.getElementById('calc-mc-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
