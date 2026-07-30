/**
 * Pregnancy Due Date Calculator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('pc-lmp')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">First Day of Last Menstrual Period (LMP):</label>
        <input type="date" id="pc-lmp" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-pc-btn" class="btn btn-primary flex-1">👶 Calculate Estimated Due Date</button>
      </div>
    `;

    const twoMonthsAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    document.getElementById('pc-lmp').value = twoMonthsAgo;
  }

  function calculate() {
    const lmpStr = document.getElementById('pc-lmp') ? document.getElementById('pc-lmp').value : '';

    if (!lmpStr) {
      if (out) out.value = 'ERROR: Please select LMP date.';
      return;
    }

    const lmp = new Date(lmpStr + 'T00:00:00');
    // Naegele's Rule: Add 280 days (40 weeks) to LMP
    const edd = new Date(lmp.getTime() + 280 * 24 * 60 * 60 * 1000);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const gestMs = today - lmp;
    const gestDays = Math.max(0, Math.floor(gestMs / (1000 * 60 * 60 * 24)));
    const gestWeeks = Math.floor(gestDays / 7);
    const remDays = gestDays % 7;

    let res = `--- PREGNANCY DUE DATE REPORT ---nn`;
    res += `Last Menstrual Period (LMP): ${lmp.toDateString()}nn`;

    res += `=== ESTIMATED DUE DATE (EDD) ===n`;
    res += `• Estimated Delivery Date:  ${edd.toDateString()}n`;
    res += `• Current Gestational Age: ${gestWeeks} Weeks, ${remDays} Days (${gestDays} Total Days)n`;
    res += `• Trimester:               ${gestWeeks < 13 ? 'First Trimester' : gestWeeks < 27 ? 'Second Trimester' : 'Third Trimester'}n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Estimated Due Date: ${edd.toLocaleDateString()}`, 'success');
  }

  const activeBtn = document.getElementById('calc-pc-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
