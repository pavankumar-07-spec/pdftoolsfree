/**
 * Regex Tester & Pattern Evaluator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('rt-pattern')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:3fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Regular Expression Pattern:</label>
          <input type="text" id="rt-pattern" class="form-input" value="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}" placeholder="e.g. d+" style="width:100%;padding:0.5rem;font-family:monospace;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Flags:</label>
          <input type="text" id="rt-flags" class="form-input" value="gi" placeholder="g, i, m" style="width:100%;padding:0.5rem;font-family:monospace;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Test String:</label>
        <textarea id="rt-text" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">Contact us at support@pdftoolsfree.in or info@example.org for help.</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-rt-btn" class="btn btn-primary flex-1">🔍 Test Regex Pattern</button>
      </div>
    `;
  }

  function calculate() {
    const patternStr = document.getElementById('rt-pattern') ? document.getElementById('rt-pattern').value : '';
    const flagsStr = document.getElementById('rt-flags') ? document.getElementById('rt-flags').value : 'gi';
    const textStr = document.getElementById('rt-text') ? document.getElementById('rt-text').value : (document.getElementById('text-input') ? document.getElementById('text-input').value : '');

    if (!patternStr) {
      if (out) out.value = 'ERROR: Please enter a regex pattern to test.';
      return;
    }

    try {
      const regex = new RegExp(patternStr, flagsStr);
      const matches = [];
      let match;

      if (flagsStr.includes('g')) {
        while ((match = regex.exec(textStr)) !== null) {
          matches.push({ match: match[0], index: match.index, groups: match.slice(1) });
          if (regex.lastIndex === 0) break; // Prevent infinite loop on 0-width match
        }
      } else {
        match = regex.exec(textStr);
        if (match) {
          matches.push({ match: match[0], index: match.index, groups: match.slice(1) });
        }
      }

      let res = `--- REGEX TESTER REPORT ---nn`;
      res += `Pattern: /${patternStr}/${flagsStr}n`;
      res += `Total Matches: ${matches.length}nn`;

      if (matches.length === 0) {
        res += `❌ No pattern matches found in test string.n`;
      } else {
        res += `=== MATCHED LIST ===n`;
        matches.forEach((m, idx) => {
          res += `Match #${idx + 1}: "${m.match}" (Index: ${m.index})n`;
          if (m.groups.length > 0) {
            m.groups.forEach((g, gIdx) => {
              res += `  Group $${gIdx + 1}: "${g}"n`;
            });
          }
        });
      }

      if (out) out.value = res;
      if (window.showToast) window.showToast(`Found ${matches.length} regex matches!`, matches.length > 0 ? 'success' : 'info');
    } catch (err) {
      if (out) out.value = `❌ INVALID REGEX PATTERN ERROR:n${err.message}`;
    }
  }

  const activeBtn = document.getElementById('calc-rt-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
