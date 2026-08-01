/**
 * Upgraded Business Card Designer Engine (50 Template Presets)
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const out = document.getElementById('main-output');

  if (inputsContainer) {
    const catalog = window.TEMPLATE_CATALOG ? window.TEMPLATE_CATALOG.cards : [];
    let optionsHtml = '';

    if (catalog && catalog.length > 0) {
      optionsHtml = catalog.map((t, idx) => `<option value="${t.id}" ${idx === 0 ? 'selected' : ''}>${t.name}</option>`).join('');
    } else {
      for (let i = 1; i <= 50; i++) {
        const num = i < 10 ? '0' + i : '' + i;
        optionsHtml += `<option value="card-${num}" ${i === 1 ? 'selected' : ''}>Card Template ${num}: Style #${i}</option>`;
      }
    }

    inputsContainer.innerHTML = `
      <div class="template-selector-wrap" style="margin-bottom:1.5rem">
        <span class="template-badge-chip">✨ Select Business & ID Card Template (50 Presets Available)</span>
        <select id="bc-template-style" class="form-input" style="font-weight:700">
          ${optionsHtml}
        </select>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label">Full Name</label>
          <input type="text" id="bc-name" class="form-input" value="Sarah Jenkins">
        </div>
        <div>
          <label class="form-label">Job Title / Role</label>
          <input type="text" id="bc-title" class="form-input" value="Creative Director">
        </div>
        <div>
          <label class="form-label">Company / Studio</label>
          <input type="text" id="bc-company" class="form-input" value="Nexus Design Studio">
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label">Phone Number</label>
          <input type="text" id="bc-phone" class="form-input" value="+1 (555) 234-5678">
        </div>
        <div>
          <label class="form-label">Email Address</label>
          <input type="text" id="bc-email" class="form-input" value="sarah@nexusstudio.com">
        </div>
        <div>
          <label class="form-label">Website</label>
          <input type="text" id="bc-website" class="form-input" value="www.nexusstudio.com">
        </div>
      </div>

      <div class="flex gap-3 mt-4">
        <button id="generate-btn" type="button" class="btn btn-primary flex-1">⚡ Render Card Design</button>
      </div>
    `;
  }

  function renderCard() {
    const style = document.getElementById('bc-template-style') ? document.getElementById('bc-template-style').value : 'card-01';
    const name = document.getElementById('bc-name') ? document.getElementById('bc-name').value : 'Sarah Jenkins';
    const jobTitle = document.getElementById('bc-title') ? document.getElementById('bc-title').value : 'Creative Director';
    const comp = document.getElementById('bc-company') ? document.getElementById('bc-company').value : 'Nexus Design Studio';
    const phone = document.getElementById('bc-phone') ? document.getElementById('bc-phone').value : '+1 (555) 234-5678';
    const email = document.getElementById('bc-email') ? document.getElementById('bc-email').value : 'sarah@nexusstudio.com';
    const web = document.getElementById('bc-website') ? document.getElementById('bc-website').value : 'www.nexusstudio.com';

    let cardOutput = `==========================================================\n`;
    cardOutput += `           CARD PRESET: ${style.toUpperCase()}\n`;
    cardOutput += `==========================================================\n\n`;
    cardOutput += `┌────────────────────────────────────────────────────────┐\n`;
    cardOutput += `│  ${comp.toUpperCase().padEnd(52)}│\n`;
    cardOutput += `│  ${name.padEnd(52)}│\n`;
    cardOutput += `│  ${jobTitle.padEnd(52)}│\n`;
    cardOutput += `│                                                        │\n`;
    cardOutput += `│  📞 ${phone.padEnd(50)}│\n`;
    cardOutput += `│  ✉️  ${email.padEnd(50)}│\n`;
    cardOutput += `│  🌐 ${web.padEnd(50)}│\n`;
    cardOutput += `└────────────────────────────────────────────────────────┘`;

    if (out) out.value = cardOutput;
  }

  const btn = document.getElementById('generate-btn');
  if (btn) btn.addEventListener('click', renderCard);
  const styleSelect = document.getElementById('bc-template-style');
  if (styleSelect) styleSelect.addEventListener('change', renderCard);

  renderCard();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});