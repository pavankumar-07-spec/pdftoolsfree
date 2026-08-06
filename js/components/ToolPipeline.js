/**
 * Tool Output Pipeline & Multi-Tool Chaining Component
 * Renders smart 1-click continuation actions under calculation/conversion results.
 */
(function() {
  'use strict';

  function initPipeline() {
    const mainOutput = document.getElementById('main-output') || document.getElementById('gen-results-card');
    if (!mainOutput) return;

    // Create pipeline bar container if missing
    let pipelineBar = document.getElementById('tool-pipeline-bar');
    if (!pipelineBar) {
      pipelineBar = document.createElement('div');
      pipelineBar.id = 'tool-pipeline-bar';
      pipelineBar.style.cssText = `
        display: none; margin-top: 1rem; padding: 0.85rem 1rem;
        background: var(--surface-2, #1e293b); border: 1px solid var(--border, #334155);
        border-radius: 10px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
        animation: fadeInUp 0.2s ease-out;
      `;
      mainOutput.parentNode.insertBefore(pipelineBar, mainOutput.nextSibling);
    }

    const currentSlug = window.location.pathname.split('/').pop().replace('.html', '');

    // Contextual pipeline recommendations map
    const pipelineMap = {
      pdf: [
        { name: '🗜️ Compress PDF', url: '/tools/compress-pdf.html' },
        { name: '💧 Watermark PDF', url: '/tools/pdf-watermark-adder.html' },
        { name: '🔐 Encrypt PDF', url: '/tools/encrypt-pdf.html' },
        { name: '🖼️ PDF to Image', url: '/tools/pdf-to-image.html' }
      ],
      image: [
        { name: '🗜️ Compress Image', url: '/tools/compress-image-to-target-size.html' },
        { name: '✂️ Circular Crop', url: '/tools/circular-image-crop.html' },
        { name: '📄 Image to PDF', url: '/tools/image-to-pdf.html' },
        { name: '🖼️ Image Mirror', url: '/tools/image-mirror.html' }
      ],
      default: [
        { name: '📋 Copy Output', action: 'copy' },
        { name: '🔤 Base64 Encode', url: '/tools/base64-encoder.html' },
        { name: '🔍 Text Diff', url: '/tools/text-diff-checker.html' },
        { name: '✨ Format JSON', url: '/tools/json-formatter.html' }
      ]
    };

    let catKey = 'default';
    if (currentSlug.includes('pdf')) catKey = 'pdf';
    else if (currentSlug.includes('image') || currentSlug.includes('crop') || currentSlug.includes('filter')) catKey = 'image';

    const links = pipelineMap[catKey].filter(item => !item.url || !item.url.includes(currentSlug));

    let html = `
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.5rem">
        <div style="font-size:0.75rem;font-weight:700;color:var(--text-secondary, #94a3b8);text-transform:uppercase;letter-spacing:0.5px">
          ⚡ Continue Pipeline:
        </div>
        <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap">
    `;

    links.forEach(link => {
      if (link.action === 'copy') {
        html += `<button class="btn btn-sm btn-accent pipeline-copy-btn" style="padding:0.3rem 0.75rem;font-size:0.8rem">📋 Copy Result</button>`;
      } else {
        html += `<a href="${link.url}" class="btn btn-sm btn-ghost" style="padding:0.3rem 0.75rem;font-size:0.8rem;background:rgba(255,255,255,0.05);border:1px solid var(--border,#334155)">${link.name}</a>`;
      }
    });

    html += `</div></div>`;
    pipelineBar.innerHTML = html;

    // Bind copy button
    const copyBtn = pipelineBar.querySelector('.pipeline-copy-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const txt = mainOutput.value || mainOutput.textContent || '';
        if (txt.trim()) {
          navigator.clipboard.writeText(txt);
          if (window.showToast) window.showToast('Result copied to clipboard!', 'success');
          if (window.triggerHaptic) window.triggerHaptic(20);
        }
      });
    }

    // Monitor output changes to display pipeline
    const observer = new MutationObserver(() => {
      const txt = (mainOutput.value || mainOutput.textContent || '').trim();
      if (txt.length > 5) {
        pipelineBar.style.display = 'block';
      }
    });

    observer.observe(mainOutput, { childList: true, characterData: true, subtree: true });
    if (mainOutput.value) {
      mainOutput.addEventListener('input', () => {
        if (mainOutput.value.trim().length > 5) pipelineBar.style.display = 'block';
      });
      if (mainOutput.value.trim().length > 5) pipelineBar.style.display = 'block';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPipeline);
  } else {
    initPipeline();
  }
})();
