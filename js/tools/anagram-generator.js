/**
 * Anagram Generator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('ana-input')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label">Input Word or Phrase</label>
        <input type="text" id="ana-input" class="form-input" value="LISTEN">
      </div>
      <div class="flex gap-3 mt-4">
        <button id="calc-ana-btn" type="button" class="btn btn-primary flex-1">🔤 Generate Anagram Permutations</button>
      </div>
    `;
  }

  function permute(str) {
    if (str.length <= 1) return [str];
    const results = new Set();
    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      const remaining = str.slice(0, i) + str.slice(i + 1);
      for (const p of permute(remaining)) {
        results.add(char + p);
      }
    }
    return Array.from(results);
  }

  function generateAnagrams() {
    const raw = (document.getElementById('ana-input')?.value || 'LISTEN').trim().toUpperCase().replace(/[^A-Z]/g, '');

    if (!raw || raw.length > 8) {
      if (out) out.value = 'ERROR: Please enter a word between 1 and 8 letters for performance.';
      return;
    }

    const anagrams = permute(raw);

    let report = `==========================================================
               ANAGRAM PERMUTATION GENERATOR
==========================================================
Input Word:        "${raw}"
Total Permutations: ${anagrams.length}

ANAGRAM LIST:
` + anagrams.join(', ');

    if (out) out.value = report;
    if (window.showToast) window.showToast(`Generated ${anagrams.length} anagrams!`, 'success');
  }

  const activeBtn = document.getElementById('calc-ana-btn');
  if (activeBtn) activeBtn.onclick = () => generateAnagrams();

  generateAnagrams();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
