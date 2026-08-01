/**
 * Base64 Encoder Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const ic = document.getElementById('tool-inputs-container');
  const out = document.getElementById('main-output');
  if (ic && !document.getElementById('b64e-input')) {
    ic.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label">Text to Encode</label>
        <textarea id="b64e-input" class="form-input" rows="4" placeholder="Enter text to encode...">Hello, PDFToolsFree!</textarea>
      </div>
      <button id="calc-b64e-btn" class="btn btn-primary" style="width:100%">🔐 Encode to Base64</button>
    `;
  }
  function encode() {
    try {
      const input = document.getElementById('b64e-input')?.value || '';
      const encoded = btoa(unescape(encodeURIComponent(input)));
      const origBytes = new Blob([input]).size;
      const encBytes = new Blob([encoded]).size;
      let report = '==========================================================\n';
      report += '             BASE64 ENCODER\n';
      report += '==========================================================\n';
      report += 'Original Size:  ' + origBytes + ' bytes\n';
      report += 'Encoded Size:   ' + encBytes + ' bytes\n';
      report += 'Expansion:      ' + ((encBytes/origBytes)*100).toFixed(1) + '%\n\n';
      report += 'ENCODED OUTPUT:\n' + encoded;
      report += '\n==========================================================';
      if (out) out.value = encoded;
      if (window.showToast) window.showToast('Base64 encoded! ' + origBytes + ' → ' + encBytes + ' bytes', 'success');
    } catch (e) { if (out) out.value = 'Error: ' + e.message; }
  }
  const b = document.getElementById('calc-b64e-btn') || document.getElementById('generate-btn');
  if (b) b.onclick = encode;
  encode();
});