/**
 * JavaScript Code Beautifier & Formatter Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('jb-js')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input JavaScript Code:</label>
        <textarea id="jb-js" class="form-input" style="width:100%;height:140px;padding:0.5rem;font-family:monospace;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">function calculateTotal(items){let sum=0;for(let i=0;i<items.length;i++){sum+=items[i];}return sum;}</textarea>
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Indentation:</label>
        <select id="jb-indent" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
          <option value="2">2 Spaces</option>
          <option value="4">4 Spaces</option>
          <option value="tab">Tab Character</option>
        </select>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-jb-btn" class="btn btn-primary flex-1">✨ Beautify JavaScript Code</button>
      </div>
    `;
  }

  function beautifyJS(code, indentStr) {
    let indentLevel = 0;
    let result = '';
    let inString = false;
    let stringChar = '';

    for (let i = 0; i < code.length; i++) {
      const char = code[i];

      if ((char === '"' || char === "'" || char === '`') && code[i - 1] !== '') {
        if (!inString) {
          inString = true;
          stringChar = char;
        } else if (char === stringChar) {
          inString = false;
        }
      }

      if (inString) {
        result += char;
        continue;
      }

      if (char === '{' || char === '[') {
        result += char + 'n';
        indentLevel++;
        result += indentStr.repeat(indentLevel);
      } else if (char === '}' || char === ']') {
        result += 'n';
        indentLevel = Math.max(0, indentLevel - 1);
        result += indentStr.repeat(indentLevel) + char;
      } else if (char === ';') {
        result += ';n' + indentStr.repeat(indentLevel);
      } else {
        result += char;
      }
    }

    return result.replace(/ns*n/g, 'n').trim();
  }

  function calculate() {
    const rawJS = document.getElementById('jb-js') ? document.getElementById('jb-js').value : (document.getElementById('text-input') ? document.getElementById('text-input').value : '');
    const indentOption = document.getElementById('jb-indent') ? document.getElementById('jb-indent').value : '2';

    if (!rawJS.trim()) {
      if (out) out.value = 'ERROR: Please enter JavaScript code to beautify.';
      return;
    }

    const indentStr = indentOption === 'tab' ? 't' : ' '.repeat(parseInt(indentOption, 10));
    const beautified = beautifyJS(rawJS, indentStr);

    if (out) out.value = beautified;
    if (window.showToast) window.showToast('JavaScript code beautified successfully!', 'success');
  }

  const activeBtn = document.getElementById('calc-jb-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
