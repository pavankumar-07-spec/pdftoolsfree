document.addEventListener('DOMContentLoaded', () => {
  const inputEl = document.getElementById('text-input'), btn = document.getElementById('generate-btn'), out = document.getElementById('main-output');
  function run() {
    const val = inputEl ? inputEl.value : '';
    const res = val.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g) ? val.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g).map(x => x.toLowerCase()).join('_') : val;
    if (out) out.value = res;
  }
  if (btn) btn.addEventListener('click', run); run();
});
