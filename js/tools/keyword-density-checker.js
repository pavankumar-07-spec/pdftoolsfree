/**
 * Keyword Density & SEO Content Analyzer Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('kdc-text')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Article / Copy Text:</label>
        <textarea id="kdc-text" class="form-input" style="width:100%;height:120px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">FreeToolsPDF provides free online PDF tools and math calculators. All PDF operations run locally in your browser for total privacy.</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-kdc-btn" class="btn btn-primary flex-1">📊 Analyze Keyword Density</button>
      </div>
    `;
  }

  function calculate() {
    const text = document.getElementById('kdc-text') ? document.getElementById('kdc-text').value : (document.getElementById('text-input') ? document.getElementById('text-input').value : '');

    if (!text.trim()) {
      if (out) out.value = 'ERROR: Please enter article text.';
      return;
    }

    const words = text.toLowerCase().match(/b[a-z0-9'-]+b/g) || [];
    const totalWords = words.length;

    const stopWords = new Set(['the', 'and', 'a', 'to', 'of', 'in', 'is', 'for', 'that', 'this', 'on', 'with', 'all', 'your', 'or', 'be', 'an', 'as', 'at']);

    const freq = {};
    words.forEach(w => {
      if (!stopWords.has(w) && w.length > 2) {
        freq[w] = (freq[w] || 0) + 1;
      }
    });

    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 10);

    let res = `--- KEYWORD DENSITY ANALYSIS REPORT ---nn`;
    res += `Total Word Count: ${totalWords} wordsnn`;
    res += `=== TOP KEYWORDS (EXCLUSIVE OF STOP WORDS) ===n`;

    sorted.forEach(([kw, count]) => {
      const pct = ((count / totalWords) * 100).toFixed(2);
      res += `• ${kw.padEnd(16)}: ${count} occurrences (${pct}% density)n`;
    });

    if (out) out.value = res;
    if (window.showToast) window.showToast('Keyword density calculated!', 'success');
  }

  const activeBtn = document.getElementById('calc-kdc-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
