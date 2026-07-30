// Simple debounce util
(function (global) {
  function debounce(fn, wait) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait || 200);
    };
  }

  global.debounce = debounce;
})(window);
