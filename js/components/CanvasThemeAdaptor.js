/**
 * Dynamic Dark Mode Canvas Theme Adaptor Component
 * Automatically adapts HTML5 Canvas drawing stroke/fill colors when theme toggles.
 */
(function() {
  'use strict';

  function adaptCanvasTheme() {
    const theme = document.documentElement.getAttribute('data-theme') || 'light';
    const canvases = document.querySelectorAll('canvas');

    canvases.forEach(canvas => {
      canvas.setAttribute('data-canvas-theme', theme);
      // Trigger canvas redraw event if custom listener attached
      canvas.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    });
  }

  // Observe HTML data-theme attribute mutations
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(m => {
      if (m.attributeName === 'data-theme') {
        adaptCanvasTheme();
      }
    });
  });

  observer.observe(document.documentElement, { attributes: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', adaptCanvasTheme);
  } else {
    adaptCanvasTheme();
  }
})();
