/**
 * Real Client-Side Image to PDF Converter Engine (pdf-lib powered)
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('itp-files')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Upload Image Files (PNG / JPG / WebP):</label>
        <input type="file" id="itp-files" multiple accept="image/*" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-itp-btn" class="btn btn-primary flex-1">🖼️ Convert Images to PDF</button>
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
    const filesEl = document.getElementById('itp-files');
    const files = filesEl ? Array.from(filesEl.files) : [];

    if (files.length === 0) {
      if (out) out.value = 'ERROR: Please select image file(s) to convert.';
      return;
    }

    try {
      if (out) out.value = '⏳ Converting images into PDF document...';
      const { PDFDocument } = await getPDFLib();

      const pdfDoc = await PDFDocument.create();

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        let embeddedImage;
        if (file.type.includes('png')) {
          embeddedImage = await pdfDoc.embedPng(arrayBuffer);
        } else {
          embeddedImage = await pdfDoc.embedJpg(arrayBuffer);
        }

        const page = pdfDoc.addPage([embeddedImage.width, embeddedImage.height]);
        page.drawImage(embeddedImage, {
          x: 0,
          y: 0,
          width: embeddedImage.width,
          height: embeddedImage.height
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      let res = `--- IMAGE TO PDF CONVERTER REPORT ---nn`;
      res += `Input Images Count: ${files.length}n`;
      res += `Total PDF Pages:    ${pdfDoc.getPageCount()} pagesn`;
      res += `Generated PDF Size: ${(pdfBytes.byteLength / 1024).toFixed(1)} KBnn`;
      res += `Status: ✅ Real PDF created from uploaded images.`;

      if (out) out.value = res;

      const a = document.createElement('a');
      a.href = url;
      a.download = `images-converted-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      if (window.showToast) window.showToast(`Converted ${files.length} images into PDF!`, 'success');
    } catch (err) {
      if (out) out.value = `ERROR: Failed to convert images to PDF: ${err.message}`;
    }
  }

  const activeBtn = document.getElementById('calc-itp-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
});