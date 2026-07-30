/**
 * File Content Comparator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('fcomp-file1')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Upload File A:</label>
          <input type="file" id="fcomp-file1" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Upload File B:</label>
          <input type="file" id="fcomp-file2" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-fcomp-btn" class="btn btn-primary flex-1">🔍 Compare Files</button>
      </div>
    `;
  }

  async function calculate() {
    const f1 = document.getElementById('fcomp-file1') && document.getElementById('fcomp-file1').files ? document.getElementById('fcomp-file1').files[0] : null;
    const f2 = document.getElementById('fcomp-file2') && document.getElementById('fcomp-file2').files ? document.getElementById('fcomp-file2').files[0] : null;

    if (!f1 || !f2) {
      if (out) out.value = 'ERROR: Please select both File A and File B to compare.';
      return;
    }

    const buf1 = await f1.arrayBuffer();
    const buf2 = await f2.arrayBuffer();

    const hash1Buf = await crypto.subtle.digest('SHA-256', buf1);
    const hash2Buf = await crypto.subtle.digest('SHA-256', hash2Buf);

    const hash1 = Array.from(new Uint8Array(hash1Buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    const hash2 = Array.from(new Uint8Array(hash2Buf)).map(b => b.toString(16).padStart(2, '0')).join('');

    const match = hash1 === hash2;

    let res = `--- FILE COMPARATOR REPORT ---nn`;
    res += `File A: ${f1.name} (${f1.size} bytes)n`;
    res += `File B: ${f2.name} (${f2.size} bytes)nn`;
    res += `=== COMPARISON MATCH STATUS ===n`;
    res += match ? `✅ MATCH: File contents are 100% IDENTICAL.` : `❌ MISMATCH: File contents are DIFFERENT.`;

    if (out) out.value = res;
    if (window.showToast) window.showToast(match ? 'Files Match!' : 'Files Mismatch!', match ? 'success' : 'info');
  }

  const activeBtn = document.getElementById('calc-fcomp-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
