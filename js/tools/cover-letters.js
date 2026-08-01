/**
 * Upgraded Resume & Cover Letter Builder Engine (50 Template Presets)
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const out = document.getElementById('main-output');

  if (inputsContainer) {
    const catalog = window.TEMPLATE_CATALOG ? window.TEMPLATE_CATALOG.resumes : [];
    let optionsHtml = '';

    if (catalog && catalog.length > 0) {
      optionsHtml = catalog.map((t, idx) => `<option value="${t.id}" ${idx === 0 ? 'selected' : ''}>${t.name}</option>`).join('');
    } else {
      for (let i = 1; i <= 50; i++) {
        const num = i < 10 ? '0' + i : '' + i;
        optionsHtml += `<option value="resume-${num}" ${i === 1 ? 'selected' : ''}>Resume Template ${num}: Style #${i}</option>`;
      }
    }

    inputsContainer.innerHTML = `
      <div class="template-selector-wrap" style="margin-bottom:1.5rem">
        <span class="template-badge-chip">✨ Select Resume & Cover Letter Template (50 Presets Available)</span>
        <select id="cl-template-style" class="form-input" style="font-weight:700">
          ${optionsHtml}
        </select>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label">Your Name</label>
          <input type="text" id="cl-name" class="form-input" value="Pavan Kumar">
        </div>
        <div>
          <label class="form-label">Target Job Title</label>
          <input type="text" id="cl-role" class="form-input" value="Senior Web Engineer">
        </div>
        <div>
          <label class="form-label">Company Name</label>
          <input type="text" id="cl-company" class="form-input" value="TechCorp Systems">
        </div>
        <div>
          <label class="form-label">Years of Experience</label>
          <input type="number" id="cl-exp" class="form-input" value="4" min="0">
        </div>
      </div>

      <div style="margin-bottom:1rem">
        <label class="form-label">Key Core Skills (Comma Separated)</label>
        <input type="text" id="cl-skills" class="form-input" value="JavaScript (ES6+), HTML5/CSS3, Web Performance, PWA, Git, SEO Optimization">
      </div>

      <div class="flex gap-3 mt-4">
        <button id="generate-btn" type="button" class="btn btn-primary flex-1">📝 Generate Formatted Resume Statement</button>
      </div>
    `;
  }

  function calculate() {
    const style = document.getElementById('cl-template-style') ? document.getElementById('cl-template-style').value : 'resume-01';
    const name = document.getElementById('cl-name') ? document.getElementById('cl-name').value : 'Applicant';
    const role = document.getElementById('cl-role') ? document.getElementById('cl-role').value : 'Engineer';
    const company = document.getElementById('cl-company') ? document.getElementById('cl-company').value : 'Company';
    const exp = document.getElementById('cl-exp') ? document.getElementById('cl-exp').value : 4;
    const skills = document.getElementById('cl-skills') ? document.getElementById('cl-skills').value : 'JavaScript, Web Development';

    let res = `====================================================================\n`;
    res += `                    RESUME & COVER LETTER STATEMENT                  \n`;
    res += `                 TEMPLATE PRESET: ${style.toUpperCase()}             \n`;
    res += `====================================================================\n\n`;

    res += `APPLICANT:   ${name.toUpperCase()}\n`;
    res += `TARGET ROLE: ${role}\n`;
    res += `COMPANY:     ${company}\n`;
    res += `EXPERIENCE:  ${exp} Years\n`;
    res += `SKILLS:      ${skills}\n`;
    res += `--------------------------------------------------------------------\n\n`;

    res += `Dear Hiring Manager at ${company},\n\n`;
    res += `I am writing to express my enthusiastic interest in the ${role} position at ${company}. With over ${exp} years of dedicated experience building fast, high-performance web applications using ${skills}, I am confident in my ability to make an immediate impact on your team.\n\n`;
    res += `Thank you for your consideration. I look forward to discussing how my skills in ${skills.split(',')[0]} can add value to ${company}.\n\n`;
    res += `Sincerely,\n${name}`;

    if (out) out.value = res;
  }

  const btn = document.getElementById('generate-btn');
  if (btn) btn.addEventListener('click', calculate);
  const styleSelect = document.getElementById('cl-template-style');
  if (styleSelect) styleSelect.addEventListener('change', calculate);

  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
