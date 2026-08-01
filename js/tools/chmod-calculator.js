/**
 * Chmod Permissions Calculator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('chmod-octal')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Octal Notation (e.g. 755, 644, 777):</label>
        <input type="text" id="chmod-octal" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)" value="755">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-chmod-btn" class="btn btn-primary flex-1">🔐 Compute Permissions</button>
      </div>
    `;
  }

  function octalToSymbolic(octStr) {
    const map = ['---', '--x', '-w-', '-wx', 'r--', 'r-x', 'rw-', 'rwx'];
    return octStr.split('').map(digit => map[parseInt(digit, 8)] || '---').join('');
  }

  function calculate() {
    let oct = (document.getElementById('chmod-octal')?.value || '755').trim();

    if (!/^[0-7]{3,4}$/.test(oct)) {
      if (out) out.value = 'ERROR: Please enter a 3 or 4-digit octal permission (e.g. 755 or 0755).';
      return;
    }

    const threeOct = oct.length === 4 ? oct.substring(1) : oct;
    const symbolic = octalToSymbolic(threeOct);

    const owner = parseInt(threeOct[0], 8);
    const group = parseInt(threeOct[1], 8);
    const publicUser = parseInt(threeOct[2], 8);

    let res = '--- CHMOD PERMISSIONS CALCULATOR ---nn';
    res += `Octal Notation: ${oct}n`;
    res += `Symbolic Notation: ${symbolic}nn`;
    res += `Breakdown:n`;
    res += `• Owner (u): ${threeOct[0]} -> ${(owner & 4 ? 'Read ' : '')}${(owner & 2 ? 'Write ' : '')}${(owner & 1 ? 'Execute' : '')}n`;
    res += `• Group (g): ${threeOct[1]} -> ${(group & 4 ? 'Read ' : '')}${(group & 2 ? 'Write ' : '')}${(group & 1 ? 'Execute' : '')}n`;
    res += `• Others (o): ${threeOct[2]} -> ${(publicUser & 4 ? 'Read ' : '')}${(publicUser & 2 ? 'Write ' : '')}${(publicUser & 1 ? 'Execute' : '')}nn`;
    res += `Command Examples:n`;
    res += `chmod ${oct} filename.txtn`;
    res += `chmod u=${octalToSymbolic(threeOct[0])},g=${octalToSymbolic(threeOct[1])},o=${octalToSymbolic(threeOct[2])} filename.txtn`;

    if (out) out.value = res;
    if (window.showToast) window.showToast('Chmod permissions computed!', 'success');
  }

  const activeBtn = document.getElementById('calc-chmod-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
