/**
 * Age on Any Date Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('birth-date')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Birth Date:</label>
          <input type="date" id="birth-date" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="2000-01-01">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Specific Future/Past Date:</label>
          <input type="date" id="specific-date" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="2050-01-01">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-any-date-btn" class="btn btn-primary flex-1">📅 Compute Age on Date</button>
      </div>
    `;
  }

  function calculate() {
    const bVal = document.getElementById('birth-date') ? document.getElementById('birth-date').value : null;
    const sVal = document.getElementById('specific-date') ? document.getElementById('specific-date').value : null;

    if (!bVal || !sVal) {
      if (out) out.value = 'ERROR: Please enter both dates.';
      return;
    }

    const birth = new Date(bVal);
    const spec = new Date(sVal);

    if (birth > spec) {
      if (out) out.value = 'ERROR: Specified date must be after birth date.';
      return;
    }

    let years = spec.getFullYear() - birth.getFullYear();
    let months = spec.getMonth() - birth.getMonth();
    let days = spec.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonthLastDay = new Date(spec.getFullYear(), spec.getMonth(), 0).getDate();
      days += prevMonthLastDay;
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const totalDays = Math.floor((spec - birth) / (1000 * 60 * 60 * 24));

    let res = '--- AGE ON SPECIFIC DATE ---nn';
    res += `Birth Date: ${birth.toDateString()}n`;
    res += `Target Date: ${spec.toDateString()}nn`;
    res += `Age on ${spec.toDateString()}: ${years} Years, ${months} Months, ${days} Daysn`;
    res += `Total Days Lived: ${totalDays.toLocaleString()} daysn`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Age on date calculated!', 'success');
  }

  const activeBtn = document.getElementById('calc-any-date-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
