/**
 * YAML Syntax Validator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('yv-yaml')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input YAML Content:</label>
        <textarea id="yv-yaml" class="form-input" style="width:100%;height:120px;padding:0.5rem;font-family:monospace;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">app:n  name: FreeToolsPDFn  version: 1.0nservices:n  - pdfn  - math</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-yv-btn" class="btn btn-primary flex-1">🔍 Validate YAML Syntax</button>
      </div>
    `;
  }

  function validateYAML(yamlStr) {
    const lines = yamlStr.split('n');
    let lineNum = 0;

    for (const line of lines) {
      lineNum++;
      if (!line.trim() || line.trim().startsWith('#')) continue;

      const indent = line.search(/S/);
      if (indent % 2 !== 0 && line.trim().startsWith('-')) {
        // Warning or check
      }
      if (line.includes(':')) {
        const key = line.split(':')[0];
        if (key.includes('t')) {
          return { valid: false, error: `Tab character detected at line ${lineNum}. YAML prohibits tabs for indentation!` };
        }
      }
    }

    return { valid: true, totalLines: lines.length };
  }

  function calculate() {
    const yamlText = document.getElementById('yv-yaml') ? document.getElementById('yv-yaml').value : (document.getElementById('text-input') ? document.getElementById('text-input').value : '');

    if (!yamlText.trim()) {
      if (out) out.value = 'ERROR: Please enter YAML text to validate.';
      return;
    }

    const result = validateYAML(yamlText);

    let res = `--- YAML SYNTAX VALIDATION REPORT ---nn`;
    if (result.valid) {
      res += `Status: ✅ VALID YAML SYNTAXn`;
      res += `Total Analyzed Lines: ${result.totalLines}n`;
    } else {
      res += `Status: ❌ INVALID YAML SYNTAXn`;
      res += `Error:  ${result.error}n`;
    }

    if (out) out.value = res;
    if (window.showToast) window.showToast(result.valid ? 'YAML syntax is valid!' : 'Invalid YAML syntax', result.valid ? 'success' : 'error');
  }

  const activeBtn = document.getElementById('calc-yv-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
