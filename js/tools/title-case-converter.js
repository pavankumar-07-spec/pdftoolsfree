/**
 * Title Case Converter Engine (APA / Chicago Style Rules)
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('tc-text')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input Headline / Text:</label>
        <textarea id="tc-text" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">the quick brown fox jumps over a lazy dog and into the forest</textarea>
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Title Style Standard:</label>
        <select id="tc-style" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
          <option value="apa">APA Style (Capitalize words >= 4 letters + major words)</option>
          <option value="chicago">Chicago Manual of Style (Lowercase minor prepositions/articles)</option>
          <option value="ap">Associated Press (AP) Style</option>
          <option value="all-caps">ALL WORDS CAPITALIZED</option>
        </select>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-tc-btn" class="btn btn-primary flex-1">🔤 Convert to Title Case</button>
      </div>
    `;
  }

  const minorWords = new Set(['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from', 'by', 'of', 'in', 'out', 'up', 'off', 'over', 'with', 'as']);

  function convertTitleCase(text, style) {
    const lines = text.split('n');

    return lines.map(line => {
      if (!line.trim()) return '';
      const words = line.toLowerCase().split(/s+/);
      const total = words.length;

      const converted = words.map((w, idx) => {
        // Strip non-alphanumeric prefix/suffix to inspect word core
        const coreWord = w.replace(/^[^w]+|[^w]+$/g, '');

        if (style === 'all-caps') {
          return w.charAt(0).toUpperCase() + w.slice(1);
        }

        // Always capitalize first and last word
        if (idx === 0 || idx === total - 1) {
          return w.charAt(0).toUpperCase() + w.slice(1);
        }

        if (style === 'apa' && coreWord.length >= 4) {
          return w.charAt(0).toUpperCase() + w.slice(1);
        }

        if (minorWords.has(coreWord)) {
          return w.toLowerCase();
        }

        return w.charAt(0).toUpperCase() + w.slice(1);
      });

      return converted.join(' ');
    }).join('n');
  }

  function calculate() {
    const text = document.getElementById('tc-text') ? document.getElementById('tc-text').value : (document.getElementById('text-input') ? document.getElementById('text-input').value : '');
    const style = document.getElementById('tc-style') ? document.getElementById('tc-style').value : 'apa';

    if (!text) {
      if (out) out.value = 'ERROR: Please enter text to convert.';
      return;
    }

    const titleCaseResult = convertTitleCase(text, style);

    let res = `--- TITLE CASE CONVERTER RESULTS ---nn`;
    res += `Style Standard: ${style.toUpperCase()}nn`;
    res += `=== TITLE CASE TEXT ===n`;
    res += `${titleCaseResult}n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Converted to Title Case!', 'success');
  }

  const activeBtn = document.getElementById('calc-tc-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
