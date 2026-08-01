/**
 * Attendance Predictor & Planner Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');
  const predictionResult = document.getElementById('prediction-result');
  const itemsList = document.getElementById('items-list');

  if (inputsContainer && !document.getElementById('att-conducted')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Classes Attended:</label>
          <input type="number" id="att-attended" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="38" min="0">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Total Classes Conducted:</label>
          <input type="number" id="att-conducted" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="50" min="0">
        </div>
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Target Attendance (%):</label>
        <input type="number" id="att-target" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="75" min="1" max="100">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-att-btn" class="btn btn-primary flex-1">📊 Predict Attendance Status</button>
      </div>
    `;
  }

  function calculate() {
    const attended = parseInt(document.getElementById('att-attended')?.value || '0', 10);
    const conducted = parseInt(document.getElementById('att-conducted')?.value || '0', 10);
    const target = parseFloat(document.getElementById('att-target')?.value || '75');

    if (isNaN(attended) || isNaN(conducted) || isNaN(target) || conducted < 0 || attended < 0 || target <= 0) {
      if (out) out.value = 'Please enter valid inputs.';
      return;
    }

    if (attended > conducted) {
      if (out) out.value = 'Error: Attended classes cannot be greater than conducted classes.';
      return;
    }

    const currentPct = conducted > 0 ? (attended / conducted) * 100 : 100;
    let resMsg = '';
    let predictionMsg = '';

    resMsg += `Current Attendance: ${currentPct.toFixed(2)}%n`;
    resMsg += `Attended: ${attended} / ${conducted} conducted classesnn`;

    if (currentPct >= target) {
      // User is safe, calculate how many classes they can skip
      // (attended) / (conducted + skipCount) = target / 100
      // attended * 100 / target = conducted + skipCount
      // skipCount = floor(attended * 100 / target) - conducted
      const maxConductableWithSafety = Math.floor((attended * 100) / target);
      const skipCount = Math.max(0, maxConductableWithSafety - conducted);

      if (skipCount > 0) {
        predictionMsg = `🎉 You are currently SAFE! You can afford to skip the next **${skipCount}** classes consecutively while maintaining at least ${target}% attendance.`;
      } else {
        predictionMsg = `👍 You are SAFE! But you cannot afford to skip any upcoming classes without falling below your target of ${target}%.`;
      }
    } else {
      // User is not safe, calculate how many consecutive classes they must attend
      // (attended + attendCount) / (conducted + attendCount) = target / 100
      // 100 * attended + 100 * attendCount = target * conducted + target * attendCount
      // (100 - target) * attendCount = target * conducted - 100 * attended
      // attendCount = ceil((target * conducted - 100 * attended) / (100 - target))
      if (target >= 100) {
        predictionMsg = `❌ It is mathematically impossible to reach 100% attendance if you have already missed classes.`;
      } else {
        const attendCount = Math.ceil((target * conducted - 100 * attended) / (100 - target));
        predictionMsg = `⚠️ You are currently BELOW the target. You must attend the next **${attendCount}** classes consecutively to reach your target of ${target}%.`;
      }
    }

    resMsg += predictionMsg + 'nn';
    resMsg += `--- DETAILED RECOMMENDATION ---n`;
    resMsg += `To maintain/reach your target of ${target}%:n`;
    resMsg += ` - If 10 classes are conducted next, you must attend at least ${Math.ceil(((conducted + 10) * target / 100) - attended)} of them.n`;
    resMsg += ` - If 20 classes are conducted next, you must attend at least ${Math.ceil(((conducted + 20) * target / 100) - attended)} of them.n`;
    resMsg += ` - If 50 classes are conducted next, you must attend at least ${Math.ceil(((conducted + 50) * target / 100) - attended)} of them.n`;

    if (out) out.value = resMsg;
    if (predictionResult) {
      predictionResult.innerHTML = `<p style="font-weight:600;margin:0;color:var(--text)">${predictionMsg}</p>`;
    }
    if (itemsList) {
      itemsList.innerHTML = `
        <div style="font-size:0.9rem;color:var(--text-secondary)">
          <strong>Target:</strong> ${target}% | 
          <strong>Current:</strong> ${currentPct.toFixed(2)}% | 
          <strong>Status:</strong> ${currentPct >= target ? '<span style="color:var(--success,#10B981)">Safe</span>' : '<span style="color:var(--error,#EF4444)">Shortage</span>'}
        </div>
      `;
    }

    if (window.showToast) window.showToast('Attendance simulated!', 'success');
  }

  const activeBtn = document.getElementById('calc-att-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
