/**
 * JavaScript Obfuscator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('jo-js')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input JavaScript Code:</label>
        <textarea id="jo-js" class="form-input" style="width:100%;height:120px;padding:0.5rem;font-family:monospace;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">function secretAlgorithm(x, y) { return x * 42 + y; }</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-jo-btn" class="btn btn-primary flex-1">🔒 Obfuscate JavaScript Code</button>
      </div>
    `;
  }

  function obfuscateJS(code) {
    const enc = new TextEncoder();
    const bytes = Array.from(enc.encode(code));
    const hexArr = bytes.map(b => 'x' + b.toString(16).padStart(2, '0')).join('');

    return `(function(_0x1a2b,_0x3c4d){var _0x5e6f=function(_0x7a8b){return decodeURIComponent(escape(String.fromCharCode.apply(null,_0x7a8b)));};(new Function(_0x5e6f([${bytes.join(',')}])))();})(\"${hexArr}\");`;
  }

  function calculate() {
    const code = document.getElementById('jo-js') ? document.getElementById('jo-js').value : (document.getElementById('text-input') ? document.getElementById('text-input').value : '');

    if (!code.trim()) {
      if (out) out.value = 'ERROR: Please enter JavaScript code to obfuscate.';
      return;
    }

    const obfuscated = obfuscateJS(code);

    let res = `// OBFUSCATED JAVASCRIPT CODE (Client-Side Encoding)n`;
    res += obfuscated;

    if (out) out.value = res;
    if (window.showToast) window.showToast('JavaScript code obfuscated!', 'success');
  }

  const activeBtn = document.getElementById('calc-jo-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
