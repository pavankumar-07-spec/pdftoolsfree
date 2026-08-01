document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const out = document.getElementById('main-output');

  if (inputsContainer) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div><label class="form-label">Assignment Deadline Tracker Target Units</label><input type="number" id="assignment-deadline-tracker-target" class="form-input" value="10" min="1"></div>
        <div><label class="form-label">Current Progress / Completed</label><input type="number" id="assignment-deadline-tracker-completed" class="form-input" value="4" min="0"></div>
      </div>
      <button id="assignment-deadline-tracker-calc-btn" class="btn btn-primary w-full">📊 Calculate Assignment Deadline Tracker Metrics</button>
    `;
  }

  function calculate() {
    const target = parseFloat(document.getElementById('assignment-deadline-tracker-target')?.value || 10);
    const completed = parseFloat(document.getElementById('assignment-deadline-tracker-completed')?.value || 0);

    const pct = Math.min(100, (completed / target) * 100);
    const remaining = Math.max(0, target - completed);

    let res = `--- ASSIGNMENT DEADLINE TRACKER METRICS ---nn`;
    res += `Completion Progress: ${pct.toFixed(1)}%n`;
    res += `Completed Units:     ${completed} / ${target}n`;
    res += `Remaining Units:     ${remaining}nn`;
    res += `Status: ${pct >= 100 ? '✅ GOAL COMPLETED!' : '⏳ IN PROGRESS'}n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Assignment Deadline Tracker: ${pct.toFixed(0)}% Complete`, 'success');
  }

  document.getElementById('assignment-deadline-tracker-calc-btn')?.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});