/**
 * Hourly Wage & Salary Income Converter Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('hw-rate')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Hourly Wage Rate ($ / ₹):</label>
          <input type="number" id="hw-rate" class="form-input" value="25" min="1" step="0.5" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Regular Hours / Week:</label>
          <input type="number" id="hw-hours" class="form-input" value="40" min="1" max="80" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Overtime Hours / Week:</label>
          <input type="number" id="hw-ot-hours" class="form-input" value="0" min="0" max="40" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Est. Tax Deduction (%):</label>
          <input type="number" id="hw-tax" class="form-input" value="15" min="0" max="60" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-hw-btn" class="btn btn-primary flex-1">💵 Calculate Salary Breakdown</button>
      </div>
    `;
  }

  function calculate() {
    const rate = parseFloat(document.getElementById('hw-rate') ? document.getElementById('hw-rate').value : 25) || 0;
    const hoursWeek = parseFloat(document.getElementById('hw-hours') ? document.getElementById('hw-hours').value : 40) || 0;
    const otHoursWeek = parseFloat(document.getElementById('hw-ot-hours') ? document.getElementById('hw-ot-hours').value : 0) || 0;
    const taxPct = parseFloat(document.getElementById('hw-tax') ? document.getElementById('hw-tax').value : 15) || 0;

    if (rate <= 0 || hoursWeek <= 0) {
      if (out) out.value = 'ERROR: Please enter valid hourly rate and regular hours per week.';
      return;
    }

    const otRate = rate * 1.5;
    const regWeeklyPay = rate * hoursWeek;
    const otWeeklyPay = otHoursWeek * otRate;
    const grossWeekly = regWeeklyPay + otWeeklyPay;

    const weeksPerYear = 52;
    const grossAnnual = grossWeekly * weeksPerYear;
    const grossMonthly = grossAnnual / 12;
    const grossBiWeekly = grossWeekly * 2;
    const grossDaily = grossWeekly / 5;

    const taxRate = taxPct / 100;
    const netAnnual = grossAnnual * (1 - taxRate);
    const netMonthly = grossMonthly * (1 - taxRate);
    const netWeekly = grossWeekly * (1 - taxRate);

    let res = `--- HOURLY WAGE & SALARY CONVERTER ---nn`;
    res += `Base Wage Rate:     $${rate.toFixed(2)} / hrn`;
    res += `Regular Hours:      ${hoursWeek} hrs / weekn`;
    if (otHoursWeek > 0) {
      res += `Overtime Hours:     ${otHoursWeek} hrs / week @ $${otRate.toFixed(2)} / hr (1.5x)n`;
    }
    res += `Tax Deduction:      ${taxPct}%nn`;

    res += `=== GROSS PAY BREAKDOWN ===n`;
    res += `Daily Pay (5-day):  $${grossDaily.toFixed(2)}n`;
    res += `Weekly Pay:         $${grossWeekly.toFixed(2)}n`;
    res += `Bi-Weekly Pay:      $${grossBiWeekly.toFixed(2)}n`;
    res += `Monthly Pay:        $${grossMonthly.toFixed(2)}n`;
    res += `ANNUAL GROSS SALARY:$${grossAnnual.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}nn`;

    res += `=== NET TAKE-HOME PAY (AFTER ${taxPct}% TAX) ===n`;
    res += `Net Weekly:         $${netWeekly.toFixed(2)}n`;
    res += `Net Monthly:        $${netMonthly.toFixed(2)}n`;
    res += `ANNUAL NET TAKE-HOME:$${netAnnual.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Hourly wage conversion completed!', 'success');
  }

  const activeBtn = document.getElementById('calc-hw-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
