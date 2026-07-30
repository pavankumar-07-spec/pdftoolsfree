'use strict';

// Monkey-patch addEventListener to run DOMContentLoaded callbacks immediately
// if the document has already finished loading/parsing.
(function() {
  const originalAddEventListener = document.addEventListener;
  document.addEventListener = function(type, listener, options) {
    if (type === 'DOMContentLoaded' && (document.readyState === 'complete' || document.readyState === 'interactive')) {
      setTimeout(listener, 0);
    } else {
      originalAddEventListener.call(this, type, listener, options);
    }
  };
})();

function showToast(message, type = 'success', duration = 3500) {
  
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('aria-label', 'Notifications');
    container.setAttribute('aria-atomic', 'false');
    document.body.appendChild(container);
  }

  const icons = {
    success: '✅',
    error:   '❌',
    warning: '⚠️',
    info:    'ℹ️',
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');

  toast.innerHTML = `
    <span class="toast-icon" aria-hidden="true">${icons[type] || '💬'}</span>
    <span class="toast-msg">${message}</span>
    <button class="toast-close" type="button" aria-label="Dismiss notification">✕</button>
  `;

  container.appendChild(toast);

  
  const dismiss = () => {
    toast.classList.add('hiding');
    const remove = () => { if (toast.parentNode) toast.parentNode.removeChild(toast); };
    toast.addEventListener('transitionend', remove, { once: true });
    setTimeout(remove, 400); 
  };

  toast.querySelector('.toast-close').addEventListener('click', dismiss);

  
  if (duration > 0) {
    setTimeout(dismiss, duration);
  }

  return { dismiss }; 
}


const toast = {
  success: (msg, duration) => showToast(msg, 'success', duration),
  error:   (msg, duration) => showToast(msg, 'error',   duration),
  warning: (msg, duration) => showToast(msg, 'warning', duration),
  info:    (msg, duration) => showToast(msg, 'info',    duration),
};


window.showToast = showToast;
window.toast = toast;