/**
 * Secure Password & Diceware Passphrase Generator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('spg-type')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Generator Type:</label>
        <select id="spg-type" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
          <option value="passphrase">Memorable Diceware Passphrase (e.g. correct-horse-battery-staple)</option>
          <option value="complex">High-Entropy Complex Password</option>
        </select>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Length / Words Count:</label>
          <input type="number" id="spg-len" class="form-input" value="4" min="3" max="32" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Word Separator / Symbol:</label>
          <input type="text" id="spg-sep" class="form-input" value="-" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-spg-btn" class="btn btn-primary flex-1">🎲 Generate Cryptographic Passphrase</button>
      </div>
    `;
  }

  const dicewareWords = [
    'correct', 'horse', 'battery', 'staple', 'rocket', 'falcon', 'galaxy', 'quantum',
    'shadow', 'thunder', 'phoenix', 'dragon', 'wizard', 'castle', 'matrix', 'vector',
    'silver', 'golden', 'crystal', 'diamond', 'cosmic', 'nebula', 'planet', 'meteor',
    'anchor', 'beacon', 'breeze', 'canyon', 'forest', 'island', 'jungle', 'mountain',
    'river', 'sunset', 'timber', 'valley', 'volcano', 'whisper', 'winter', 'zenith'
  ];

  function getSecureRandomInt(max) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] % max;
  }

  function generatePassphrase(wordsCount, sep) {
    const chosen = [];
    for (let i = 0; i < wordsCount; i++) {
      const idx = getSecureRandomInt(dicewareWords.length);
      chosen.push(dicewareWords[idx]);
    }
    return chosen.join(sep);
  }

  function generateComplexPassword(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let res = '';
    for (let i = 0; i < length; i++) {
      const idx = getSecureRandomInt(chars.length);
      res += chars[idx];
    }
    return res;
  }

  function calculate() {
    const type = document.getElementById('spg-type') ? document.getElementById('spg-type').value : 'passphrase';
    const len = parseInt(document.getElementById('spg-len') ? document.getElementById('spg-len').value : 4, 10) || 4;
    const sep = document.getElementById('spg-sep') ? document.getElementById('spg-sep').value : '-';

    let pass = '';
    let entropy = 0;

    if (type === 'passphrase') {
      pass = generatePassphrase(len, sep);
      entropy = len * Math.log2(dicewareWords.length);
    } else {
      const charLen = Math.max(8, len * 4);
      pass = generateComplexPassword(charLen);
      entropy = charLen * Math.log2(90);
    }

    let res = `--- CRYPTOGRAPHICALLY SECURE PASSPHRASE GENERATOR ---nn`;
    res += `=== GENERATED PASSPHRASE / PASSWORD ===n`;
    res += `${pass}nn`;

    res += `=== SECURITY METRICS ===n`;
    res += `• Type:               ${type === 'passphrase' ? 'Diceware Passphrase' : 'Complex Character String'}n`;
    res += `• Estimated Entropy:  ${entropy.toFixed(1)} bitsn`;
    res += `• Randomness Source:  window.crypto.getRandomValues()n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Secure passphrase generated!', 'success');
  }

  const activeBtn = document.getElementById('calc-spg-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
