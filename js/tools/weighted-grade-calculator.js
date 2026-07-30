/**
 * Real Client-Side Weighted Grade & Category Average Calculator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('wgc-a1-score')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:0.75rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.25rem">Homework / Quizzes Score (%):</label>
          <input type="number" id="wgc-a1-score" class="form-input" value="92" style="width:100%;padding:0.4rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.25rem">Category Weight (%):</label>
          <input type="number" id="wgc-a1-weight" class="form-input" value="30" style="width:100%;padding:0.4rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:0.75rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.25rem">Exams / Midterm Score (%):</label>
          <input type="number" id="wgc-a2-score" class="form-input" value="84" style="width:100%;padding:0.4rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.25rem">Category Weight (%):</label>
          <input type="number" id="wgc-a2-weight" class="form-input" value="70" style="width:100%;padding:0.4rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-wgc-btn" class="btn btn-primary flex-1">⚖️ Calculate Weighted Grade</button>
      </div>
    `;
  }

  function calculate() {
    const s1 = parseFloat(document.getElementById('wgc-a1-score') ? document.getElementById('wgc-a1-score').value : 92) || 0;
    const w1 = parseFloat(document.getElementById('wgc-a1-weight') ? document.getElementById('wgc-a1-weight').value : 30) || 0;
    const s2 = parseFloat(document.getElementById('wgc-a2-score') ? document.getElementById('wgc-a2-score').value : 84) || 0;
    const w2 = parseFloat(document.getElementById('wgc-a2-weight') ? document.getElementById('wgc-a2-weight').value : 70) || 0;

    const totalWeight = w1 + w2;
    const weightedSum = (s1 * w1) + (s2 * w2);
    const finalGrade = totalWeight > 0 ? weightedSum / totalWeight : 0;

    let res = `--- WEIGHTED GRADE CALCULATOR REPORT ---nn`;
    res += `Category 1: Score ${s1}% (Weight: ${w1}%)n`;
    res += `Category 2: Score ${s2}% (Weight: ${w2}%)nn`;
    res += `Total Weight Accounted: ${totalWeight}%n`;
    res += `WEIGHTED FINAL GRADE:   ${finalGrade.toFixed(2)}%nn`;
    res += `Status: ✅ Course grade computed using category weight distribution formula.`;

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Weighted Grade: ${finalGrade.toFixed(1)}%`, 'success');
  }

  const activeBtn = document.getElementById('calc-wgc-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});