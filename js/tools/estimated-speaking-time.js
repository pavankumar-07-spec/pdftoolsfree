/**
 * Estimated Speaking & Reading Time Calculator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('est-text')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input Speech / Essay Text:</label>
        <textarea id="est-text" class="form-input" style="width:100%;height:120px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">Ladies and gentlemen, today we present the complete collection of 100% free and private browser-based PDF tools and engineering calculators built for Indian students and global users.</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-est-btn" class="btn btn-primary flex-1">⏱️ Calculate Speaking Time</button>
      </div>
    `;
  }

  function calculate() {
    const text = document.getElementById('est-text') ? document.getElementById('est-text').value : (document.getElementById('text-input') ? document.getElementById('text-input').value : '');

    if (!text.trim()) {
      if (out) out.value = 'ERROR: Please enter text to calculate speaking time.';
      return;
    }

    const wordCount = (text.trim().match(/S+/g) || []).length;
    // Average speech pace: 130 WPM (slow), 150 WPM (average), 180 WPM (fast)
    const speakMinsAvg = wordCount / 130;
    const readMinsAvg = wordCount / 200;

    let res = `--- ESTIMATED SPEAKING & READING TIME REPORT ---nn`;
    res += `Total Word Count: ${wordCount} wordsnn`;

    res += `=== SPEAKING TIME ESTIMATES ===n`;
    res += `• Slow Pace (110 WPM):  ${(wordCount / 110).toFixed(1)} minsn`;
    res += `• Normal Pace (130 WPM): ${(wordCount / 130).toFixed(1)} minsn`;
    res += `• Fast Pace (160 WPM):   ${(wordCount / 160).toFixed(1)} minsnn`;

    res += `=== READING TIME ESTIMATE ===n`;
    res += `• Silent Reading (200 WPM): ${readMinsAvg.toFixed(1)} minsn`;

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Est. Speaking Time: ${speakMinsAvg.toFixed(1)} mins`, 'success');
  }

  const activeBtn = document.getElementById('calc-est-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
