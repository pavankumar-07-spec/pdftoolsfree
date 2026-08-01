/**
 * Epoch Timestamp Converter Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('epoch-input')) {
    const nowSec = Math.floor(Date.now() / 1000);
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Enter Unix Epoch Timestamp (seconds or milliseconds):</label>
        <input type="text" id="epoch-input" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="${nowSec}">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-epoch-btn" class="btn btn-primary flex-1">🕒 Convert Epoch Timestamp</button>
      </div>
    `;
  }

  function calculate() {
    const val = (document.getElementById('epoch-input')?.value || '').trim();

    if (!val || isNaN(val)) {
      if (out) out.value = 'ERROR: Please enter a valid numeric Unix timestamp.';
      return;
    }

    let num = Number(val);
    // Detect if seconds or ms
    if (num < 1e11) {
      num *= 1000; // Convert seconds to ms
    }

    const date = new Date(num);

    let res = '--- EPOCH TIMESTAMP CONVERTER ---nn';
    res += `Unix Timestamp (Seconds): ${Math.floor(num / 1000)}n`;
    res += `Unix Timestamp (Milliseconds): ${num}nn`;
    res += `GMT / UTC Time: ${date.toUTCString()}n`;
    res += `Local ISO Time: ${date.toLocaleString()}n`;
    res += `Relative Time: ${date.toISOString()}n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Epoch timestamp converted!', 'success');
  }

  const activeBtn = document.getElementById('calc-epoch-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
