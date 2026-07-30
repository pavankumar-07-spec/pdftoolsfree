/**
 * Cover Letter Template Builder Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('cl-name')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Your Name:</label>
          <input type="text" id="cl-name" class="form-input" value="Pavan Kumar" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Target Job Title:</label>
          <input type="text" id="cl-role" class="form-input" value="Senior Frontend Engineer" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Company Name:</label>
          <input type="text" id="cl-company" class="form-input" value="TechCorp" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Years of Experience:</label>
          <input type="number" id="cl-exp" class="form-input" value="4" min="0" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-cl-btn" class="btn btn-primary flex-1">📝 Generate Cover Letter</button>
      </div>
    `;
  }

  function calculate() {
    const name = document.getElementById('cl-name') ? document.getElementById('cl-name').value : 'Applicant';
    const role = document.getElementById('cl-role') ? document.getElementById('cl-role').value : 'Engineer';
    const company = document.getElementById('cl-company') ? document.getElementById('cl-company').value : 'Company';
    const exp = document.getElementById('cl-exp') ? document.getElementById('cl-exp').value : 4;

    let res = `Dear Hiring Manager at ${company},nn`;
    res += `I am writing to express my enthusiastic interest in the ${role} position at ${company}. With over ${exp} years of dedicated experience building high-performance, client-side web applications and user interfaces, I am confident in my ability to contribute immediately to your team's goals.nn`;
    res += `Throughout my career, I have focused on delivering clean, accessible, and fast web experiences with modern architecture. My expertise aligns closely with the core requirements for the ${role} position.nn`;
    res += `Thank you for your time and consideration. I look forward to discussing how my background can benefit ${company}.nn`;
    res += `Sincerely,n${name}`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Cover letter generated!', 'success');
  }

  const activeBtn = document.getElementById('calc-cl-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
