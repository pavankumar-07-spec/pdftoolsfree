/**
 * Due Date Calculator Engine
 * Supports Pregnancy Due Date (Naegele's Rule) & Business Payment / Project Due Date
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('dd-mode')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Calculation Mode:</label>
        <select id="dd-mode" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
          <option value="business">Business / Project Due Date</option>
          <option value="pregnancy">Pregnancy Estimated Due Date (EDD)</option>
        </select>
      </div>

      <div id="dd-business-panel">
        <div style="margin-bottom:1rem">
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Start Date:</label>
          <input type="date" id="dd-start-date" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
          <div>
            <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Duration Value:</label>
            <input type="number" id="dd-duration-val" class="form-input" value="30" min="1" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
          </div>
          <div>
            <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Unit:</label>
            <select id="dd-duration-unit" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
              <option value="days">Calendar Days</option>
              <option value="biz-days">Business Days (Excl. Weekends)</option>
              <option value="weeks">Weeks</option>
              <option value="months">Months</option>
            </select>
          </div>
        </div>
      </div>

      <div id="dd-pregnancy-panel" style="display:none">
        <div style="margin-bottom:1rem">
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">First Day of Last Menstrual Period (LMP):</label>
          <input type="date" id="dd-lmp-date" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div style="margin-bottom:1rem">
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Average Cycle Length (Days):</label>
          <input type="number" id="dd-cycle-len" class="form-input" value="28" min="20" max="45" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
      </div>

      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-dd-btn" class="btn btn-primary flex-1">📅 Calculate Due Date</button>
      </div>
    `;

    // Set today as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dd-start-date').value = today;
    document.getElementById('dd-lmp-date').value = today;

    document.getElementById('dd-mode').addEventListener('change', (e) => {
      const isPreg = e.target.value === 'pregnancy';
      document.getElementById('dd-business-panel').style.display = isPreg ? 'none' : 'block';
      document.getElementById('dd-pregnancy-panel').style.display = isPreg ? 'block' : 'none';
    });
  }

  function formatDate(d) {
    return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  function calculate() {
    const modeEl = document.getElementById('dd-mode');
    const mode = modeEl ? modeEl.value : 'business';

    let res = '--- DUE DATE CALCULATOR RESULTS ---nn';

    if (mode === 'business') {
      const startDateStr = document.getElementById('dd-start-date') ? document.getElementById('dd-start-date').value : '';
      const durVal = parseInt(document.getElementById('dd-duration-val') ? document.getElementById('dd-duration-val').value : '30', 10) || 0;
      const unit = document.getElementById('dd-duration-unit') ? document.getElementById('dd-duration-unit').value : 'days';

      if (!startDateStr) {
        if (out) out.value = 'ERROR: Please select a valid start date.';
        return;
      }

      const start = new Date(startDateStr + 'T00:00:00');
      let target = new Date(start);

      if (unit === 'days') {
        target.setDate(target.getDate() + durVal);
      } else if (unit === 'weeks') {
        target.setDate(target.getDate() + durVal * 7);
      } else if (unit === 'months') {
        target.setMonth(target.getMonth() + durVal);
      } else if (unit === 'biz-days') {
        let added = 0;
        while (added < durVal) {
          target.setDate(target.getDate() + 1);
          const day = target.getDay();
          if (day !== 0 && day !== 6) {
            added++;
          }
        }
      }

      res += `Start Date: ${formatDate(start)}n`;
      res += `Added Duration: ${durVal} ${unit}nn`;
      res += `=== CALCULATED DUE DATE ===n`;
      res += `${formatDate(target)}n`;
      res += `(ISO Format: ${target.toISOString().split('T')[0]})n`;
    } else {
      const lmpStr = document.getElementById('dd-lmp-date') ? document.getElementById('dd-lmp-date').value : '';
      const cycleLen = parseInt(document.getElementById('dd-cycle-len') ? document.getElementById('dd-cycle-len').value : '28', 10) || 28;

      if (!lmpStr) {
        if (out) out.value = 'ERROR: Please select LMP date.';
        return;
      }

      const lmp = new Date(lmpStr + 'T00:00:00');
      // Naegele's Rule adjusted for cycle length: EDD = LMP + 280 days + (cycleLen - 28) days
      const eddDays = 280 + (cycleLen - 28);
      const edd = new Date(lmp);
      edd.setDate(edd.getDate() + eddDays);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const diffMs = today - lmp;
      const diffDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
      const currentWeeks = Math.floor(diffDays / 7);
      const currentDays = diffDays % 7;

      res += `First Day of Last Period: ${formatDate(lmp)}n`;
      res += `Cycle Length: ${cycleLen} daysnn`;
      res += `=== ESTIMATED PREGNANCY DUE DATE (EDD) ===n`;
      res += `${formatDate(edd)}nn`;
      res += `--- CURRENT GESTATIONAL AGE ---n`;
      res += `${currentWeeks} weeks, ${currentDays} daysn`;
      res += `Trimester: ${currentWeeks < 13 ? 'First Trimester' : currentWeeks < 27 ? 'Second Trimester' : 'Third Trimester'}n`;
    }

    if (out) out.value = res;
    if (window.showToast) window.showToast('Due date calculated successfully!', 'success');
  }

  const activeBtn = document.getElementById('calc-dd-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
