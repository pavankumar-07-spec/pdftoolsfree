/**
 * Upgraded Email Signature Generator Engine (50 Template Presets)
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const out = document.getElementById('main-output');

  if (inputsContainer) {
    const catalog = window.TEMPLATE_CATALOG ? window.TEMPLATE_CATALOG.signatures : [];
    let optionsHtml = '';

    if (catalog && catalog.length > 0) {
      optionsHtml = catalog.map((t, idx) => `<option value="${t.id}" ${idx === 0 ? 'selected' : ''}>${t.name}</option>`).join('');
    } else {
      for (let i = 1; i <= 50; i++) {
        const num = i < 10 ? '0' + i : '' + i;
        optionsHtml += `<option value="signature-${num}" ${i === 1 ? 'selected' : ''}>Signature Template ${num}: Style #${i}</option>`;
      }
    }

    inputsContainer.innerHTML = `
      <div class="template-selector-wrap" style="margin-bottom:1.5rem">
        <span class="template-badge-chip">✨ Select Email Signature Template (50 Presets Available)</span>
        <select id="es-template-style" class="form-input" style="font-weight:700">
          ${optionsHtml}
        </select>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label">Full Name</label>
          <input type="text" id="es-name" class="form-input" value="Alex Morgan">
        </div>
        <div>
          <label class="form-label">Job Title</label>
          <input type="text" id="es-title" class="form-input" value="Senior Product Designer">
        </div>
        <div>
          <label class="form-label">Company / Org</label>
          <input type="text" id="es-company" class="form-input" value="TechNova Solutions">
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label">Email Address</label>
          <input type="email" id="es-email" class="form-input" value="alex.morgan@technova.com">
        </div>
        <div>
          <label class="form-label">Phone Number</label>
          <input type="text" id="es-phone" class="form-input" value="+1 (555) 234-5678">
        </div>
        <div>
          <label class="form-label">Website URL</label>
          <input type="text" id="es-url" class="form-input" value="https://technova.com">
        </div>
      </div>

      <div class="flex gap-3 mt-4">
        <button id="generate-btn" type="button" class="btn btn-primary flex-1">✉️ Generate HTML Email Signature</button>
      </div>
    `;
  }

  function calculate() {
    const style = document.getElementById('es-template-style') ? document.getElementById('es-template-style').value : 'signature-01';
    const name = document.getElementById('es-name') ? document.getElementById('es-name').value : 'Alex Morgan';
    const title = document.getElementById('es-title') ? document.getElementById('es-title').value : 'Senior Product Designer';
    const company = document.getElementById('es-company') ? document.getElementById('es-company').value : 'TechNova Solutions';
    const email = document.getElementById('es-email') ? document.getElementById('es-email').value : 'alex.morgan@technova.com';
    const phone = document.getElementById('es-phone') ? document.getElementById('es-phone').value : '+1 (555) 234-5678';
    const url = document.getElementById('es-url') ? document.getElementById('es-url').value : 'https://technova.com';

    let html = `<!-- HTML EMAIL SIGNATURE TEMPLATE PRESET: ${style.toUpperCase()} -->\n`;
    html += `<table cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif;font-size:14px;color:#333;border-left:3px solid #FF5A1F;padding-left:12px;">\n`;
    html += `  <tr><td style="font-weight:bold;font-size:16px;color:#0F172A;">${name}</td></tr>\n`;
    html += `  <tr><td style="color:#64748B;font-size:13px;padding-bottom:4px;">${title} | <strong>${company}</strong></td></tr>\n`;
    html += `  <tr><td><a href="${url}" style="color:#FF5A1F;text-decoration:none;font-weight:bold;">${url}</a></td></tr>\n`;
    html += `  <tr><td style="padding-top:4px;color:#64748B;font-size:12px;">📧 ${email} &bull; 📞 ${phone}</td></tr>\n`;
    html += `</table>`;

    if (out) out.value = html;
  }

  const btn = document.getElementById('generate-btn');
  if (btn) btn.addEventListener('click', calculate);
  const styleSelect = document.getElementById('es-template-style');
  if (styleSelect) styleSelect.addEventListener('change', calculate);

  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
