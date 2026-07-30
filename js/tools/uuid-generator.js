document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('generate-btn'), out = document.getElementById('main-output');
  function run() {
    const uuids = Array.from({length: 5}, () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    }));
    if (out) out.value = '--- GENERATED UUIDs (v4) ---n' + uuids.join('n');
  }
  if (btn) btn.addEventListener('click', run); run();
});
