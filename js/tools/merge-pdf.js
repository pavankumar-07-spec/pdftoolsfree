/**
 * Real Client-Side Merge PDF Engine (pdf-lib powered)
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('mpdf-files')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Upload 2 or More PDF Files to Merge:</label>
        <input type="file" id="mpdf-files" multiple accept="application/pdf" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-mpdf-btn" class="btn btn-primary flex-1">📎 Merge PDF Files</button>
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
        fallback.onerror = () => reject(new Error('Failed to load pdf-lib library.'));
        document.head.appendChild(fallback);
      };
      document.head.appendChild(s);
    });
  }


  async function calculate() {
    const filesEl = document.getElementById('mpdf-files') || document.getElementById('pdf-file');
    const files = filesEl && filesEl.files ? Array.from(filesEl.files) : [];


    if (files.length < 2) {
      if (out) out.value = 'ERROR: Please select at least 2 PDF files to merge.';
      return;
    }

    try {
      if (out) out.value = '⏳ Merging PDF files in browser memory...';
      const { PDFDocument } = await getPDFLib();

      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      let res = `--- MERGE PDF SUCCESS REPORT ---nn`;
      res += `Merged Files Count: ${files.length}n`;
      res += `Total Merged Pages: ${mergedPdf.getPageCount()} pagesn`;
      res += `Merged File Size:   ${(mergedPdfBytes.byteLength / 1024).toFixed(1)} KBnn`;
      res += `Status: ✅ 100% Real PDF Merged locally in browser memory.n`;

      if (out) out.value = res;

      // Trigger automatic file download
      const a = document.createElement('a');
      a.href = url;
      a.download = `merged-document-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      if (window.showToast) window.showToast(`Merged ${files.length} PDFs into ${mergedPdf.getPageCount()} pages!`, 'success');
    } catch (err) {
      if (out) out.value = `ERROR: Failed to merge PDFs: ${err.message}`;
    }
  }

  const activeBtn = document.getElementById('calc-mpdf-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
});