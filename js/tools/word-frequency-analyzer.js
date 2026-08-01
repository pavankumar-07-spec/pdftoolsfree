/**
 * Word Frequency Analyzer Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('wf-text')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Enter Text for Frequency Analysis:</label>
        <textarea id="wf-text" class="form-input" style="width:100%;height:120px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">The quick brown fox jumps over the lazy dog. The fox was quick and the dog was lazy.</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-wf-btn" class="btn btn-primary flex-1">📊 Analyze Word Frequency</button>
      </div>
    `;
  }

  function calculate() {
    const text = document.getElementById('wf-text') ? document.getElementById('wf-text').value : '';

    if (!text.trim()) {
      if (out) out.value = 'ERROR: Please enter text to analyze.';
      return;
    }

    const words = text.toLowerCase().replace(/[^ws]/g, '').split(/s+/).filter(Boolean);
    const totalWords = words.length;

    const freq = {};
    words.forEach(w => {
      freq[w] = (freq[w] || 0) + 1;
    });

    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);

    let res = '--- WORD FREQUENCY ANALYSIS ---nn';
    res += `Total Word Count: ${totalWords}n`;
    res += `Unique Words: ${sorted.length}nn`;
    res += `Rank | Word | Frequency | Density (%)n`;
    res += `------------------------------------n`;

    sorted.slice(0, 25).forEach(([word, count], idx) => {
      const density = ((count / totalWords) * 100).toFixed(2);
      res += `${(idx + 1).toString().padStart(4, ' ')} | ${word.padEnd(12, ' ')} | ${count.toString().padStart(9, ' ')} | ${density}%n`;
    });

    if (out) out.value = res;
    if (window.showToast) window.showToast('Word frequency analyzed!', 'success');
  }

  const activeBtn = document.getElementById('calc-wf-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
