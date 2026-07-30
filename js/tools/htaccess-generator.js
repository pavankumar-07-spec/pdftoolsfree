/**
 * .htaccess Generator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('ht-https')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Force HTTPS:</label>
          <select id="ht-https" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
            <option value="yes" selected>Yes (Redirect HTTP → HTTPS)</option>
            <option value="no">No</option>
          </select>
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Force WWW / non-WWW:</label>
          <select id="ht-www" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
            <option value="non-www" selected>Force non-WWW (domain.com)</option>
            <option value="www">Force WWW (www.domain.com)</option>
            <option value="none">No Redirect</option>
          </select>
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-ht-btn" class="btn btn-primary flex-1">🔒 Generate .htaccess File</button>
      </div>
    `;
  }

  function calculate() {
    const https = document.getElementById('ht-https')?.value || 'yes';
    const www = document.getElementById('ht-www')?.value || 'non-www';

    let res = '# Apache .htaccess Rulesn';
    res += 'RewriteEngine Onnn';

    if (https === 'yes') {
      res += '# Force HTTPSn';
      res += 'RewriteCond %{HTTPS} offn';
      res += 'RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]nn';
    }

    if (www === 'non-www') {
      res += '# Remove WWWn';
      res += 'RewriteCond %{HTTP_HOST} ^www.(.*)$ [NC]n';
      res += 'RewriteRule ^(.*)$ https://%1/$1 [R=301,L]nn';
    } else if (www === 'www') {
      res += '# Force WWWn';
      res += 'RewriteCond %{HTTP_HOST} !^www. [NC]n';
      res += 'RewriteRule ^(.*)$ https://www.%{HTTP_HOST}/$1 [R=301,L]nn';
    }

    res += '# Security Headersn';
    res += 'Header set X-Content-Type-Options "nosniff"n';
    res += 'Header set X-Frame-Options "SAMEORIGIN"n';
    res += 'Header set X-XSS-Protection "1; mode=block"n';

    if (out) out.value = res;
    if (window.showToast) window.showToast('.htaccess rules generated!', 'success');
  }

  const activeBtn = document.getElementById('calc-ht-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
