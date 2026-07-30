/**
 * FreeToolsPDF — Interactive Image Quality & Compression Compare Slider Component
 * Provides visual side-by-side split comparison for image tools.
 */
class ImageCompareSlider {
  constructor(container, originalUrl, processedUrl) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.originalUrl = originalUrl;
    this.processedUrl = processedUrl;
    this.sliderPosition = 50;
    this.init();
  }

  init() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="img-compare-wrapper" style="position:relative;width:100%;max-width:800px;height:450px;margin:1.5rem auto;overflow:hidden;border-radius:14px;border:1px solid var(--border, #334155);box-shadow:0 12px 24px rgba(0,0,0,0.25);user-select:none;">
        <!-- Original (Underneath) -->
        <div class="img-compare-original" style="position:absolute;inset:0;width:100%;height:100%;">
          <img src="${this.originalUrl}" alt="Original" style="width:100%;height:100%;object-fit:contain;background:#0F172A;">
          <span style="position:absolute;top:1rem;left:1rem;padding:0.3rem 0.75rem;background:rgba(15,23,42,0.8);color:#FFF;font-size:0.75rem;font-weight:600;border-radius:6px;backdrop-filter:blur(4px);">Original</span>
        </div>

        <!-- Processed (Clipped overlay) -->
        <div class="img-compare-processed" style="position:absolute;inset:0;width:50%;height:100%;overflow:hidden;border-right:2px solid #FF5A1F;transition:none;">
          <img src="${this.processedUrl}" alt="Processed" style="width:100%;height:100%;object-fit:contain;background:#0F172A;">
          <span style="position:absolute;top:1rem;right:1rem;padding:0.3rem 0.75rem;background:rgba(255,90,31,0.85);color:#FFF;font-size:0.75rem;font-weight:600;border-radius:6px;backdrop-filter:blur(4px);">Optimized</span>
        </div>

        <!-- Split Handle Bar -->
        <div class="img-compare-handle" style="position:absolute;top:0;bottom:0;left:50%;width:4px;background:#FF5A1F;cursor:ew-resize;transform:translateX(-50%);z-index:10;display:flex;align-items:center;justify-content:center;">
          <div style="width:36px;height:36px;border-radius:50%;background:#FF5A1F;color:#FFF;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(255,90,31,0.4);font-weight:bold;font-size:0.85rem;">
            ↔
          </div>
        </div>
      </div>
    `;

    const wrapper = this.container.querySelector('.img-compare-wrapper');
    const processedClip = this.container.querySelector('.img-compare-processed');
    const handle = this.container.querySelector('.img-compare-handle');

    let isDragging = false;

    const moveSlider = (clientX) => {
      const rect = wrapper.getBoundingClientRect();
      let x = clientX - rect.left;
      if (x < 0) x = 0;
      if (x > rect.width) x = rect.width;
      const percentage = (x / rect.width) * 100;
      processedClip.style.width = `${percentage}%`;
      handle.style.left = `${percentage}%`;
    };

    handle.addEventListener('mousedown', () => isDragging = true);
    window.addEventListener('mouseup', () => isDragging = false);
    window.addEventListener('mousemove', (e) => {
      if (isDragging) moveSlider(e.clientX);
    });

    handle.addEventListener('touchstart', () => isDragging = true);
    window.addEventListener('touchend', () => isDragging = false);
    window.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches[0]) moveSlider(e.touches[0].clientX);
    });
  }
}

if (typeof window !== 'undefined') {
  window.ImageCompareSlider = ImageCompareSlider;
}
