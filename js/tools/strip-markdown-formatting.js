document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('sm-text')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Input Markdown Text:</label>
        <textarea id="sm-text" class="form-input" style="width:100%;height:100px;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)"># Heading 1\nThis is **bold** text and *italic* text with a [link](https://example.com) and code snippet.</textarea>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-sm-btn" class="btn btn-primary flex-1">📝 Strip Markdown Tags</button>
      </div>
    `;
  }

  function calculate() {
    const raw = (document.getElementById('sm-text')?.value || '').trim();

    if (!raw) { if (out) out.value = ''; return; }

    let plain = raw
      .replace(/#+\s+/g, '')
      .replace(/(\calc*\*|__)(.*?)\1/g, '$2')
      .replace(/(\*|_)(.*?)\1/g, '$2')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/^\s*[-+*]\s+/gm, '')
      .replace(/^\s*\d+\.\s+/gm, '')
      .replace(/^\s*>\s+/gm, '');

    if (out) out.value = plain;
    if (window.showToast) window.showToast('Markdown stripped to plain text!', 'success');
  }

  const activeBtn = document.getElementById('calc-sm-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
