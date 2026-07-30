/**
 * Unix Timestamp Converter Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('unix-date-input')) {
    const today = new Date().toISOString().substring(0, 16);
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Select Date & Time:</label>
        <input type="datetime-local" id="unix-date-input" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="${today}">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-unix-btn" class="btn btn-primary flex-1">🕒 Generate Unix Timestamp</button>
      </div>
    `;
  }

  function calculate() {
    const val = document.getElementById('unix-date-input') ? document.getElementById('unix-date-input').value : null;

    if (!val) {
      if (out) out.value = 'ERROR: Please select a valid date and time.';
      return;
    }

    const date = new Date(val);
    const ms = date.getTime();
    const sec = Math.floor(ms / 1000);

    let res = '--- UNIX TIMESTAMP GENERATOR ---nn';
    res += `Selected Date & Time: ${date.toLocaleString()}nn`;
    res += `Unix Timestamp (Seconds): ${sec}n`;
    res += `Unix Timestamp (Milliseconds): ${ms}n`;
    res += `UTC String: ${date.toUTCString()}n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Unix timestamp generated!', 'success');
  }

  const activeBtn = document.getElementById('calc-unix-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
