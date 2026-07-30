/**
 * Word & Character Counter Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('wc-text')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Enter Text to Count & Analyze:</label>
        <textarea id="wc-text" class="form-input" style="width:100%;height:140px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" placeholder="Type or paste your text here...">FreeToolsPDF provides 407+ free online tools for students and professionals. All data is processed 100% locally in your browser for total privacy.</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-wc-btn" class="btn btn-primary flex-1">📝 Analyze Word & Character Count</button>
      </div>
    `;
  }

  function calculate() {
    const text = document.getElementById('wc-text') ? document.getElementById('wc-text').value : '';

    const charCount = text.length;
    const charNoSpaces = text.replace(/s/g, '').length;
    const words = text.trim() ? text.trim().split(/s+/).filter(Boolean) : [];
    const wordCount = words.length;
    const lines = text.split('n').length;
    const paragraphs = text.split(/ns*n/).filter(p => p.trim().length > 0).length;

    // Average reading speed: 200 wpm, speaking speed: 130 wpm
    const readingTimeMin = (wordCount / 200).toFixed(2);
    const speakingTimeMin = (wordCount / 130).toFixed(2);

    let res = '--- WORD & CHARACTER COUNTER ANALYSIS ---nn';
    res += `• Words: ${wordCount.toLocaleString()}n`;
    res += `• Characters (with spaces): ${charCount.toLocaleString()}n`;
    res += `• Characters (without spaces): ${charNoSpaces.toLocaleString()}n`;
    res += `• Lines: ${lines.toLocaleString()}n`;
    res += `• Paragraphs: ${paragraphs.toLocaleString()}nn`;
    res += `• Estimated Reading Time: ~${readingTimeMin} minutesn`;
    res += `• Estimated Speaking Time: ~${speakingTimeMin} minutesn`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Text analysis complete!', 'success');
  }

  const activeBtn = document.getElementById('calc-wc-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
