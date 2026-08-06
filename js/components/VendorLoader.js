/**
 * Dynamic Vendor Library Lazy-Loader Component
 * Dynamically loads heavy third-party libraries (PDFLib, PDF.js, KaTeX, Lucide) on demand.
 */
(function() {
  'use strict';

  const loadedLibs = {};

  const VENDOR_MAP = {
    'pdf-lib': '/js/vendor/pdf-lib.min.js',
    'pdfjs': '/js/vendor/pdf.min.js',
    'katex': '/js/vendor/katex.min.js',
    'lucide': '/js/vendor/lucide.min.js'
  };

  window.loadVendorLib = function(libName) {
    return new Promise((resolve, reject) => {
      if (loadedLibs[libName]) {
        resolve();
        return;
      }

      const scriptUrl = VENDOR_MAP[libName] || libName;
      const script = document.createElement('script');
      script.src = scriptUrl;
      script.async = true;

      script.onload = () => {
        loadedLibs[libName] = true;
        resolve();
      };

      script.onerror = (err) => {
        reject(new Error(`Failed to load vendor library: ${libName}`));
      };

      document.head.appendChild(script);
    });
  };

  // Auto-init Lucide icons asynchronously without blocking initial paint
  if (window.requestIdleCallback) {
    window.requestIdleCallback(() => {
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    });
  } else {
    setTimeout(() => {
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    }, 100);
  }
})();
