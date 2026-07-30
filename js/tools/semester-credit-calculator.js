/**
 * Real Client-Side Semester Credit & GPA Calculator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('scc-c1-credits')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:0.75rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.25rem">Course 1 Credits:</label>
          <input type="number" id="scc-c1-credits" class="form-input" value="4" style="width:100%;padding:0.4rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.25rem">Course 1 Grade (4.0 Scale):</label>
          <input type="number" id="scc-c1-grade" class="form-input" value="3.7" step="0.1" style="width:100%;padding:0.4rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:0.75rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.25rem">Course 2 Credits:</label>
          <input type="number" id="scc-c2-credits" class="form-input" value="3" style="width:100%;padding:0.4rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.25rem">Course 2 Grade (4.0 Scale):</label>
          <input type="number" id="scc-c2-grade" class="form-input" value="4.0" step="0.1" style="width:100%;padding:0.4rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-scc-btn" class="btn btn-primary flex-1">🎓 Calculate Semester GPA</button>
      </div>
    `;
  }

  function calculate() {
    const c1c = parseFloat(document.getElementById('scc-c1-credits') ? document.getElementById('scc-c1-credits').value : 4) || 0;
    const c1g = parseFloat(document.getElementById('scc-c1-grade') ? document.getElementById('scc-c1-grade').value : 3.7) || 0;
    const c2c = parseFloat(document.getElementById('scc-c2-credits') ? document.getElementById('scc-c2-credits').value : 3) || 0;
    const c2g = parseFloat(document.getElementById('scc-c2-grade') ? document.getElementById('scc-c2-grade').value : 4.0) || 0;

    const totalCredits = c1c + c2c;
    const totalQualityPoints = (c1c * c1g) + (c2c * c2g);
    const semesterGPA = totalCredits > 0 ? totalQualityPoints / totalCredits : 0;

    let res = `--- SEMESTER CREDIT & GPA REPORT ---nn`;
    res += `Total Semester Credits: ${totalCredits} Credit Hoursn`;
    res += `Total Quality Points:   ${totalQualityPoints.toFixed(2)}n`;
    res += `SEMESTER GPA:           ${semesterGPA.toFixed(3)}nn`;
    res += `Status: ✅ Computed weighted credit-hour average.`;

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Semester GPA: ${semesterGPA.toFixed(2)}`, 'success');
  }

  const activeBtn = document.getElementById('calc-scc-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});