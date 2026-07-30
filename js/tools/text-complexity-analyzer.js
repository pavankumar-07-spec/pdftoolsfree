/**
 * Text Complexity & Vocabulary Richness Analyzer Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('tca-text')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input Essay / Document Text:</label>
        <textarea id="tca-text" class="form-input" style="width:100%;height:120px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">Linear algebra matrix decomposition involves evaluating eigenvalues and eigenvectors of non-singular square matrices through characteristic polynomial determinants det(A - lambda I) = 0.</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-tca-btn" class="btn btn-primary flex-1">📊 Analyze Text Complexity</button>
      </div>
    `;
  }

  function calculate() {
    const text = document.getElementById('tca-text') ? document.getElementById('tca-text').value : (document.getElementById('text-input') ? document.getElementById('text-input').value : '');

    if (!text.trim()) {
      if (out) out.value = 'ERROR: Please enter text to analyze.';
      return;
    }

    const words = text.toLowerCase().match(/b[a-z0-9'-]+b/g) || [];
    const totalWords = words.length || 1;
    const uniqueWords = new Set(words).size;

    const ttr = (uniqueWords / totalWords) * 100; // Type-Token Ratio
    const avgWordLength = (words.reduce((sum, w) => sum + w.length, 0) / totalWords).toFixed(2);
    const complexWords = words.filter(w => w.length > 6).length;
    const complexPct = ((complexWords / totalWords) * 100).toFixed(1);

    let res = `--- TEXT COMPLEXITY & VOCABULARY REPORT ---nn`;
    res += `Total Words:          ${totalWords}n`;
    res += `Unique Vocabulary:    ${uniqueWords} wordsn`;
    res += `Type-Token Ratio (TTR): ${ttr.toFixed(1)}% (Vocabulary Variety)nn`;

    res += `=== COMPLEXITY METRICS ===n`;
    res += `• Avg. Word Length:     ${avgWordLength} charactersn`;
    res += `• Complex Words (>6ch): ${complexWords} words (${complexPct}%)n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Vocabulary Variety (TTR): ${ttr.toFixed(1)}%`, 'success');
  }

  const activeBtn = document.getElementById('calc-tca-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
