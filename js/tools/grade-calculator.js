/**
 * Real Client-Side Academic Grade & Score Calculator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('gc-score')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Earned Score / Points:</label>
          <input type="number" id="gc-score" class="form-input" value="88" min="0" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Total Maximum Points:</label>
          <input type="number" id="gc-total" class="form-input" value="100" min="1" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-gc-btn" class="btn btn-primary flex-1">📊 Calculate Letter Grade</button>
      </div>
    `;
  }

  function calculate() {
    const score = parseFloat(document.getElementById('gc-score') ? document.getElementById('gc-score').value : 88) || 0;
    const total = parseFloat(document.getElementById('gc-total') ? document.getElementById('gc-total').value : 100) || 100;

    if (total <= 0) {
      if (out) out.value = 'ERROR: Total points must be greater than 0.';
      return;
    }

    const pct = (score / total) * 100;
    let letter = 'F';
    let gpaPoint = 0.0;

    if (pct >= 93) { letter = 'A'; gpaPoint = 4.0; }
    else if (pct >= 90) { letter = 'A-'; gpaPoint = 3.7; }
    else if (pct >= 87) { letter = 'B+'; gpaPoint = 3.3; }
    else if (pct >= 83) { letter = 'B'; gpaPoint = 3.0; }
    else if (pct >= 80) { letter = 'B-'; gpaPoint = 2.7; }
    else if (pct >= 77) { letter = 'C+'; gpaPoint = 2.3; }
    else if (pct >= 73) { letter = 'C'; gpaPoint = 2.0; }
    else if (pct >= 70) { letter = 'C-'; gpaPoint = 1.7; }
    else if (pct >= 67) { letter = 'D+'; gpaPoint = 1.3; }
    else if (pct >= 60) { letter = 'D'; gpaPoint = 1.0; }

    let res = `--- ACADEMIC GRADE CALCULATOR REPORT ---nn`;
    res += `Earned Points:   ${score} / ${total}n`;
    res += `Percentage:      ${pct.toFixed(2)}%n`;
    res += `LETTER GRADE:    ${letter}n`;
    res += `GPA Scale (4.0): ${gpaPoint.toFixed(1)}nn`;
    res += `Status: ✅ Grade computed according to US 4.0 Standard Scale.`;

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Grade: ${letter} (${pct.toFixed(1)}%)`, 'success');
  }

  const activeBtn = document.getElementById('calc-gc-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});