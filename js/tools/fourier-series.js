/**
 * Fourier Series Coefficients Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const ic = document.getElementById('tool-inputs-container');
  const out = document.getElementById('main-output');
  if (ic && !document.getElementById('fs-func')) {
    ic.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem">
        <div><label class="form-label">Waveform Type</label>
          <select id="fs-func" class="form-input">
            <option value="square" selected>Square Wave</option>
            <option value="sawtooth">Sawtooth Wave</option>
            <option value="triangle">Triangle Wave</option>
          </select>
        </div>
        <div><label class="form-label">Number of Terms</label><input type="number" id="fs-n" class="form-input" value="10" min="1" max="50"></div>
      </div>
      <button id="calc-fs-btn" class="btn btn-primary" style="width:100%">📐 Compute Fourier Coefficients</button>
    `;
  }
  function calc() {
    try {
      const func = document.getElementById('fs-func')?.value || 'square';
      const n = parseInt(document.getElementById('fs-n')?.value) || 10;
      let r = '==========================================================\n';
      r += '             FOURIER SERIES COEFFICIENTS\n';
      r += '==========================================================\n';
      r += 'Waveform: ' + func.charAt(0).toUpperCase() + func.slice(1) + ' Wave\n';
      r += 'Terms:    ' + n + '\n\n';
      r += 'n'.padEnd(5) + 'aₙ'.padEnd(16) + 'bₙ'.padEnd(16) + 'Amplitude\n';
      r += '─'.repeat(52) + '\n';
      for (let k = 1; k <= n; k++) {
        let an = 0, bn = 0;
        if (func === 'square') { an = 0; bn = (k % 2 === 1) ? 4 / (k * Math.PI) : 0; }
        else if (func === 'sawtooth') { an = 0; bn = 2 * Math.pow(-1, k+1) / (k * Math.PI); }
        else if (func === 'triangle') { an = (k % 2 === 1) ? -8 / (k * k * Math.PI * Math.PI) : 0; bn = 0; }
        const amp = Math.sqrt(an*an + bn*bn);
        r += k.toString().padEnd(5) + an.toFixed(8).padEnd(16) + bn.toFixed(8).padEnd(16) + amp.toFixed(8) + '\n';
      }
      r += '\n==========================================================';
      if (out) out.value = r;
      if (window.showToast) window.showToast('Fourier coefficients computed for ' + n + ' terms!', 'success');
    } catch (e) { if (out) out.value = 'Error: ' + e.message; }
  }
  const b = document.getElementById('calc-fs-btn') || document.getElementById('generate-btn');
  if (b) b.onclick = calc;
  const sel = document.getElementById('fs-func');
  if (sel) sel.onchange = calc;
  calc();
});