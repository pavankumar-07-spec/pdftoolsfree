/**
 * JSON Viewer & Inspector Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('jv-json')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input Raw JSON String:</label>
        <textarea id="jv-json" class="form-input" style="width:100%;height:140px;padding:0.5rem;font-family:monospace;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">{"name":"FreeToolsPDF","status":"active","tools":274,"features":["Client-Side","Fast","Private"],"config":{"version":1.0,"theme":"light"}}</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-jv-btn" class="btn btn-primary flex-1">🔍 Format & Inspect JSON</button>
      </div>
    `;
  }

  function getType(val) {
    if (val === null) return 'Null';
    if (Array.isArray(val)) return `Array (${val.length} items)`;
    if (typeof val === 'object') return `Object (${Object.keys(val).length} keys)`;
    return typeof val;
  }

  function generateTreeStructure(obj, indent = 0) {
    const spaces = '  '.repeat(indent);
    let output = '';

    if (Array.isArray(obj)) {
      output += `${spaces}[n`;
      obj.forEach((item, idx) => {
        const isLast = idx === obj.length - 1;
        if (typeof item === 'object' && item !== null) {
          output += `${spaces}  [${idx}]:n` + generateTreeStructure(item, indent + 2) + (isLast ? '' : 'n');
        } else {
          output += `${spaces}  [${idx}]: ${JSON.stringify(item)}${isLast ? '' : ','}n`;
        }
      });
      output += `${spaces}]`;
    } else if (typeof obj === 'object' && obj !== null) {
      output += `${spaces}{n`;
      const keys = Object.keys(obj);
      keys.forEach((key, idx) => {
        const isLast = idx === keys.length - 1;
        const val = obj[key];
        if (typeof val === 'object' && val !== null) {
          output += `${spaces}  "${key}" (${getType(val)}):n` + generateTreeStructure(val, indent + 2) + (isLast ? '' : 'n');
        } else {
          output += `${spaces}  "${key}": ${JSON.stringify(val)}${isLast ? '' : ','}n`;
        }
      });
      output += `${spaces}}`;
    } else {
      output += `${spaces}${JSON.stringify(obj)}`;
    }

    return output;
  }

  function calculate() {
    const raw = document.getElementById('jv-json') ? document.getElementById('jv-json').value : (document.getElementById('text-input') ? document.getElementById('text-input').value : '');

    if (!raw.trim()) {
      if (out) out.value = 'ERROR: Please enter JSON text.';
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      const formattedJSON = JSON.stringify(parsed, null, 2);
      const treeView = generateTreeStructure(parsed);

      let res = `--- JSON VIEWER & INSPECTOR REPORT ---nn`;
      res += `Status: ✅ VALID JSONn`;
      res += `Root Structure: ${getType(parsed)}nn`;

      res += `=== STRUCTURED TREE VIEW ===n`;
      res += `${treeView}nn`;

      res += `=== BEAUTIFIED JSON OUTPUT ===n`;
      res += `${formattedJSON}n`;

      if (out) out.value = res;
      if (window.showToast) window.showToast('JSON formatted and inspected!', 'success');
    } catch (err) {
      if (out) out.value = `❌ INVALID JSON ERROR:n${err.message}`;
    }
  }

  const activeBtn = document.getElementById('calc-jv-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
