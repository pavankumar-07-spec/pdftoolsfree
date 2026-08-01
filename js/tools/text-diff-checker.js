/**
 * Text Diff & Line Comparison Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('tdc-text1')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Original Text (Version A):</label>
          <textarea id="tdc-text1" class="form-input" style="width:100%;height:120px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">Line 1: Hello WorldnLine 2: FreeToolsPDFnLine 3: Client Side Tools</textarea>
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Modified Text (Version B):</label>
          <textarea id="tdc-text2" class="form-input" style="width:100%;height:120px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">Line 1: Hello WorldnLine 2: FreeToolsPDF PlatformnLine 4: Added New Feature</textarea>
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-tdc-btn" class="btn btn-primary flex-1">📊 Compare Text Differences</button>
      </div>
    `;
  }

  function calculate() {
    const text1 = document.getElementById('tdc-text1') ? document.getElementById('tdc-text1').value : '';
    const text2 = document.getElementById('tdc-text2') ? document.getElementById('tdc-text2').value : '';

    const lines1 = text1.split('n');
    const lines2 = text2.split('n');

    let diffOutput = `--- TEXT DIFF & COMPARISON REPORT ---nn`;
    let addedCount = 0;
    let removedCount = 0;
    let unchangedCount = 0;

    const maxLines = Math.max(lines1.length, lines2.length);

    for (let i = 0; i < maxLines; i++) {
      const l1 = lines1[i];
      const l2 = lines2[i];

      if (l1 === l2) {
        diffOutput += `  ${l1}n`;
        unchangedCount++;
      } else {
        if (l1 !== undefined) {
          diffOutput += `- ${l1}n`;
          removedCount++;
        }
        if (l2 !== undefined) {
          diffOutput += `+ ${l2}n`;
          addedCount++;
        }
      }
    }

    let summary = `SUMMARY: ${addedCount} Additions (+), ${removedCount} Deletions (-), ${unchangedCount} Unchanged Lines.nn`;
    diffOutput = summary + diffOutput;

    if (out) out.value = diffOutput;
    if (window.showToast) window.showToast(`Diff generated: +${addedCount} / -${removedCount}`, 'success');
  }

  const activeBtn = document.getElementById('calc-tdc-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
