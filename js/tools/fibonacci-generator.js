/**
 * Fibonacci Sequence Generator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('fg-count')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Number of Terms (N):</label>
        <input type="number" id="fg-count" class="form-input" value="20" min="1" max="100" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-fg-btn" class="btn btn-primary flex-1">🔢 Generate Fibonacci Sequence</button>
      </div>
    `;
  }

  function calculate() {
    const count = parseInt(document.getElementById('fg-count') ? document.getElementById('fg-count').value : 20, 10) || 20;

    const seq = [0, 1];
    for (let i = 2; i < count; i++) {
      seq.push(seq[i - 1] + seq[i - 2]);
    }

    const resultSeq = seq.slice(0, count);

    let res = `--- FIBONACCI SEQUENCE GENERATOR REPORT ---nn`;
    res += `Total Terms Generated: ${count}nn`;
    res += `=== FIBONACCI NUMBERS ===n`;
    res += resultSeq.join(', ');

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Generated ${count} Fibonacci numbers!`, 'success');
  }

  const activeBtn = document.getElementById('calc-fg-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
