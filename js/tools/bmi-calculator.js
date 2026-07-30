/**
 * Bmi Calculator Engine - Deep SEO Alignment
 */
document.addEventListener('DOMContentLoaded', () => {
  const ageIn = document.getElementById('health-age');
  const weightIn = document.getElementById('health-weight');
  const heightIn = document.getElementById('health-height');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  function calculateHealth() {
    const age = parseFloat(ageIn ? ageIn.value : 28);
    const weight = parseFloat(weightIn ? weightIn.value : 70);
    const height = parseFloat(heightIn ? heightIn.value : 175);

    const bmi = weight / Math.pow(height / 100, 2);
    let category = 'Normal weight';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi >= 25 && bmi < 30) category = 'Overweight';
    else if (bmi >= 30) category = 'Obese';

    const bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;

    const res = `--- BMI CALCULATOR METRICS ---
BMI Score: ${bmi.toFixed(2)} (${category})
BMR (Basal Metabolic Rate): ${bmr.toFixed(0)} kcal/day
Daily Water Intake Goal: ${(weight * 0.035).toFixed(1)} Liters
Daily Protein Goal: ${(weight * 1.6).toFixed(0)} g/day`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Health metrics calculated!', 'success');
  }

  if (btn) btn.addEventListener('click', calculateHealth);
  calculateHealth();
});