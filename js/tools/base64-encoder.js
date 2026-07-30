document.addEventListener('DOMContentLoaded', () => {
  const inputEl = document.getElementById('text-input'), btn = document.getElementById('generate-btn'), out = document.getElementById('main-output');
  function run() {
    const val = inputEl ? inputEl.value : '';
    try {
      if (out) out.value = btoa(unescape(encodeURIComponent(val)));
    } catch(e) {
      if (out) out.value = 'ERROR: Unable to encode Base64';
    }
  }
  if (btn) btn.addEventListener('click', run);
  run();
});
