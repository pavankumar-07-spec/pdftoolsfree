/**
 * Reorder PDF Pages Engine - Client-Side Real Engine
 */
function init_reorder_pdf_pages() {
  try {
    const btn = document.getElementById('generate-btn') || document.getElementById('calc-btn');
    const downloadBtn = document.getElementById('download-btn');
    const out = document.getElementById('main-output');
    const fileInput = document.getElementById('pdf-file') || document.getElementById('file-input');
    const pageOrderInput = document.getElementById('page-order');
    const statusBadge = document.getElementById('pdf-status-badge');
    const fileNameEl = document.getElementById('pdf-file-name');
    const pageCountEl = document.getElementById('pdf-page-count');

    let loadedFile = null, fileArrayBuffer = null, pdfDoc = null, totalLoadedPages = 0, reorderedPdfBytes = null;

    function getPDFLib() { return window.PDFLib || (typeof PDFLib !== 'undefined' ? PDFLib : null); }

    if (fileInput) {
      fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
          loadedFile = file;
          fileArrayBuffer = await file.arrayBuffer();
          const PDFLibObj = getPDFLib();
          if (PDFLibObj) {
            pdfDoc = await PDFLibObj.PDFDocument.load(fileArrayBuffer);
            totalLoadedPages = pdfDoc.getPageCount();
          } else totalLoadedPages = 5;
          if (statusBadge) statusBadge.style.display = 'block';
          if (fileNameEl) fileNameEl.textContent = file.name;
          if (pageCountEl) pageCountEl.textContent = totalLoadedPages;
          if (pageOrderInput) pageOrderInput.value = Array.from({ length: totalLoadedPages }, (_, i) => i + 1).join(', ');
          if (window.showToast) window.showToast(`Loaded "${file.name}" (${totalLoadedPages} pages)`, 'info');
          processReorder();
        } catch (err) {
          if (out) out.value = 'Error loading PDF: ' + err.message;
        }
      });
    }

    async function processReorder() {
      try {
        const orderStr = pageOrderInput ? pageOrderInput.value.trim() : '1';
        const rawIndices = orderStr.split(/[\s,]+/).map(s => parseInt(s, 10)).filter(num => !isNaN(num) && num > 0);
        const PDFLibObj = getPDFLib();

        if (fileArrayBuffer && PDFLibObj) {
          const srcDoc = await PDFLibObj.PDFDocument.load(fileArrayBuffer);
          const maxPages = srcDoc.getPageCount();
          const validZeroBasedIndices = []; const validOneBasedIndices = [];
          rawIndices.forEach(p => { if (p <= maxPages) { validZeroBasedIndices.push(p - 1); validOneBasedIndices.push(p); } });
          const newDoc = await PDFLibObj.PDFDocument.create();
          const copiedPages = await newDoc.copyPages(srcDoc, validZeroBasedIndices);
          copiedPages.forEach(p => newDoc.addPage(p));
          reorderedPdfBytes = await newDoc.save();

          if (window.UIDashboardEngine) {
            window.UIDashboardEngine.render({
              containerId: 'gen-results-card',
              title: '✨ Reorder PDF Pages Workspace',
              status: 'Reordered Successfully',
              archetype: 'pdf',
              kpis: [
                { label: 'ORIGINAL PAGES', value: maxPages, sub: 'Source Document' },
                { label: 'OUTPUT PAGES', value: validZeroBasedIndices.length, sub: 'Target Document' },
                { label: 'PAGE SEQUENCE', value: validOneBasedIndices.join(' ➔ ') }
              ],
              steps: ['Step 1: Loaded PDF document.', 'Step 2: Applied page order.', 'Step 3: Exported binary stream.']
            });
          }

          let report = "=== REORDER PDF PAGES REPORT ===\n";
          report += `File: ${loadedFile ? loadedFile.name : 'document.pdf'}\nPages: ${maxPages}\nSequence: ${validOneBasedIndices.join(', ')}\n`;
          report += "Status: ✅ Processed client-side locally.\n";
          if (out) out.value = report;
          if (window.showToast) window.showToast('Reordered PDF ready!', 'success');
        }
      } catch (err) {
        if (out) out.value = 'Error: ' + err.message;
      }
    }

    if (btn) btn.addEventListener('click', processReorder);
    processReorder();

    
    const copyBtn = document.getElementById('copy-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const txt = out ? (out.value || out.innerText || '') : '';
        if (txt) {
          navigator.clipboard.writeText(txt).then(() => {
            if (window.showToast) window.showToast('Copied output to clipboard! 📋', 'success');
          }).catch(() => {
            if (window.showToast) window.showToast('Failed to copy text', 'error');
          });
        } else {
          if (window.showToast) window.showToast('No output text to copy yet', 'warning');
        }
      });
    }

    const sampleBtn = document.getElementById('sample-btn');
    if (sampleBtn) {
      sampleBtn.addEventListener('click', () => {
        const numInputs = Array.from(document.querySelectorAll('input[type="number"]'));
        numInputs.forEach((inp, idx) => {
          inp.value = (idx + 1) * 15;
        });
        const textInputs = Array.from(document.querySelectorAll('textarea:not(#main-output), input[type="text"]'));
        textInputs.forEach(inp => {
          inp.value = 'Sample Data for testing domain calculations';
        });
        if (typeof calculate === 'function') calculate();
        else if (typeof processPdf === 'function') processPdf();
        else if (typeof processImage === 'function') processImage();
        if (window.showToast) window.showToast('Loaded sample test parameters! 💡', 'info');
      });
    }

    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        if (reorderedPdfBytes) {
          const blob = new Blob([reorderedPdfBytes], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a'); a.href = url;
          a.download = `${loadedFile ? loadedFile.name.replace(/\.pdf$/i, '') : 'reordered'}-reordered.pdf`;
          a.click(); setTimeout(() => URL.revokeObjectURL(url), 3000);
        }
      });
    }
  } catch (err) {
    console.error('[Engine Error] reorder-pdf-pages:', err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init_reorder_pdf_pages);
} else {
  init_reorder_pdf_pages();
}
