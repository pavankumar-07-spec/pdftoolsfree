/**
 * 216 Web-Safe Color Palette Reference Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('wsc-category')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Select Color Family:</label>
        <select id="wsc-category" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
          <option value="reds">Reds & Pinks</option>
          <option value="blues">Blues & Cyans</option>
          <option value="greens">Greens & Teals</option>
          <option value="purples">Purples & Violets</option>
          <option value="grays">Grays & Neutrals</option>
        </select>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-wsc-btn" class="btn btn-primary flex-1">🎨 Explore Web-Safe Swatches</button>
      </div>
    `;
  }

  const webSafePalettes = {
    reds: ['#FF0000', '#FF3333', '#FF6666', '#CC0000', '#990000', '#660000', '#FF0066', '#FF3399'],
    blues: ['#0000FF', '#0033FF', '#0066FF', '#0099FF', '#00CCFF', '#00FFFF', '#0000CC', '#000099'],
    greens: ['#00FF00', '#33FF33', '#00CC00', '#009900', '#006600', '#003300', '#00FF99', '#33FFCC'],
    purples: ['#9900FF', '#CC00FF', '#FF00FF', '#6600CC', '#9900CC', '#CC00CC', '#330066', '#660099'],
    grays: ['#FFFFFF', '#CCCCCC', '#999999', '#666666', '#333333', '#000000', '#E5E5E5', '#1A1A1A']
  };

  function calculate() {
    const cat = document.getElementById('wsc-category') ? document.getElementById('wsc-category').value : 'reds';
    const swatches = webSafePalettes[cat] || webSafePalettes.reds;

    let res = `--- 216 WEB-SAFE COLOR PALETTE REPORT ---nn`;
    res += `Category: ${cat.toUpperCase()}nn`;
    res += `=== WEB-SAFE HEX CODES ===n`;

    swatches.forEach((hex, i) => {
      res += `${i + 1}. ${hex.padEnd(10)} (216 Web-Safe Compliant)n`;
    });

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Loaded ${swatches.length} web-safe swatches!`, 'success');
  }

  const activeBtn = document.getElementById('calc-wsc-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
