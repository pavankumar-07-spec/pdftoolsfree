/**
 * Age Calculator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('dob-input')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Date of Birth:</label>
          <input type="date" id="dob-input" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Age at Date:</label>
          <input type="date" id="target-date-input" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-age-btn" class="btn btn-primary flex-1">🎂 Calculate Exact Age</button>
      </div>
    `;
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('target-date-input').value = today;
    document.getElementById('dob-input').value = '2000-01-01';
  }

  function calculate() {
    const dobVal = document.getElementById('dob-input') ? document.getElementById('dob-input').value : null;
    const targetVal = document.getElementById('target-date-input') ? document.getElementById('target-date-input').value : null;

    if (!dobVal) {
      if (out) out.value = 'ERROR: Please select your Date of Birth.';
      return;
    }

    const dob = new Date(dobVal);
    const target = targetVal ? new Date(targetVal) : new Date();

    if (dob > target) {
      if (out) out.value = 'ERROR: Date of birth cannot be in the future of the target date.';
      return;
    }

    let years = target.getFullYear() - dob.getFullYear();
    let months = target.getMonth() - dob.getMonth();
    let days = target.getDate() - dob.getDate();

    if (days < 0) {
      months--;
      const prevMonthLastDay = new Date(target.getFullYear(), target.getMonth(), 0).getDate();
      days += prevMonthLastDay;
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const diffMs = target - dob;
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const totalWeeks = Math.floor(totalDays / 7);

    let res = '--- EXACT AGE CALCULATOR ---nn';
    res += `Date of Birth: ${dob.toDateString()}n`;
    res += `Target Date: ${target.toDateString()}nn`;
    res += `Exact Age: ${years} Years, ${months} Months, ${days} Daysnn`;
    res += `Summary Statistics:n`;
    res += `• Total Months: ${years * 12 + months} months, ${days} daysn`;
    res += `• Total Weeks: ${totalWeeks.toLocaleString()} weeksn`;
    res += `• Total Days: ${totalDays.toLocaleString()} daysn`;
    res += `• Total Hours: ${totalHours.toLocaleString()} hoursn`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Exact age calculated!', 'success');
  }

  const activeBtn = document.getElementById('calc-age-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
