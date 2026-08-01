/**
 * DropZoneEnhancer.js — Auto-upgrades all file inputs into glassmorphic Drag-and-Drop Dropzones
 * with live file size stats, image previews, and smooth drag animations.
 */
(function () {
  'use strict';

  function formatBytes(bytes) {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function initDropZones() {
    const fileInputs = document.querySelectorAll('input[type="file"]');

    fileInputs.forEach(input => {
      if (input.dataset.dropzoneEnhanced) return;
      input.dataset.dropzoneEnhanced = 'true';

      const parent = input.parentElement;
      if (!parent) return;

      // Hide original raw file input
      input.style.display = 'none';

      // Create Dropzone wrapper
      const zone = document.createElement('div');
      zone.className = 'glass-dropzone';
      zone.setAttribute('tabindex', '0');
      zone.setAttribute('role', 'button');
      zone.setAttribute('aria-label', 'Drag and drop files here or click to browse');

      const accept = input.getAttribute('accept') || 'All Files';
      const isMultiple = input.hasAttribute('multiple');

      zone.innerHTML = `
        <div class="dropzone-content">
          <div class="dropzone-icon">📁</div>
          <div class="dropzone-title">Drag & Drop ${isMultiple ? 'files' : 'file'} here or <span class="dropzone-browse">Browse</span></div>
          <div class="dropzone-subtitle">Supported formats: <strong>${accept.replace(/\./g, ' ').toUpperCase()}</strong> &bull; Max 100MB</div>
        </div>
        <div class="dropzone-preview-card" style="display:none"></div>
      `;

      parent.insertBefore(zone, input);

      const content = zone.querySelector('.dropzone-content');
      const previewCard = zone.querySelector('.dropzone-preview-card');

      // Click event to trigger file dialog
      zone.addEventListener('click', (e) => {
        if (!e.target.closest('.dropzone-reset-btn')) {
          input.click();
        }
      });

      // Keyboard Accessibility
      zone.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          input.click();
        }
      });

      // Drag & Drop event handlers
      ['dragenter', 'dragover'].forEach(eventName => {
        zone.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          zone.classList.add('drag-active');
        }, false);
      });

      ['dragleave', 'drop'].forEach(eventName => {
        zone.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          zone.classList.remove('drag-active');
        }, false);
      });

      zone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        if (dt && dt.files && dt.files.length > 0) {
          input.files = dt.files;
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });

      // Update preview card when file is selected
      input.addEventListener('change', () => {
        const files = input.files;
        if (!files || files.length === 0) {
          content.style.display = 'block';
          previewCard.style.display = 'none';
          previewCard.innerHTML = '';
          return;
        }

        const file = files[0];
        const fileSizeStr = formatBytes(file.size);

        let imagePreviewHtml = '';
        if (file.type.startsWith('image/')) {
          const imgUrl = URL.createObjectURL(file);
          imagePreviewHtml = `<img src="${imgUrl}" class="dropzone-img-thumb" alt="Preview">`;
        } else {
          imagePreviewHtml = `<div class="dropzone-file-badge">📄 ${file.name.split('.').pop().toUpperCase()}</div>`;
        }

        content.style.display = 'none';
        previewCard.style.display = 'flex';
        previewCard.innerHTML = `
          ${imagePreviewHtml}
          <div class="dropzone-file-info">
            <div class="dropzone-file-name" title="${file.name}">${file.name}</div>
            <div class="dropzone-file-meta">
              <span class="dropzone-file-size">⚡ ${fileSizeStr}</span>
              <span class="dropzone-file-status">Ready for processing</span>
            </div>
          </div>
          <button type="button" class="dropzone-reset-btn" title="Remove file">&times;</button>
        `;

        const resetBtn = previewCard.querySelector('.dropzone-reset-btn');
        if (resetBtn) {
          resetBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            input.value = '';
            input.dispatchEvent(new Event('change', { bubbles: true }));
          });
        }
      });
    });
  }

  // Inject CSS for DropZone and micro-animations
  function injectDropZoneStyles() {
    if (document.getElementById('dropzone-enhancer-styles')) return;

    const style = document.createElement('style');
    style.id = 'dropzone-enhancer-styles';
    style.textContent = `
      .glass-dropzone {
        border: 2px dashed var(--primary-light, rgba(255,90,31,0.3));
        background: var(--surface-2, rgba(255,255,255,0.05));
        border-radius: var(--radius-md, 12px);
        padding: 1.5rem 1rem;
        text-align: center;
        cursor: pointer;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        margin-bottom: 1rem;
        outline: none;
        user-select: none;
      }
      .glass-dropzone:hover, .glass-dropzone.drag-active {
        border-color: var(--primary, #FF5A1F);
        background: var(--primary-light, rgba(255,90,31,0.08));
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(255,90,31,0.15);
      }
      .dropzone-icon {
        font-size: 2.2rem;
        margin-bottom: 0.5rem;
        animation: dropzonePulse 2s infinite ease-in-out;
      }
      .dropzone-title {
        font-size: 1rem;
        font-weight: 700;
        color: var(--text, #1E293B);
        margin-bottom: 0.25rem;
      }
      .dropzone-browse {
        color: var(--primary, #FF5A1F);
        text-decoration: underline;
      }
      .dropzone-subtitle {
        font-size: 0.8rem;
        color: var(--text-secondary, #64748B);
      }
      .dropzone-preview-card {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.75rem 1rem;
        background: var(--surface-1, #ffffff);
        border-radius: var(--radius-sm, 8px);
        border: 1px solid var(--border, #e2e8f0);
        box-shadow: var(--shadow-sm, 0 2px 4px rgba(0,0,0,0.05));
        text-align: left;
      }
      .dropzone-img-thumb {
        width: 48px;
        height: 48px;
        object-fit: cover;
        border-radius: 6px;
        border: 1px solid var(--border);
      }
      .dropzone-file-badge {
        background: var(--primary-light, rgba(255,90,31,0.12));
        color: var(--primary, #FF5A1F);
        padding: 8px 12px;
        border-radius: 6px;
        font-weight: 700;
        font-size: 0.85rem;
      }
      .dropzone-file-info {
        flex: 1;
        overflow: hidden;
      }
      .dropzone-file-name {
        font-size: 0.9rem;
        font-weight: 700;
        color: var(--text);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .dropzone-file-meta {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 0.75rem;
        color: var(--text-secondary);
        margin-top: 2px;
      }
      .dropzone-file-size {
        font-weight: 600;
        color: var(--primary);
      }
      .dropzone-reset-btn {
        background: rgba(239,68,68,0.1);
        color: #ef4444;
        border: none;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        font-size: 1.2rem;
        line-height: 1;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s;
      }
      .dropzone-reset-btn:hover {
        background: #ef4444;
        color: #ffffff;
      }
      @keyframes dropzonePulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.08); }
      }
    `;
    document.head.appendChild(style);
  }

  document.addEventListener('DOMContentLoaded', () => {
    injectDropZoneStyles();
    initDropZones();
    // Observe dynamic insertions
    const observer = new MutationObserver(() => initDropZones());
    observer.observe(document.body, { childList: true, subtree: true });
  });
})();
