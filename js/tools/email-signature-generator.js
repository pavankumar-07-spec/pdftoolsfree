document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('es-name')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Full Name:</label>
          <input type="text" id="es-name" class="form-input" value="Alex Morgan" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Job Title:</label>
          <input type="text" id="es-title" class="form-input" value="Senior Product Designer" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Company / Org:</label>
          <input type="text" id="es-company" class="form-input" value="TechNova Solutions" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Email Address:</label>
          <input type="email" id="es-email" class="form-input" value="alex.morgan@technova.com" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Phone Number:</label>
          <input type="text" id="es-phone" class="form-input" value="+1 (555) 234-5678" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Website URL:</label>
          <input type="text" id="es-url" class="form-input" value="https://technova.com" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-es-btn" class="btn btn-primary flex-1">✉️ Generate HTML Email Signature</button>
      </div>
    `;
  }

  function calculate() {
    const name = document.getElementById('es-name') ? document.getElementById('es-name').value : 'Alex Morgan';
    const title = document.getElementById('es-title') ? document.getElementById('es-title').value : 'Senior Product Designer';
    const company = document.getElementById('es-company') ? document.getElementById('es-company').value : 'TechNova Solutions';
    const email = document.getElementById('es-email') ? document.getElementById('es-email').value : 'alex.morgan@technova.com';
    const phone = document.getElementById('es-phone') ? document.getElementById('es-phone').value : '+1 (555) 234-5678';
    const url = document.getElementById('es-url') ? document.getElementById('es-url').value : 'https://technova.com';

    let html = `<table cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif;font-size:14px;color:#333;">
`;
    html += `  <tr><td style="font-weight:bold;font-size:16px;color:#0F172A;">${name}</td></tr>
`;
    html += `  <tr><td style="color:#64748B;font-size:13px;">${title} | <strong>${company}</strong></td></tr>
`;
    html += `  <tr><td style="padding-top:4px;"><a href="${url}" style="color:#FF5A1F;text-decoration:none;font-weight:bold;">${url}</a></td></tr>
`;
    html += `  <tr><td style="padding-top:4px;color:#64748B;">📧 ${email} &bull; 📞 ${phone}</td></tr>
`;
    html += `</table>`;

    if (out) out.value = html;
    if (window.showToast) window.showToast('Email signature generated!', 'success');
  }

  const activeBtn = document.getElementById('calc-es-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
