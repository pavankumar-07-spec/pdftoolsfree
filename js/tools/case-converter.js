/**
 * Case Converter Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('case-text')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input Text:</label>
        <textarea id="case-text" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">The Quick Brown Fox Jumps Over The Lazy Dog</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-case-btn" class="btn btn-primary flex-1">🔠 Convert All Text Cases</button>
      </div>
    `;
  }

  function toTitleCase(str) {
    return str.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  function toCamelCase(str) {
    return str.replace(/(?:^w|[A-Z]|bw)/g, (letter, index) =>
      index === 0 ? letter.toLowerCase() : letter.toUpperCase()
    ).replace(/s+/g, '');
  }

  function toSnakeCase(str) {
    return str.trim().toLowerCase().replace(/s+/g, '_');
  }

  function toKebabCase(str) {
    return str.trim().toLowerCase().replace(/s+/g, '-');
  }

  function calculate() {
    const text = document.getElementById('case-text') ? document.getElementById('case-text').value : '';

    if (!text) {
      if (out) out.value = 'ERROR: Please enter input text.';
      return;
    }

    let res = '--- CASE CONVERTER RESULTS ---nn';
    res += `1. UPPERCASE:n${text.toUpperCase()}nn`;
    res += `2. lowercase:n${text.toLowerCase()}nn`;
    res += `3. Title Case:n${toTitleCase(text)}nn`;
    res += `4. camelCase:n${toCamelCase(text)}nn`;
    res += `5. snake_case:n${toSnakeCase(text)}nn`;
    res += `6. kebab-case:n${toKebabCase(text)}nn`;
    res += `7. CONSTANT_CASE:n${toSnakeCase(text).toUpperCase()}n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Text converted to all cases!', 'success');
  }

  const activeBtn = document.getElementById('calc-case-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
