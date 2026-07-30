document.addEventListener('DOMContentLoaded', () => {
  const inputEl = document.getElementById('text-input'), btn = document.getElementById('generate-btn'), out = document.getElementById('main-output');
  function run() {
    const val = inputEl ? inputEl.value : '';
    try {
      if (out) out.value = decodeURIComponent(escape(atob(val.trim())));
    } catch(e) {
      if (out) out.value = 'ERROR: Invalid Base64 String';
    }
  }
  if (btn) btn.addEventListener('click', run);
  run();
});
