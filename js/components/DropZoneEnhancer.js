/**
 * DropZone Enhancer & Instant Thumbnail Previewer Component
 * Renders HTML5 Canvas thumbnail grid previews when files are selected/dropped.
 */
(function() {
  'use strict';

  function initDropZones() {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    
    fileInputs.forEach(input => {
      if (input._hasPreviewHandler) return;
      input._hasPreviewHandler = true;

      // Ensure preview grid container exists
      let previewGrid = input.parentNode.querySelector('.file-preview-grid');
      if (!previewGrid) {
        previewGrid = document.createElement('div');
        previewGrid.className = 'file-preview-grid';
        previewGrid.style.cssText = `
          display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 0.75rem; margin-top: 1rem; width: 100%;
        `;
        input.parentNode.appendChild(previewGrid);
      }

      input.addEventListener('change', (e) => {
        const files = Array.from(e.target.files || []);
        previewGrid.innerHTML = '';
        if (files.length === 0) return;

        files.forEach((file) => {
          const item = document.createElement('div');
          item.style.cssText = `
            background: var(--surface-2, #1e293b); border: 1px solid var(--border, #334155);
            border-radius: 8px; padding: 0.5rem; text-align: center; overflow: hidden;
          `;

          if (file.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.style.cssText = 'width: 100%; height: 75px; object-fit: cover; border-radius: 4px;';
            const reader = new FileReader();
            reader.onload = (re) => { img.src = re.target.result; };
            reader.readAsDataURL(file);
            item.appendChild(img);
          } else {
            const icon = document.createElement('div');
            icon.style.cssText = 'font-size: 2.2rem; margin: 0.25rem 0;';
            icon.textContent = file.name.endsWith('.pdf') ? '📄' : '📁';
            item.appendChild(icon);
          }

          const nameEl = document.createElement('div');
          nameEl.style.cssText = 'font-size: 0.7rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 4px;';
          nameEl.textContent = file.name;
          item.appendChild(nameEl);

          previewGrid.appendChild(item);
        });

        if (window.triggerHaptic) window.triggerHaptic(20);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDropZones);
  } else {
    initDropZones();
  }
})();
