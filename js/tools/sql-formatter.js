/**
 * SQL Query Formatter Engine (Alias)
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('sf-sql')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input SQL Query:</label>
        <textarea id="sf-sql" class="form-input" style="width:100%;height:120px;padding:0.5rem;font-family:monospace;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">select id, name, email from users where active = 1 order by id desc;</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-sf-btn" class="btn btn-primary flex-1">🗄️ Format SQL Query</button>
      </div>
    `;
  }

  const sqlKeywords = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'GROUP BY', 'HAVING', 'ORDER BY', 'LIMIT', 'AND', 'OR'];

  function formatSQL(sql) {
    let formatted = sql;
    sqlKeywords.forEach(kw => {
      const regex = new RegExp(`b${kw}b`, 'gi');
      formatted = formatted.replace(regex, `n${kw}`);
    });
    return formatted.trim();
  }

  function calculate() {
    const rawSQL = document.getElementById('sf-sql') ? document.getElementById('sf-sql').value : (document.getElementById('text-input') ? document.getElementById('text-input').value : '');

    if (!rawSQL.trim()) {
      if (out) out.value = 'ERROR: Please enter a SQL query.';
      return;
    }

    const formatted = formatSQL(rawSQL);

    if (out) out.value = formatted;
    if (window.showToast) window.showToast('SQL query formatted!', 'success');
  }

  const activeBtn = document.getElementById('calc-sf-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
