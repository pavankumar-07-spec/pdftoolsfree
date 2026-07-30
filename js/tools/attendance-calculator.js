document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const out = document.getElementById('main-output');

  if (inputsContainer) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div><label class="form-label">Attended Classes</label><input type="number" id="att-attended" class="form-input" value="45" min="0"></div>
        <div><label class="form-label">Total Conducted</label><input type="number" id="att-total" class="form-input" value="60" min="1"></div>
        <div><label class="form-label">Target Attendance %</label><input type="number" id="att-target" class="form-input" value="75" min="50" max="100"></div>
      </div>
      <button id="att-calc-btn" class="btn btn-primary w-full">📊 Calculate Attendance & Bunk Allowance</button>
    `;
  }

  function calculate() {
    const attended = parseInt(document.getElementById('att-attended')?.value || 0, 10);
    const total = parseInt(document.getElementById('att-total')?.value || 1, 10);
    const target = parseFloat(document.getElementById('att-target')?.value || 75);

    const currentPct = (attended / total) * 100;
    let res = `--- B.TECH ATTENDANCE CALCULATOR REPORT ---

`;
    res += `Current Attendance: ${currentPct.toFixed(2)}%
`;
    res += `Classes Attended:   ${attended} / ${total}
`;
    res += `Target Required:     ${target}%

`;

    if (currentPct >= target) {
      const maxBunk = Math.floor((attended - (target / 100) * total) / (target / 100));
      res += `Status: ✅ SAFE ATTENDANCE!
`;
      res += `Bunk Capacity: You can safely miss the next ${maxBunk} class(es) while staying above ${target}%.
`;
    } else {
      const needed = Math.ceil(((target / 100) * total - attended) / (1 - (target / 100)));
      res += `Status: ⚠️ SHORTAGE WARNING!
`;
      res += `Recovery Needed: You must attend the next ${needed} consecutive class(es) to reach ${target}%.
`;
    }

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Attendance: ${currentPct.toFixed(1)}%`, currentPct >= target ? 'success' : 'warning');
  }

  document.getElementById('att-calc-btn')?.addEventListener('click', calculate);
  calculate();
});