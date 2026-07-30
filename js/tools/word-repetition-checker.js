/**
 * Word Repetition & Duplication Checker Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('wrc-text')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input Text Block:</label>
        <textarea id="wrc-text" class="form-input" style="width:100%;height:140px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">The the quick brown fox fox jumps over the lazy dog dog. This is a simple simple text with repetitive repetitive words.</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-wrc-btn" class="btn btn-primary flex-1">🔍 Detect Word Repetitions</button>
      </div>
    `;
  }

  function calculate() {
    const text = document.getElementById('wrc-text') ? document.getElementById('wrc-text').value : (document.getElementById('text-input') ? document.getElementById('text-input').value : '');

    if (!text.trim()) {
      if (out) out.value = 'ERROR: Please enter text to check for repetitions.';
      return;
    }

    // 1. Detect Consecutive Duplicate Words (e.g. "the the")
    const wordsRaw = text.trim().split(/s+/);
    const consecutiveDuplicates = [];

    for (let i = 0; i < wordsRaw.length - 1; i++) {
      const w1 = wordsRaw[i].toLowerCase().replace(/[^w]/g, '');
      const w2 = wordsRaw[i + 1].toLowerCase().replace(/[^w]/g, '');
      if (w1 && w1 === w2) {
        consecutiveDuplicates.push({ word: wordsRaw[i], index: i + 1 });
      }
    }

    // 2. Frequency Analysis of Repeated Words
    const freqMap = {};
    const cleanWords = text.toLowerCase().match(/b[a-z0-9'-]+b/g) || [];

    cleanWords.forEach(w => {
      if (w.length > 2) { // Ignore 1-2 letter noise
        freqMap[w] = (freqMap[w] || 0) + 1;
      }
    });

    const repeatedWords = Object.entries(freqMap)
      .filter(([_, count]) => count > 1)
      .sort((a, b) => b[1] - a[1]);

    let res = `--- WORD REPETITION & DUPLICATION REPORT ---nn`;
    res += `Total Word Count: ${wordsRaw.length}n`;
    res += `Unique Words (len > 2): ${Object.keys(freqMap).length}nn`;

    res += `=== CONSECUTIVE REPEATED WORDS (TYPOS) ===n`;
    if (consecutiveDuplicates.length === 0) {
      res += `✅ No consecutive duplicate words found! (e.g. "the the")nn`;
    } else {
      res += `⚠️ Found ${consecutiveDuplicates.length} consecutive duplicate word(s):n`;
      consecutiveDuplicates.forEach((item, idx) => {
        res += `  ${idx + 1}. "${item.word}" (at word position #${item.index})n`;
      });
      res += `n`;
    }

    res += `=== MOST REPEATED WORDS (Frequency > 1) ===n`;
    if (repeatedWords.length === 0) {
      res += `No repeated words detected.n`;
    } else {
      repeatedWords.slice(0, 15).forEach(([w, count]) => {
        const pct = ((count / cleanWords.length) * 100).toFixed(1);
        res += `• "${w.padEnd(16)}": ${count} times (${pct}% of total text)n`;
      });
    }

    if (out) out.value = res;
    if (window.showToast) window.showToast('Repetition check completed!', 'success');
  }

  const activeBtn = document.getElementById('calc-wrc-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
