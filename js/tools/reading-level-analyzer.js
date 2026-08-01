/**
 * Reading Level & Flesch-Kincaid Readability Analyzer Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('rla-text')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input Essay / Article Text:</label>
        <textarea id="rla-text" class="form-input" style="width:100%;height:120px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">FreeToolsPDF provides complete privacy-first web utilities. The platform operates 100% locally in your web browser without sending documents to external servers.</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-rla-btn" class="btn btn-primary flex-1">📖 Analyze Readability Level</button>
      </div>
    `;
  }

  function countSyllables(word) {
    word = word.toLowerCase().replace(/[^a-z]/g, '');
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const syllables = word.match(/[aeiouy]{1,2}/g);
    return syllables ? syllables.length : 1;
  }

  function calculate() {
    const text = document.getElementById('rla-text') ? document.getElementById('rla-text').value : (document.getElementById('text-input') ? document.getElementById('text-input').value : '');

    if (!text.trim()) {
      if (out) out.value = 'ERROR: Please enter text to analyze.';
      return;
    }

    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length || 1;
    const words = text.toLowerCase().match(/b[a-z0-9'-]+b/g) || [];
    const totalWords = words.length || 1;

    let totalSyllables = 0;
    words.forEach(w => totalSyllables += countSyllables(w));

    // Flesch Reading Ease: 206.835 - 1.015 * (totalWords/sentences) - 84.6 * (totalSyllables/totalWords)
    const fleschEase = 206.835 - (1.015 * (totalWords / sentences)) - (84.6 * (totalSyllables / totalWords));
    // Flesch-Kincaid Grade Level: 0.39 * (totalWords/sentences) + 11.8 * (totalSyllables/totalWords) - 15.59
    const gradeLevel = (0.39 * (totalWords / sentences)) + (11.8 * (totalSyllables / totalWords)) - 15.59;

    let easeCategory = 'Plain English (8th-9th Grade)';
    if (fleschEase >= 90) easeCategory = 'Very Easy (5th Grade level)';
    else if (fleschEase >= 70) easeCategory = 'Easy (7th Grade level)';
    else if (fleschEase >= 50) easeCategory = 'Fairly Difficult (High School level)';
    else if (fleschEase < 50) easeCategory = 'Difficult (College level)';

    let res = `--- READABILITY & FLESCH-KINCAID REPORT ---nn`;
    res += `Total Words:     ${totalWords}n`;
    res += `Total Sentences: ${sentences}n`;
    res += `Total Syllables: ${totalSyllables}nn`;

    res += `=== READABILITY SCORES ===n`;
    res += `• Flesch Reading Ease:     ${fleschEase.toFixed(1)} / 100 (${easeCategory})n`;
    res += `• Flesch-Kincaid Grade:    Grade ${Math.max(1, gradeLevel).toFixed(1)}n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Readability: Grade ${Math.max(1, gradeLevel).toFixed(1)}`, 'success');
  }

  const activeBtn = document.getElementById('calc-rla-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
