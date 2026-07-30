/**
 * Duplicate Word Finder Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('dup-text')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input Text:</label>
        <textarea id="dup-text" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">The the quick brown fox jumps over the the lazy dog dog.</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-dup-btn" class="btn btn-primary flex-1">🔎 Find Duplicate Words</button>
      </div>
    `;
  }

  function calculate() {
    const raw = (document.getElementById('dup-text')?.value || '').trim();

    if (!raw) { if (out) out.value = ''; return; }

    const words = raw.toLowerCase().replace(/[^ws]/g, '').split(/s+/).filter(Boolean);

    // Find consecutive duplicates
    const consecutiveDups = [];
    for (let i = 0; i < words.length - 1; i++) {
      if (words[i] === words[i + 1]) {
        consecutiveDups.push(words[i]);
      }
    }

    // Find overall duplicates
    const counts = {};
    words.forEach(w => { counts[w] = (counts[w] || 0) + 1; });
    const overallDups = Object.entries(counts).filter(([_, c]) => c > 1).sort((a, b) => b[1] - a[1]);

    let res = '--- DUPLICATE WORD FINDER ---nn';
    res += `Consecutive Duplicates (e.g. "the the"): ${consecutiveDups.length > 0 ? consecutiveDups.join(', ') : 'None'}nn`;
    res += `Repeated Words Frequency:n`;
    overallDups.forEach(([w, c]) => {
      res += `- "${w}": ${c} timesn`;
    });

    if (out) out.value = res;
    if (window.showToast) window.showToast('Duplicate words identified!', 'success');
  }

  const activeBtn = document.getElementById('calc-dup-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
