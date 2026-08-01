document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const out = document.getElementById('main-output');

  if (inputsContainer) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:1rem;margin-bottom:1rem">
        <div><label class="form-label">Weight (kg)</label><input type="number" id="water-weight" class="form-input" value="70" min="30"></div>
        <div><label class="form-label">Daily Exercise (mins)</label><input type="number" id="water-exercise" class="form-input" value="45" min="0"></div>
        <div><label class="form-label">Climate / Weather</label>
          <select id="water-climate" class="form-input">
            <option value="normal">Moderate / Temperate</option>
            <option value="hot">Hot / Humid Climate (+0.5L)</option>
          </select>
        </div>
      </div>
      <button id="water-calc-btn" class="btn btn-primary w-full">💧 Calculate Daily Hydration Goal</button>
    `;
  }

  function calculate() {
    const weight = parseFloat(document.getElementById('water-weight')?.value || 70);
    const exercise = parseFloat(document.getElementById('water-exercise')?.value || 0);
    const climate = document.getElementById('water-climate')?.value || 'normal';

    let baseLiters = weight * 0.035;
    baseLiters += (exercise / 30) * 0.35;
    if (climate === 'hot') baseLiters += 0.5;

    const glasses = Math.round(baseLiters * 4);

    let res = `--- DAILY WATER INTAKE HYDRATION PLAN ---

`;
    res += `Target Daily Hydration: ${baseLiters.toFixed(2)} Liters (${Math.round(baseLiters * 1000)} mL)
`;
    res += `Equivalent Standard Glasses (250mL): ${glasses} glasses/day

`;
    res += `=== RECOMMENDED DRINKING SCHEDULE ===
`;
    res += `• Morning Wakeup: 2 glasses (500 mL)
`;
    res += `• Before Meals:   1 glass 30 mins before each meal
`;
    res += `• During Workout: ${(exercise * 10).toFixed(0)} mL during exercise
`;
    res += `• Evening:        ${Math.max(1, glasses - 6)} glass(es) before 8 PM
`;

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Hydration Target: ${baseLiters.toFixed(1)} Liters/day`, 'success');
  }

  document.getElementById('water-calc-btn')?.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});