document.addEventListener('DOMContentLoaded', () => {
  const inputEl = document.getElementById('text-input'), btn = document.getElementById('generate-btn'), out = document.getElementById('main-output');
  function run() {
    const val = inputEl ? inputEl.value : '{"example":"json","data":[1,2,3]}';
    try {
      if (out) out.value = JSON.stringify(JSON.parse(val), null, 2);
    } catch(e) {
      if (out) out.value = 'ERROR: Invalid JSON input - ' + e.message;
    }
  }
  if (btn) btn.addEventListener('click', run); run();
});
