/**
 * Age Difference Calculator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('p1-dob')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Person 1 Date of Birth:</label>
          <input type="date" id="p1-dob" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="1995-05-15">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Person 2 Date of Birth:</label>
          <input type="date" id="p2-dob" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="2000-08-20">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-diff-btn" class="btn btn-primary flex-1">👥 Compute Age Difference</button>
      </div>
    `;
  }

  function calculate() {
    const d1Val = document.getElementById('p1-dob') ? document.getElementById('p1-dob').value : null;
    const d2Val = document.getElementById('p2-dob') ? document.getElementById('p2-dob').value : null;

    if (!d1Val || !d2Val) {
      if (out) out.value = 'ERROR: Please enter both dates of birth.';
      return;
    }

    let date1 = new Date(d1Val);
    let date2 = new Date(d2Val);

    if (date1 > date2) {
      const temp = date1;
      date1 = date2;
      date2 = temp;
    }

    let years = date2.getFullYear() - date1.getFullYear();
    let months = date2.getMonth() - date1.getMonth();
    let days = date2.getDate() - date1.getDate();

    if (days < 0) {
      months--;
      const prevMonthLastDay = new Date(date2.getFullYear(), date2.getMonth(), 0).getDate();
      days += prevMonthLastDay;
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const diffMs = Math.abs(date2 - date1);
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    let res = '--- AGE DIFFERENCE CALCULATOR ---nn';
    res += `Person 1 (Older): ${date1.toDateString()}n`;
    res += `Person 2 (Younger): ${date2.toDateString()}nn`;
    res += `Age Gap: ${years} Years, ${months} Months, ${days} Daysn`;
    res += `Total Days Difference: ${totalDays.toLocaleString()} daysn`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Age difference computed!', 'success');
  }

  const activeBtn = document.getElementById('calc-diff-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
