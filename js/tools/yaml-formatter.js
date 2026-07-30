/**
 * YAML Formatter & Converter Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('yf-yaml')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input YAML Content:</label>
        <textarea id="yf-yaml" class="form-input" style="width:100%;height:140px;padding:0.5rem;font-family:monospace;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">server:
  host: localhost
  port: 8080
database:
  name: pdftools
  enabled: true
tags:
  - fast
  - local
  - private</textarea>
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Target Output:</label>
        <select id="yf-target" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
          <option value="json">Convert YAML to JSON</option>
          <option value="clean-yaml">Clean & Format YAML</option>
        </select>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-yf-btn" class="btn btn-primary flex-1">📋 Format / Convert YAML</button>
      </div>
    `;
  }

  // Pure Client-side lightweight YAML to JS Object Parser
  function parseSimpleYAML(yamlStr) {
    const lines = yamlStr.split('n');
    const result = {};
    const stack = [{ obj: result, indent: -1 }];

    lines.forEach(line => {
      if (!line.trim() || line.trim().startsWith('#')) return;

      const indent = line.search(/S/);
      const trimmed = line.trim();

      while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
        stack.pop();
      }

      const parent = stack[stack.length - 1].obj;

      if (trimmed.startsWith('- ')) {
        const val = trimmed.slice(2).trim();
        if (!Array.isArray(parent)) {
          // If parent is not array, look at last key
        }
      } else if (trimmed.includes(':')) {
        const parts = trimmed.split(':');
        const key = parts[0].trim();
        let val = parts.slice(1).join(':').trim();

        if (!val) {
          const newObj = {};
          parent[key] = newObj;
          stack.push({ obj: newObj, indent });
        } else {
          if (val === 'true') val = true;
          else if (val === 'false') val = false;
          else if (!isNaN(Number(val))) val = Number(val);
          parent[key] = val;
        }
      }
    });

    return result;
  }

  function calculate() {
    const rawYAML = document.getElementById('yf-yaml') ? document.getElementById('yf-yaml').value : (document.getElementById('text-input') ? document.getElementById('text-input').value : '');
    const target = document.getElementById('yf-target') ? document.getElementById('yf-target').value : 'json';

    if (!rawYAML.trim()) {
      if (out) out.value = 'ERROR: Please enter YAML content.';
      return;
    }

    try {
      const parsedObj = parseSimpleYAML(rawYAML);

      let res = `--- YAML FORMATTER & CONVERTER RESULTS ---nn`;
      if (target === 'json') {
        res += `=== CONVERTED JSON OUTPUT ===n`;
        res += JSON.stringify(parsedObj, null, 2);
      } else {
        res += `=== CLEAN FORMATTED YAML ===n`;
        res += rawYAML.split('n').filter(l => l.trim().length > 0).join('n');
      }

      if (out) out.value = res;
      if (window.showToast) window.showToast('YAML processed successfully!', 'success');
    } catch (err) {
      if (out) out.value = `ERROR parsing YAML:n${err.message}`;
    }
  }

  const activeBtn = document.getElementById('calc-yf-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
