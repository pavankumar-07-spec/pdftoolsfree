/**
 * Exam Countdown Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('ec-name')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Exam Name / Subject:</label>
        <input type="text" id="ec-name" class="form-input" value="B.Tech Mathematics Semester Final" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Exam Date:</label>
        <input type="date" id="ec-date" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-ec-btn" class="btn btn-primary flex-1">🎓 Calculate Exam Countdown</button>
      </div>
    `;

    const nextMonth = new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    document.getElementById('ec-date').value = nextMonth;
  }

  function calculate() {
    const examName = document.getElementById('ec-name') ? document.getElementById('ec-name').value : 'Exam';
    const dateStr = document.getElementById('ec-date') ? document.getElementById('ec-date').value : '';

    if (!dateStr) {
      if (out) out.value = 'ERROR: Please select an exam date.';
      return;
    }

    const examDate = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffMs = examDate - today;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    let res = `--- EXAM COUNTDOWN REPORT ---nn`;
    res += `Subject: ${examName}n`;
    res += `Exam Date: ${examDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}nn`;

    if (diffDays < 0) {
      res += `Status: 🎓 EXAM PASSED (${Math.abs(diffDays)} days ago)n`;
    } else if (diffDays === 0) {
      res += `Status: 🚨 EXAM IS TODAY! GOOD LUCK!n`;
    } else {
      const weeks = Math.floor(diffDays / 7);
      const remDays = diffDays % 7;
      res += `=== DAYS REMAINING ===n`;
      res += `⏳ ${diffDays} Days Remaining (${weeks} Weeks and ${remDays} Days)nn`;
      res += `Suggested Study Target: ~${Math.ceil(50 / Math.max(1, diffDays))} hours / dayn`;
    }

    if (out) out.value = res;
    if (window.showToast) window.showToast(`${diffDays} days remaining until exam!`, 'success');
  }

  const activeBtn = document.getElementById('calc-ec-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
