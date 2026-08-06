/**
 * PWA Manager & Mobile Touch Haptics Component
 */
(function() {
  'use strict';

  // 1. Mobile Haptic Vibration Helper
  window.triggerHaptic = function(duration) {
    var ms = duration || 25;
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate(ms); } catch (e) {}
    }
  };

  // 2. Service Worker Registration
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/sw.js').then(function(reg) {
        console.log('PWA ServiceWorker registered with scope:', reg.scope);
      }).catch(function(err) {
        console.warn('PWA ServiceWorker registration failed:', err);
      });
    });
  }

  // 3. Online / Offline Connection Status Alerts
  window.addEventListener('online', function() {
    if (window.showToast) window.showToast('You are back online!', 'success');
  });

  window.addEventListener('offline', function() {
    if (window.showToast) window.showToast('You are offline. Offline tools remain ready!', 'info');
  });
})();
