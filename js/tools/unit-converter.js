/**
 * Universal Unit Converter Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  const categories = {
    Length: { m: 1, km: 1e-3, cm: 100, mm: 1000, mi: 0.000621371, yd: 1.09361, ft: 3.28084, inch: 39.3701, nm: 1e9 },
    Mass: { kg: 1, g: 1000, mg: 1e6, lb: 2.20462, oz: 35.274, ton: 0.001 },
    Temperature: { C: 'special', F: 'special', K: 'special' },
    Speed: { 'km/h': 1, 'm/s': 0.277778, mph: 0.621371, knot: 0.539957 },
    Area: { 'm²': 1, 'km²': 1e-6, 'cm²': 1e4, 'ft²': 10.7639, 'in²': 1550, acre: 0.000247105 },
    Volume: { L: 1, mL: 1000, 'm³': 0.001, 'ft³': 0.0353147, gallon: 0.264172, cup: 4.22675 },
    Time: { s: 1, ms: 1000, min: 0.016667, h: 2.77778e-4, day: 1.15741e-5, week: 1.65344e-6 },
  };

  if (inputsContainer && !document.getElementById('uc-value')) {
    const catOpts = Object.keys(categories).map(c => `<option value="${c}">${c}</option>`).join('');
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Category:</label>
          <select id="uc-cat" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">${catOpts}</select>
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Value:</label>
          <input type="number" id="uc-value" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="1">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-uc-btn" class="btn btn-primary flex-1">🔄 Convert All Units</button>
      </div>
    `;
  }

  function convertTemp(val, from) {
    const c = from === 'C' ? val : from === 'F' ? (val - 32) * 5 / 9 : val - 273.15;
    return { C: c.toFixed(4), F: (c * 9/5 + 32).toFixed(4), K: (c + 273.15).toFixed(4) };
  }

  function calculate() {
    const cat = document.getElementById('uc-cat')?.value || 'Length';
    const val = parseFloat(document.getElementById('uc-value')?.value || 1);
    const units = categories[cat];

    if (isNaN(val)) { if (out) out.value = 'ERROR: Enter a valid number.'; return; }

    let res = `--- ${cat.toUpperCase()} CONVERTER ---nnInput: ${val}nn`;

    if (cat === 'Temperature') {
      const temps = convertTemp(val, 'C');
      res += `Celsius: ${val}°CnFahrenheit: ${temps.F}°FnKelvin: ${temps.K} Kn`;
    } else {
      const baseUnits = Object.keys(units);
      const firstUnit = baseUnits[0];
      const baseVal = val / units[firstUnit];
      baseUnits.forEach(u => {
        res += `${u}: ${(baseVal * units[u]).toFixed(6)}n`;
      });
    }

    if (out) out.value = res;
    if (window.showToast) window.showToast('Conversion complete!', 'success');
  }

  const activeBtn = document.getElementById('calc-uc-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
