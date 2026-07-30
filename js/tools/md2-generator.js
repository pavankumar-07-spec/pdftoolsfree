/**
 * MD2 Digest Generator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('md2-text')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input Text String:</label>
        <textarea id="md2-text" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">The quick brown fox jumps over the lazy dog</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-md2-btn" class="btn btn-primary flex-1">🔐 Compute MD2 Digest</button>
      </div>
    `;
  }

  // Pure JavaScript MD2 RFC 1319 Implementation
  const S = [
    41, 46, 67, 201, 162, 216, 124, 1, 61, 54, 84, 161, 236, 240, 6, 19,
    98, 167, 5, 243, 192, 199, 115, 140, 152, 147, 43, 217, 188, 76, 130, 202,
    30, 155, 87, 60, 253, 212, 224, 22, 103, 66, 111, 24, 138, 23, 229, 18,
    190, 78, 196, 214, 218, 158, 222, 109, 119, 181, 215, 159, 157, 49, 74, 55,
    137, 118, 80, 255, 167, 230, 248, 12, 211, 233, 14, 110, 89, 42, 232, 123,
    95, 59, 198, 129, 213, 25, 237, 244, 160, 31, 242, 168, 45, 121, 151, 101,
    145, 23, 107, 108, 86, 178, 245, 182, 17, 251, 120, 227, 48, 234, 139, 135,
    203, 163, 68, 64, 16, 241, 171, 169, 100, 10, 72, 187, 228, 195, 75, 219,
    134, 10, 189, 93, 210, 235, 150, 249, 16, 81, 133, 197, 63, 116, 37, 112,
    44, 185, 250, 117, 143, 144, 206, 173, 13, 131, 247, 226, 225, 221, 128, 83,
    239, 21, 207, 220, 85, 8, 254, 200, 3, 246, 32, 15, 176, 238, 172, 148,
    179, 184, 4, 183, 40, 88, 132, 175, 205, 96, 51, 106, 62, 65, 204, 223,
    156, 231, 191, 233, 91, 58, 174, 154, 99, 82, 122, 153, 61, 22, 252, 177,
    90, 102, 141, 79, 26, 142, 237, 208, 186, 149, 39, 127, 180, 6, 194, 240,
    113, 165, 126, 92, 11, 20, 28, 105, 193, 104, 125, 114, 241, 166, 38, 36
  ];

  function md2(str) {
    const enc = new TextEncoder();
    const input = Array.from(enc.encode(str));
    const padLen = 16 - (input.length % 16);

    for (let i = 0; i < padLen; i++) input.push(padLen);

    const checksum = new Array(16).fill(0);
    let L = 0;
    for (let i = 0; i < input.length / 16; i++) {
      for (let j = 0; j < 16; j++) {
        const c = input[i * 16 + j];
        checksum[j] ^= S[c ^ L];
        L = checksum[j];
      }
    }

    input.push(...checksum);

    const X = new Array(48).fill(0);
    const M = input;

    for (let i = 0; i < M.length / 16; i++) {
      for (let j = 0; j < 16; j++) {
        X[16 + j] = M[i * 16 + j];
        X[32 + j] = X[16 + j] ^ X[j];
      }
      let t = 0;
      for (let j = 0; j < 18; j++) {
        for (let k = 0; k < 48; k++) {
          X[k] ^= S[t];
          t = X[k];
        }
        t = (t + j) % 256;
      }
    }

    return X.slice(0, 16).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function calculate() {
    const text = document.getElementById('md2-text') ? document.getElementById('md2-text').value : (document.getElementById('text-input') ? document.getElementById('text-input').value : '');

    if (!text) {
      if (out) out.value = 'ERROR: Please enter input text to compute MD2 hash.';
      return;
    }

    const hash = md2(text);

    let res = `--- MD2 DIGEST CALCULATOR ---nn`;
    res += `Input Text: "${text}"n`;
    res += `MD2 Hash:   ${hash}n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('MD2 hash computed!', 'success');
  }

  const activeBtn = document.getElementById('calc-md2-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
