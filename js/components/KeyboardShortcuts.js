/**
 * Global Keyboard Accelerators
 * Ctrl+Enter: Trigger Calculation
 * Ctrl+Shift+S: Trigger File Download
 */
(function() {
  'use strict';

  window.addEventListener('keydown', function(e) {
    // 1. Ctrl+Enter to trigger main action/calculation
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      const calcBtn = document.getElementById('generate-btn') || 
                      document.getElementById('calc-btn') || 
                      document.querySelector('button[type="submit"]');
      if (calcBtn) {
        e.preventDefault();
        calcBtn.click();
        if (window.triggerHaptic) window.triggerHaptic(20);
      }
    }

    // 2. Ctrl+Shift+S to trigger download
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 's') {
      const dlBtn = document.getElementById('download-btn');
      if (dlBtn) {
        e.preventDefault();
        dlBtn.click();
        if (window.triggerHaptic) window.triggerHaptic(30);
      }
    }
  });
})();
