/**
 * Digital Signature PNG Generator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('sm-name')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Signature Name / Initials:</label>
        <input type="text" id="sm-name" class="form-input" value="Pavan Kumar Bathula" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Ink Color:</label>
        <select id="sm-color" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
          <option value="#0F172A">Black / Dark Slate ⬛</option>
          <option value="#1D4ED8">Royal Blue 🟦</option>
          <option value="#B91C1C">Dark Red 🟥</option>
        </select>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-sm-btn" class="btn btn-primary flex-1">✍️ Generate Cursive Signature PNG</button>
      </div>
    `;
  }

  function calculate() {
    const name = document.getElementById('sm-name') ? document.getElementById('sm-name').value.trim() : 'Signature';
    const color = document.getElementById('sm-color') ? document.getElementById('sm-color').value : '#0F172A';

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="150" viewBox="0 0 500 150">n  <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" font-family="'Brush Script MT', 'Dancing Script', cursive" font-size="42" font-style="italic" fill="${color}">${name}</text>n</svg>`;

    let res = `--- DIGITAL SIGNATURE GENERATOR REPORT ---nn`;
    res += `Signature Text: "${name}"n`;
    res += `Ink Color:      ${color}nn`;
    res += `=== EMBEDDED TRANSPARENT SVG SIGNATURE ===n`;
    res += svg;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Signature SVG generated!', 'success');
  }

  const activeBtn = document.getElementById('calc-sm-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
