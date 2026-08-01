/**
 * Study Flashcard Maker Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('fm-cards')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Flashcards (Term = Definition, one per line):</label>
        <textarea id="fm-cards" class="form-input" style="width:100%;height:120px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">Determinant = Scalar value calculated from a square matrixnEigenvalue = Factor by which eigenvector is scalednDot Product = Sum of products of corresponding vector entries</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-fm-btn" class="btn btn-primary flex-1">🎴 Format Flashcards</button>
      </div>
    `;
  }

  function calculate() {
    const text = document.getElementById('fm-cards') ? document.getElementById('fm-cards').value : (document.getElementById('text-input') ? document.getElementById('text-input').value : '');

    if (!text.trim()) {
      if (out) out.value = 'ERROR: Please enter flashcard pairs.';
      return;
    }

    const lines = text.split('n').filter(l => l.includes('='));

    let res = `--- STUDY FLASHCARD COLLECTION ---nn`;
    res += `Total Cards: ${lines.length}nn`;

    lines.forEach((line, idx) => {
      const [term, def] = line.split('=').map(s => s.trim());
      res += `🎴 CARD #${idx + 1}n`;
      res += `FRONT: [ ${term} ]n`;
      res += `BACK:  ${def}n`;
      res += `----------------------------------------n`;
    });

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Formatted ${lines.length} flashcards!`, 'success');
  }

  const activeBtn = document.getElementById('calc-fm-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
