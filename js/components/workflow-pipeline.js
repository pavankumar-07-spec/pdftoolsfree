/**
 * FreeToolsPDF — Multi-Tool Pipeline & Workflow Chaining Component
 * Renders quick transition action buttons when a tool generates an output file or text.
 */
class ToolPipelineChain {
  static getChainedTools(currentCategory, currentSlug) {
    const pipelines = {
      pdf: [
        { title: '🔒 Encrypt PDF', slug: 'pdf-encrypt', url: '/tools/pdf-encrypt.html' },
        { title: '🗜️ Compress PDF', slug: 'pdf-compress', url: '/tools/pdf-compress.html' },
        { title: '📄 Merge PDF', slug: 'pdf-merge', url: '/tools/pdf-merge.html' },
        { title: '✂️ Split PDF', slug: 'pdf-split', url: '/tools/pdf-split.html' }
      ],
      image: [
        { title: '🗜️ Compress Image', slug: 'image-compressor', url: '/tools/image-compressor.html' },
        { title: '🖼️ Convert to WebP', slug: 'jpg-to-webp', url: '/tools/jpg-to-webp.html' },
        { title: '✂️ Crop Image', slug: 'image-cropper', url: '/tools/image-cropper.html' }
      ],
      dev: [
        { title: '✨ Beautify JSON', slug: 'json-formatter', url: '/tools/json-formatter.html' },
        { title: '🔑 Base64 Encode', slug: 'base64-encode', url: '/tools/base64-encode.html' }
      ]
    };

    const suggestions = pipelines[currentCategory] || pipelines['pdf'];
    return suggestions.filter(s => s.slug !== currentSlug);
  }

  static renderChainWidget(container, category, currentSlug, outputData = null) {
    const target = typeof container === 'string' ? document.querySelector(container) : container;
    if (!target) return;

    const chainedTools = this.getChainedTools(category, currentSlug);
    if (chainedTools.length === 0) return;

    const widgetHTML = `
      <div class="pipeline-chain-widget" style="margin-top:1.5rem;padding:1.1rem 1.25rem;background:rgba(255,90,31,0.06);border:1px dashed rgba(255,90,31,0.3);border-radius:12px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem;">
          <div style="display:flex;align-items:center;gap:0.5rem;font-weight:600;font-size:0.9rem;color:var(--text, #F8FAFC);">
            <span style="font-size:1.1rem;">⚡</span> Multi-Tool Chain — What's next?
          </div>
          <span style="font-size:0.75rem;color:var(--text-muted, #94A3B8);">Pass result directly to next tool</span>
        </div>
        <div style="display:flex;gap:0.6rem;flex-wrap:wrap;">
          ${chainedTools.map(t => `
            <a href="${t.url}" class="chain-btn" style="padding:0.4rem 0.85rem;background:var(--surface-1, #0F172A);border:1px solid rgba(255,255,255,0.12);border-radius:8px;color:var(--text, #F8FAFC);font-size:0.82rem;font-weight:500;text-decoration:none;display:inline-flex;align-items:center;gap:0.4rem;transition:all 0.15s ease;">
              <span>${t.title}</span>
              <span style="color:#FF5A1F;font-weight:bold;">→</span>
            </a>
          `).join('')}
        </div>
      </div>
    `;

    target.insertAdjacentHTML('beforeend', widgetHTML);
  }
}

if (typeof window !== 'undefined') {
  window.ToolPipelineChain = ToolPipelineChain;
}
