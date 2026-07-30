/**
 * MD4 Digest Generator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('md4-text')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input Text String:</label>
        <textarea id="md4-text" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">The quick brown fox jumps over the lazy dog</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-md4-btn" class="btn btn-primary flex-1">🔐 Compute MD4 Digest</button>
      </div>
    `;
  }

  // Pure JavaScript MD4 RFC 1320 Implementation
  function md4(str) {
    function rol(n, c) { return (n << c) | (n >>> (32 - c)); }
    function f(x, y, z) { return (x & y) | ((~x) & z); }
    function g(x, y, z) { return (x & y) | (x & z) | (y & z); }
    function h(x, y, z) { return x ^ y ^ z; }

    const enc = new TextEncoder();
    const bytes = Array.from(enc.encode(str));
    const bitLen = bytes.length * 8;

    bytes.push(0x80);
    while ((bytes.length % 64) !== 56) bytes.push(0);

    for (let i = 0; i < 8; i++) {
      bytes.push((bitLen >>> (i * 8)) & 0xff);
    }

    let A = 0x67452301, B = 0xefcdab89, C = 0x98badcfe, D = 0x10325476;

    for (let i = 0; i < bytes.length; i += 64) {
      const X = [];
      for (let j = 0; j < 16; j++) {
        X[j] = bytes[i + j * 4] | (bytes[i + j * 4 + 1] << 8) | (bytes[i + j * 4 + 2] << 16) | (bytes[i + j * 4 + 3] << 24);
      }

      let a = A, b = B, c = C, d = D;

      // Round 1
      a = rol(a + f(b, c, d) + X[0], 3);  d = rol(d + f(a, b, c) + X[1], 7);  c = rol(c + f(d, a, b) + X[2], 11); b = rol(b + f(c, d, a) + X[3], 19);
      a = rol(a + f(b, c, d) + X[4], 3);  d = rol(d + f(a, b, c) + X[5], 7);  c = rol(c + f(d, a, b) + X[6], 11); b = rol(b + f(c, d, a) + X[7], 19);
      a = rol(a + f(b, c, d) + X[8], 3);  d = rol(d + f(a, b, c) + X[9], 7);  c = rol(c + f(d, a, b) + X[10], 11); b = rol(b + f(c, d, a) + X[11], 19);
      a = rol(a + f(b, c, d) + X[12], 3); d = rol(d + f(a, b, c) + X[13], 7); c = rol(c + f(d, a, b) + X[14], 11); b = rol(b + f(c, d, a) + X[15], 19);

      // Round 2
      a = rol(a + g(b, c, d) + X[0] + 0x5a827999, 3);  d = rol(d + g(a, b, c) + X[4] + 0x5a827999, 5);  c = rol(c + g(d, a, b) + X[8] + 0x5a827999, 9);  b = rol(b + g(c, d, a) + X[12] + 0x5a827999, 13);
      a = rol(a + g(b, c, d) + X[1] + 0x5a827999, 3);  d = rol(d + g(a, b, c) + X[5] + 0x5a827999, 5);  c = rol(c + g(d, a, b) + X[9] + 0x5a827999, 9);  b = rol(b + g(c, d, a) + X[13] + 0x5a827999, 13);
      a = rol(a + g(b, c, d) + X[2] + 0x5a827999, 3);  d = rol(d + g(a, b, c) + X[6] + 0x5a827999, 5);  c = rol(c + g(d, a, b) + X[10] + 0x5a827999, 9); b = rol(b + g(c, d, a) + X[14] + 0x5a827999, 13);
      a = rol(a + g(b, c, d) + X[3] + 0x5a827999, 3);  d = rol(d + g(a, b, c) + X[7] + 0x5a827999, 5);  c = rol(c + g(d, a, b) + X[11] + 0x5a827999, 9); b = rol(b + g(c, d, a) + X[15] + 0x5a827999, 13);

      // Round 3
      a = rol(a + h(b, c, d) + X[0] + 0x6ed9eba1, 3);  d = rol(d + h(a, b, c) + X[8] + 0x6ed9eba1, 9);  c = rol(c + h(d, a, b) + X[4] + 0x6ed9eba1, 11); b = rol(b + h(c, d, a) + X[12] + 0x6ed9eba1, 15);
      a = rol(a + h(b, c, d) + X[2] + 0x6ed9eba1, 3);  d = rol(d + h(a, b, c) + X[10] + 0x6ed9eba1, 9); c = rol(c + h(d, a, b) + X[6] + 0x6ed9eba1, 11); b = rol(b + h(c, d, a) + X[14] + 0x6ed9eba1, 15);
      a = rol(a + h(b, c, d) + X[1] + 0x6ed9eba1, 3);  d = rol(d + h(a, b, c) + X[9] + 0x6ed9eba1, 9);  c = rol(c + h(d, a, b) + X[5] + 0x6ed9eba1, 11); b = rol(b + h(c, d, a) + X[13] + 0x6ed9eba1, 15);
      a = rol(a + h(b, c, d) + X[3] + 0x6ed9eba1, 3);  d = rol(d + h(a, b, c) + X[11] + 0x6ed9eba1, 9); c = rol(c + h(d, a, b) + X[7] + 0x6ed9eba1, 11); b = rol(b + h(c, d, a) + X[15] + 0x6ed9eba1, 15);

      A = (A + a) >>> 0;
      B = (B + b) >>> 0;
      C = (C + c) >>> 0;
      D = (D + d) >>> 0;
    }

    function toHex(n) {
      let hex = '';
      for (let i = 0; i < 4; i++) {
        hex += ((n >>> (i * 8)) & 0xff).toString(16).padStart(2, '0');
      }
      return hex;
    }

    return toHex(A) + toHex(B) + toHex(C) + toHex(D);
  }

  function calculate() {
    const text = document.getElementById('md4-text') ? document.getElementById('md4-text').value : (document.getElementById('text-input') ? document.getElementById('text-input').value : '');

    if (!text) {
      if (out) out.value = 'ERROR: Please enter input text to compute MD4 hash.';
      return;
    }

    const hash = md4(text);

    let res = `--- MD4 DIGEST CALCULATOR ---nn`;
    res += `Input Text: "${text}"n`;
    res += `MD4 Hash:   ${hash}n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('MD4 hash computed!', 'success');
  }

  const activeBtn = document.getElementById('calc-md4-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
