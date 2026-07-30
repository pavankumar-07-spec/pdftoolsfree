/**
 * Password Strength & Entropy Analyzer Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('psc-pwd')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Enter Password to Analyze:</label>
        <input type="text" id="psc-pwd" class="form-input" value="P@ssw0rd2026!" style="width:100%;padding:0.6rem;font-size:1.1rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-psc-btn" class="btn btn-primary flex-1">🛡️ Analyze Password Strength</button>
      </div>
    `;
  }

  function analyzePassword(pwd) {
    const len = pwd.length;
    const hasLower = /[a-z]/.test(pwd);
    const hasUpper = /[A-Z]/.test(pwd);
    const hasDigit = /[0-9]/.test(pwd);
    const hasSymbol = /[^a-zA-Z0-9]/.test(pwd);

    let charsetSize = 0;
    if (hasLower) charsetSize += 26;
    if (hasUpper) charsetSize += 26;
    if (hasDigit) charsetSize += 10;
    if (hasSymbol) charsetSize += 32;

    const entropy = len * (charsetSize > 0 ? Math.log2(charsetSize) : 0);

    let score = 0;
    if (len >= 8) score += 20;
    if (len >= 12) score += 20;
    if (len >= 16) score += 10;
    if (hasLower && hasUpper) score += 20;
    if (hasDigit) score += 15;
    if (hasSymbol) score += 15;

    let rating = 'Weak 🔴';
    if (entropy >= 80) rating = 'Very Strong 🛡️🛡️🛡️';
    else if (entropy >= 60) rating = 'Strong 🛡️🛡️';
    else if (entropy >= 40) rating = 'Moderate 🟡';

    // Crack time estimation (at 100 billion guesses/sec)
    const totalCombinations = Math.pow(charsetSize, len);
    const crackSec = totalCombinations / 1e11;
    let crackTime = 'Instant';
    if (crackSec > 3153600000) crackTime = `${(crackSec / 31536000).toExponential(2)} Years`;
    else if (crackSec > 31536000) crackTime = `${Math.round(crackSec / 31536000)} Years`;
    else if (crackSec > 86400) crackTime = `${Math.round(crackSec / 86400)} Days`;
    else if (crackSec > 3600) crackTime = `${Math.round(crackSec / 3600)} Hours`;
    else if (crackSec > 60) crackTime = `${Math.round(crackSec / 60)} Minutes`;

    return { len, hasLower, hasUpper, hasDigit, hasSymbol, charsetSize, entropy, score, rating, crackTime };
  }

  function calculate() {
    const pwd = document.getElementById('psc-pwd') ? document.getElementById('psc-pwd').value : '';

    if (!pwd) {
      if (out) out.value = 'ERROR: Please enter a password to analyze.';
      return;
    }

    const r = analyzePassword(pwd);

    let res = `--- PASSWORD STRENGTH & ENTROPY REPORT ---nn`;
    res += `Tested Password: "${pwd}"n`;
    res += `Security Rating: ${r.rating}n`;
    res += `Score:           ${r.score} / 100n`;
    res += `Entropy:         ${r.entropy.toFixed(2)} bitsnn`;

    res += `=== CHARACTER DIVERSITY ===n`;
    res += `• Length:             ${r.len} charactersn`;
    res += `• Lowercase (a-z):    ${r.hasLower ? 'YES ✓' : 'NO ✗'}n`;
    res += `• Uppercase (A-Z):    ${r.hasUpper ? 'YES ✓' : 'NO ✗'}n`;
    res += `• Digits (0-9):       ${r.hasDigit ? 'YES ✓' : 'NO ✗'}n`;
    res += `• Special Symbols:    ${r.hasSymbol ? 'YES ✓' : 'NO ✗'}n`;
    res += `• Total Character Pool: ${r.charsetSize} charactersnn`;

    res += `=== ESTIMATED CRACK TIME ===n`;
    res += `Estimated Offline Crack Time: ${r.crackTime}n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Strength Score: ${r.score}/100`, 'success');
  }

  const activeBtn = document.getElementById('calc-psc-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
