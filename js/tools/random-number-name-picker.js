/**
 * Random Name & Winner Picker Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('rnnp-names')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">List of Names / Participants (Line separated):</label>
        <textarea id="rnnp-names" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">PavannRahulnAnanyanSureshnPriya</textarea>
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Number of Winners to Pick:</label>
        <input type="number" id="rnnp-count" class="form-input" value="1" min="1" max="10" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-rnnp-btn" class="btn btn-primary flex-1">🎲 Pick Random Winner</button>
      </div>
    `;
  }

  function calculate() {
    const text = document.getElementById('rnnp-names') ? document.getElementById('rnnp-names').value : (document.getElementById('text-input') ? document.getElementById('text-input').value : '');
    const count = parseInt(document.getElementById('rnnp-count') ? document.getElementById('rnnp-count').value : 1, 10) || 1;

    if (!text.trim()) {
      if (out) out.value = 'ERROR: Please enter names to pick from.';
      return;
    }

    const names = text.split('n').filter(n => n.trim());
    if (names.length === 0) return;

    const shuffled = [...names].sort(() => 0.5 - Math.random());
    const winners = shuffled.slice(0, Math.min(count, names.length));

    let res = `--- RANDOM NAME PICKER REPORT ---nn`;
    res += `Total Candidates: ${names.length}n`;
    res += `Winners Selected: ${winners.length}nn`;
    res += `=== 🎉 SELECTED WINNERS 🎉 ===n`;
    winners.forEach((w, i) => {
      res += `${i + 1}. ${w}n`;
    });

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Winner picked: ${winners.join(', ')}!`, 'success');
  }

  const activeBtn = document.getElementById('calc-rnnp-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
