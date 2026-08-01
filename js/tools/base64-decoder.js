/**
 * Base64 Decoder Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const ic = document.getElementById('tool-inputs-container');
  const out = document.getElementById('main-output');
  if (ic && !document.getElementById('b64d-input')) {
    ic.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label">Base64 String to Decode</label>
        <textarea id="b64d-input" class="form-input" rows="4" placeholder="Enter Base64 string...">SGVsbG8sIFBERlRvb2xzRnJlZSE=</textarea>
      </div>
      <button id="calc-b64d-btn" class="btn btn-primary" style="width:100%">🔓 Decode from Base64</button>
    `;
  }
  function decode() {
    try {
      const input = (document.getElementById('b64d-input')?.value || '').trim();
      const decoded = decodeURIComponent(escape(atob(input)));
      let report = '==========================================================\n';
      report += '             BASE64 DECODER\n';
      report += '==========================================================\n';
      report += 'Input Length:   ' + input.length + ' chars\n';
      report += 'Decoded Length: ' + decoded.length + ' chars\n\n';
      report += 'DECODED OUTPUT:\n' + decoded;
      report += '\n==========================================================';
      if (out) out.value = decoded;
      if (window.showToast) window.showToast('Base64 decoded successfully!', 'success');
    } catch (e) {
      if (out) out.value = '⚠️ ERROR: Invalid Base64 string.\n' + e.message;
      if (window.showToast) window.showToast('Invalid Base64 input', 'error');
    }
  }
  const b = document.getElementById('calc-b64d-btn') || document.getElementById('generate-btn');
  if (b) b.onclick = decode;
  decode();
});