/**
 * Bootstrap 5 Color System & Theme Utilities Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('bs-search')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Search Bootstrap Theme Class (e.g. primary, success, danger):</label>
        <input type="text" id="bs-search" class="form-input" value="primary" placeholder="Enter theme name..." style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-bs-btn" class="btn btn-primary flex-1">🎨 View Bootstrap 5 Theme Swatches</button>
      </div>
    `;
  }

  const bootstrapColors = {
    primary: { hex: '#0d6efd', rgb: '13, 110, 253', description: 'Main brand theme accent color' },
    secondary: { hex: '#6c757d', rgb: '108, 117, 125', description: 'Secondary quiet/neutral UI tone' },
    success: { hex: '#198754', rgb: '25, 135, 84', description: 'Positive feedback, confirmations, completed tasks' },
    info: { hex: '#0dcaf0', rgb: '13, 202, 240', description: 'Informational callouts and notifications' },
    warning: { hex: '#ffc107', rgb: '255, 193, 7', description: 'Alerts, pending states, cautionary feedback' },
    danger: { hex: '#dc3545', rgb: '220, 53, 69', description: 'Error states, destructions, critical warnings' },
    light: { hex: '#f8f9fa', rgb: '248, 249, 250', description: 'Subtle light backgrounds and contrast elements' },
    dark: { hex: '#212529', rgb: '33, 37, 41', description: 'Dark backgrounds, headers, and primary text' }
  };

  function calculate() {
    const query = document.getElementById('bs-search') ? document.getElementById('bs-search').value.trim().toLowerCase() : '';

    let res = `--- BOOTSTRAP 5 COLOR SYSTEM REFERENCE ---nn`;

    const keys = Object.keys(bootstrapColors).filter(k => !query || k.includes(query));

    if (keys.length === 0) {
      res += `No Bootstrap theme colors matching "${query}". Available: ${Object.keys(bootstrapColors).join(', ')}`;
    } else {
      keys.forEach(k => {
        const item = bootstrapColors[k];
        res += `=== ${k.toUpperCase()} ===n`;
        res += `HEX Code:       ${item.hex}n`;
        res += `RGB Value:      rgb(${item.rgb})n`;
        res += `Text Utility:   .text-${k}n`;
        res += `BG Utility:     .bg-${k}n`;
        res += `Btn Utility:    .btn-${k}n`;
        res += `CSS Variable:   var(--bs-${k})n`;
        res += `Usage Note:     ${item.description}nn`;
      });
    }

    if (out) out.value = res;
    if (window.showToast) window.showToast('Bootstrap 5 colors loaded!', 'success');
  }

  const activeBtn = document.getElementById('calc-bs-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
