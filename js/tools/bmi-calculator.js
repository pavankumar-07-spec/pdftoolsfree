/**
 * Upgraded BMI Calculator Engine with Visual Result Breakdown Cards
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('health-age')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:1rem;margin-bottom:1.5rem">
        <div>
          <label class="form-label">Age (Years)</label>
          <input type="number" id="health-age" class="form-input" value="28" min="1" max="120">
        </div>
        <div>
          <label class="form-label">Weight (kg)</label>
          <input type="number" id="health-weight" class="form-input" value="70" min="1">
        </div>
        <div>
          <label class="form-label">Height (cm)</label>
          <input type="number" id="health-height" class="form-input" value="175" min="1">
        </div>
      </div>
      <div class="flex gap-3 mt-4">
        <button id="calc-bmi-btn" class="btn btn-primary flex-1">⚖️ Calculate BMI & Health Metrics</button>
      </div>
    `;
  }

  function calculateHealth() {
    const age = parseFloat(document.getElementById('health-age') ? document.getElementById('health-age').value : 28);
    const weight = parseFloat(document.getElementById('health-weight') ? document.getElementById('health-weight').value : 70);
    const height = parseFloat(document.getElementById('health-height') ? document.getElementById('health-height').value : 175);

    const heightM = height / 100;
    const bmi = weight / (heightM * heightM);

    let category = 'Normal Weight';
    let badgeColor = '#22c55e'; // Green
    let emoji = '🟢';

    if (bmi < 18.5) {
      category = 'Underweight';
      badgeColor = '#3b82f6'; // Blue
      emoji = '🟦';
    } else if (bmi >= 25 && bmi < 30) {
      category = 'Overweight';
      badgeColor = '#f59e0b'; // Amber
      emoji = '🟡';
    } else if (bmi >= 30) {
      category = 'Obese';
      badgeColor = '#ef4444'; // Red
      emoji = '🔴';
    }

    const bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    const water = weight * 0.035;
    const protein = weight * 1.6;

    const res = `==========================================================
                BODY MASS INDEX (BMI) REPORT
==========================================================
BMI Score:              ${bmi.toFixed(2)}
Health Status:          ${emoji} ${category.toUpperCase()}
Basal Metabolic Rate:   ${bmr.toFixed(0)} kcal/day
Daily Water Intake:     ${water.toFixed(1)} Liters
Daily Protein Goal:     ${protein.toFixed(0)} grams/day
==========================================================`;

    if (out) out.value = res;

    // Render Visual Breakdown Card
    const resultsCard = document.getElementById('gen-results-card');
    if (resultsCard) {
      resultsCard.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:1rem;text-align:center">
          <div style="background:var(--surface-2);padding:1rem;border-radius:var(--radius-sm);border:1px solid var(--border)">
            <div style="font-size:0.8rem;color:var(--text-secondary)">BMI Score</div>
            <div style="font-size:2rem;font-weight:800;color:${badgeColor}">${bmi.toFixed(1)}</div>
            <div style="font-size:0.85rem;font-weight:700;color:${badgeColor}">${emoji} ${category}</div>
          </div>
          <div style="background:var(--surface-2);padding:1rem;border-radius:var(--radius-sm);border:1px solid var(--border)">
            <div style="font-size:0.8rem;color:var(--text-secondary)">BMR (Energy/Day)</div>
            <div style="font-size:1.6rem;font-weight:700;color:var(--text)">${bmr.toFixed(0)} <span style="font-size:0.9rem">kcal</span></div>
            <div style="font-size:0.75rem;color:var(--text-secondary)">Basal Metabolic Rate</div>
          </div>
          <div style="background:var(--surface-2);padding:1rem;border-radius:var(--radius-sm);border:1px solid var(--border)">
            <div style="font-size:0.8rem;color:var(--text-secondary)">Daily Targets</div>
            <div style="font-size:1.1rem;font-weight:700;color:var(--primary)">💧 ${water.toFixed(1)}L Water</div>
            <div style="font-size:1.1rem;font-weight:700;color:var(--primary)">🥩 ${protein.toFixed(0)}g Protein</div>
          </div>
        </div>
      `;
    }
  }

  const activeBtn = document.getElementById('calc-bmi-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculateHealth);
  calculateHealth();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});