/**
 * Real Client-Side PDF Page Size Converter (A4 / Letter / Legal) Engine (pdf-lib powered)
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('ppsc-target')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Target Page Size Standard:</label>
        <select id="ppsc-target" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
          <option value="a4">ISO A4 (595.28 x 841.89 pt / 210 x 297 mm)</option>
          <option value="letter">US Letter (612 x 792 pt / 8.5 x 11 inches)</option>
          <option value="legal">US Legal (612 x 1008 pt / 8.5 x 14 inches)</option>
        </select>
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Upload PDF File to Resize:</label>
        <input type="file" id="ppsc-file" accept="application/pdf" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-ppsc-btn" class="btn btn-primary flex-1">📐 Convert PDF Page Size</button>
      </div>
    `;
  }

  async function getPDFLib() {
    if (window.PDFLib) return window.PDFLib;
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = '/js/vendor/pdf-lib.min.js';
      s.onload = () => resolve(window.PDFLib);
      s.onerror = () => {
        const fallback = document.createElement('script');
        fallback.src = 'https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js';
        fallback.onload = () => resolve(window.PDFLib);
        fallback.onerror = () => reject(new Error('Failed to load pdf-lib.'));
        document.head.appendChild(fallback);
      };
      document.head.appendChild(s);
    });
  }


  async function calculate() {
    const fileEl = document.getElementById('ppsc-file');
    const target = document.getElementById('ppsc-target') ? document.getElementById('ppsc-target').value : 'a4';
    const file = fileEl && fileEl.files ? fileEl.files[0] : null;

    if (!file) {
      if (out) out.value = 'ERROR: Please select a PDF file.';
      return;
    }

    try {
      if (out) out.value = '⏳ Resizing PDF page MediaBox dimensions...';
      const { PDFDocument, PageSizes } = await getPDFLib();

      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      let dims = PageSizes.A4;
      if (target === 'letter') dims = PageSizes.Letter;
      if (target === 'legal') dims = [612, 1008];

      pages.forEach(page => page.setSize(dims[0], dims[1]));

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      let res = `--- PDF PAGE SIZE CONVERTER REPORT ---nn`;
      res += `Input File:       ${file.name}n`;
      res += `Target Standard:  ${target.toUpperCase()} (${dims[0]} x ${dims[1]} pt)n`;
      res += `Pages Resized:    ${pages.length} pagesn`;
      res += `Output File Size: ${(pdfBytes.byteLength / 1024).toFixed(1)} KBnn`;
      res += `Status: ✅ All PDF pages resized to standard ${target.toUpperCase()} dimensions.`;

      if (out) out.value = res;

      const a = document.createElement('a');
      a.href = url;
      a.download = `resized-${target}-${file.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      if (window.showToast) window.showToast(`Converted ${pages.length} pages to ${target.toUpperCase()}!`, 'success');
    } catch (err) {
      if (out) out.value = `ERROR: Failed to convert PDF page size: ${err.message}`;
    }
  }

  const activeBtn = document.getElementById('calc-ppsc-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
});