document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const out = document.getElementById('main-output');

  if (inputsContainer) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:1rem;margin-bottom:1rem">
        <div><label class="form-label">Age (Years)</label><input type="number" id="bmr-age" class="form-input" value="25" min="10" max="100"></div>
        <div><label class="form-label">Gender</label><select id="bmr-gender" class="form-input"><option value="male">Male</option><option value="female">Female</option></select></div>
        <div><label class="form-label">Weight (kg)</label><input type="number" id="bmr-weight" class="form-input" value="70" min="30" max="250"></div>
        <div><label class="form-label">Height (cm)</label><input type="number" id="bmr-height" class="form-input" value="175" min="100" max="230"></div>
        <div><label class="form-label">Activity Level</label>
          <select id="bmr-activity" class="form-input">
            <option value="1.2">Sedentary (Office Job)</option>
            <option value="1.375">Light Exercise (1-3 days/wk)</option>
            <option value="1.55" selected>Moderate Exercise (3-5 days/wk)</option>
            <option value="1.725">Heavy Exercise (6-7 days/wk)</option>
          </select>
        </div>
      </div>
      <button id="bmr-calc-btn" class="btn btn-primary w-full">🔥 Calculate BMR & Maintenance Calories</button>
    `;
  }

  function calculate() {
    const age = parseFloat(document.getElementById('bmr-age')?.value || 25);
    const gender = document.getElementById('bmr-gender')?.value || 'male';
    const w = parseFloat(document.getElementById('bmr-weight')?.value || 70);
    const h = parseFloat(document.getElementById('bmr-height')?.value || 175);
    const act = parseFloat(document.getElementById('bmr-activity')?.value || 1.55);

    let bmr = (10 * w) + (6.25 * h) - (5 * age);
    bmr += (gender === 'male') ? 5 : -161;
    const tdee = bmr * act;

    let res = `--- BMR & DAILY TDEE ENERGY REPORT ---

`;
    res += `Base Metabolic Rate (BMR): ${Math.round(bmr)} kcal/day
`;
    res += `Daily Energy Expenditure (TDEE): ${Math.round(tdee)} kcal/day

`;
    res += `=== DAILY GOALS BY FITNESS TARGET ===
`;
    res += `• Maintenance Calories: ${Math.round(tdee)} kcal/day
`;
    res += `• Mild Fat Loss (-0.25 kg/wk): ${Math.round(tdee - 250)} kcal/day
`;
    res += `• Weight Loss (-0.50 kg/wk): ${Math.round(tdee - 500)} kcal/day
`;
    res += `• Muscle Gain (+0.25 kg/wk): ${Math.round(tdee + 300)} kcal/day
`;

    if (out) out.value = res;
    if (window.showToast) window.showToast(`BMR: ${Math.round(bmr)} kcal | TDEE: ${Math.round(tdee)} kcal`, 'success');
  }

  document.getElementById('bmr-calc-btn')?.addEventListener('click', calculate);
  calculate();
});