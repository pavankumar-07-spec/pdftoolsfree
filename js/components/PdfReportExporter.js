/**
 * Styled PDF Report Exporter Component
 * Generates formatted PDF summary documents using PDFLib for calculations and tools.
 */
(function() {
  'use strict';

  function initPdfExporter() {
    const mainOutput = document.getElementById('main-output');
    const genCard = document.getElementById('gen-results-card');
    const dlBtn = document.getElementById('download-btn');

    if (!mainOutput || !dlBtn) return;

    // Create "Export PDF Report" button if missing
    let pdfBtn = document.getElementById('export-pdf-report-btn');
    if (!pdfBtn) {
      pdfBtn = document.createElement('button');
      pdfBtn.id = 'export-pdf-report-btn';
      pdfBtn.className = 'btn btn-sm btn-secondary';
      pdfBtn.style.cssText = `
        display: none; margin-left: 0.5rem; background: var(--surface-2, #1e293b);
        border: 1px solid var(--border, #334155); color: var(--text-primary, #f8fafc);
      `;
      pdfBtn.innerHTML = `📄 Export PDF Report`;
      dlBtn.parentNode.insertBefore(pdfBtn, dlBtn.nextSibling);
    }

    pdfBtn.addEventListener('click', async () => {
      const textContent = (mainOutput.value || mainOutput.textContent || '').trim();
      if (!textContent) {
        if (window.showToast) window.showToast('No output available to export.', 'warning');
        return;
      }

      if (typeof PDFLib !== 'undefined') {
        try {
          const pdfDoc = await PDFLib.PDFDocument.create();
          const page = pdfDoc.addPage([595.28, 841.89]); // A4 Size
          const { width, height } = page.getSize();

          // Draw Branded Header
          page.drawRectangle({
            x: 0, y: height - 60, width: width, height: 60,
            color: PDFLib.rgb(1, 0.35, 0.12)
          });

          page.drawText('FreeToolsPDF — Official Calculation Report', {
            x: 30, y: height - 38, size: 16,
            color: PDFLib.rgb(1, 1, 1)
          });

          // Draw Content Text
          const lines = textContent.split('\n');
          let yPos = height - 100;

          lines.forEach((line) => {
            if (yPos > 50) {
              const isHeader = line.startsWith('===') || line.startsWith('---');
              page.drawText(line.slice(0, 80), {
                x: 40, y: yPos, size: isHeader ? 12 : 10,
                color: isHeader ? PDFLib.rgb(0.1, 0.2, 0.4) : PDFLib.rgb(0.2, 0.2, 0.2)
              });
              yPos -= 18;
            }
          });

          // Draw Footer
          page.drawText('Generated with 100% Client-Side Privacy | https://pdftoolsfree.in', {
            x: 40, y: 30, size: 9, color: PDFLib.rgb(0.5, 0.5, 0.5)
          });

          const pdfBytes = await pdfDoc.save();
          const blob = new Blob([pdfBytes], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${document.title.split('-')[0].trim().toLowerCase().replace(/\s+/g, '-')}-report.pdf`;
          document.body.appendChild(a);
          a.click();
          setTimeout(() => { if (a.parentNode) a.parentNode.removeChild(a); URL.revokeObjectURL(url); }, 2000);

          if (window.showToast) window.showToast('PDF Report generated successfully!', 'success');
          if (window.triggerHaptic) window.triggerHaptic(25);
        } catch (err) {
          if (window.showToast) window.showToast('Error building PDF: ' + err.message, 'error');
        }
      } else {
        if (window.loadVendorLib) {
          window.loadVendorLib('pdf-lib').then(() => pdfBtn.click());
        }
      }
    });

    // Show PDF report button when output has text
    const checkOutput = () => {
      const txt = (mainOutput.value || mainOutput.textContent || '').trim();
      if (txt.length > 10) pdfBtn.style.display = 'inline-flex';
    };

    if (mainOutput.value) mainOutput.addEventListener('input', checkOutput);
    checkOutput();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPdfExporter);
  } else {
    initPdfExporter();
  }
})();
