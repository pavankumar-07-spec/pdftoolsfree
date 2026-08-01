/**
 * Upgraded Kebab-Case Multi-Case String Converter Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('case-str-input')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label">Input Text to Convert</label>
        <input type="text" id="case-str-input" class="form-input" value="hello world example text">
      </div>
      <div style="margin-bottom:1.5rem">
        <label class="form-label">Target Case Format</label>
        <select id="case-target-select" class="form-input">
          <option value="kebab" selected>kebab-case (e.g. hello-world)</option>
          <option value="snake">snake_case (e.g. hello_world)</option>
          <option value="camel">camelCase (e.g. helloWorld)</option>
          <option value="pascal">PascalCase (e.g. HelloWorld)</option>
          <option value="constant">CONSTANT_CASE (e.g. HELLO_WORLD)</option>
          <option value="title">Title Case (e.g. Hello World)</option>
        </select>
      </div>
      <div class="flex gap-3 mt-4">
        <button id="calc-case-btn" type="button" class="btn btn-primary flex-1">🔤 Convert String Case</button>
      </div>
    `;
  }

  function getWords(str) {
    if (!str) return [];
    return str
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[^a-zA-Z0-9]+/g, ' ')
      .trim()
      .split(/\s+/)
      .filter(w => w.length > 0);
  }

  function convertCase() {
    const raw = (document.getElementById('case-str-input')?.value || 'hello world example text').trim();
    const target = document.getElementById('case-target-select')?.value || 'kebab';

    const words = getWords(raw);
    if (words.length === 0) {
      if (out) out.value = 'ERROR: Please enter valid text.';
      return;
    }

    const snake = words.map(w => w.toLowerCase()).join('_');
    const kebab = words.map(w => w.toLowerCase()).join('-');
    const camel = words.map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
    const pascal = words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
    const constant = words.map(w => w.toUpperCase()).join('_');
    const title = words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');

    let selectedResult = kebab;
    if (target === 'snake') selectedResult = snake;
    if (target === 'camel') selectedResult = camel;
    if (target === 'pascal') selectedResult = pascal;
    if (target === 'constant') selectedResult = constant;
    if (target === 'title') selectedResult = title;

    let report = `==========================================================
               KEBAB-CASE STRING CONVERTER
==========================================================
Input Text:    "${raw}"
Target Case:   ${target.toUpperCase()}

PRIMARY RESULT:
${selectedResult}

==========================================================
ALL CASE FORMAT VARIATIONS:
• kebab-case    : ${kebab}
• snake_case    : ${snake}
• camelCase     : ${camel}
• PascalCase    : ${pascal}
• CONSTANT_CASE : ${constant}
• Title Case    : ${title}
==========================================================`;

    if (out) out.value = report;
    if (window.showToast) window.showToast(`Converted to ${target} case!`, 'success');
  }

  const select = document.getElementById('case-target-select');
  if (select) select.onchange = convertCase;

  const activeBtn = document.getElementById('calc-case-btn') || btn;
  if (activeBtn) activeBtn.onclick = () => convertCase();

  convertCase();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
