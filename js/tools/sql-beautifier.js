/**
 * SQL Query Beautifier & Formatter Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('sb-sql')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input Raw SQL Query:</label>
        <textarea id="sb-sql" class="form-input" style="width:100%;height:140px;padding:0.5rem;font-family:monospace;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">select u.id, u.name, count(o.id) as total_orders from users u left join orders o on u.id = o.user_id where u.status = 'active' group by u.id, u.name having count(o.id) > 5 order by total_orders desc limit 10;</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-sb-btn" class="btn btn-primary flex-1">🗄️ Beautify SQL Query</button>
      </div>
    `;
  }

  const sqlKeywords = [
    'SELECT', 'FROM', 'WHERE', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN', 'JOIN',
    'ON', 'GROUP BY', 'HAVING', 'ORDER BY', 'LIMIT', 'OFFSET', 'UNION', 'VALUES', 'INSERT INTO',
    'UPDATE', 'SET', 'DELETE', 'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE', 'AND', 'OR', 'ASC', 'DESC'
  ];

  function beautifySQL(sql) {
    let formatted = sql;

    // Convert SQL keywords to uppercase and insert line breaks before major clause keywords
    const majorClauses = [
      'SELECT', 'FROM', 'WHERE', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN', 'JOIN',
      'GROUP BY', 'HAVING', 'ORDER BY', 'LIMIT', 'OFFSET', 'UNION', 'SET', 'VALUES'
    ];

    majorClauses.forEach(kw => {
      const regex = new RegExp(`b${kw}b`, 'gi');
      formatted = formatted.replace(regex, `n${kw}`);
    });

    // Uppercase all SQL keywords
    sqlKeywords.forEach(kw => {
      const regex = new RegExp(`b${kw}b`, 'gi');
      formatted = formatted.replace(regex, kw);
    });

    // Format commas in SELECT clause
    formatted = formatted.replace(/,s*/g, ',n  ');

    return formatted.replace(/ns*n/g, 'n').trim();
  }

  function calculate() {
    const rawSQL = document.getElementById('sb-sql') ? document.getElementById('sb-sql').value : (document.getElementById('text-input') ? document.getElementById('text-input').value : '');

    if (!rawSQL.trim()) {
      if (out) out.value = 'ERROR: Please enter a SQL query to beautify.';
      return;
    }

    const beautified = beautifySQL(rawSQL);

    if (out) out.value = beautified;
    if (window.showToast) window.showToast('SQL query beautified!', 'success');
  }

  const activeBtn = document.getElementById('calc-sb-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
