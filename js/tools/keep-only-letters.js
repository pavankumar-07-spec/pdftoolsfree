/**
 * Keep Only Letters Engine - Exact Tool Output
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputEl = document.getElementById('str-input');
  const btn = document.getElementById('generate-btn');
  const copyBtn = document.getElementById('copy-btn');
  const out = document.getElementById('main-output');

  function transformText() {
    const raw = inputEl ? inputEl.value : '';
    let result = raw;

    if ('keep-only-letters'.includes('keep-only-letters')) {
      result = raw.replace(/[^a-zA-Zs]/g, '');
    } else if ('keep-only-letters'.includes('keep-only-numbers')) {
      result = raw.replace(/[^0-9s]/g, '');
    } else if ('keep-only-letters'.includes('remove-special-characters')) {
      result = raw.replace(/[^a-zA-Z0-9s]/g, '');
    } else if ('keep-only-letters'.includes('remove-punctuation')) {
      result = raw.replace(/[.,/#!$%^&*;:{}=-_'~()?"`]/g, '');
    } else if ('keep-only-letters'.includes('remove-emojis')) {
      result = raw.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
    }

    if (out) out.value = result;
    if (window.showToast) window.showToast('Keep Only Letters completed!', 'success');
  }

  if (inputEl) inputEl.addEventListener('input', transformText);
  if (btn) btn.addEventListener('click', transformText);
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(out ? out.value : '').then(() => {
        if (window.showToast) window.showToast('Copied output to clipboard!', 'success');
      });
    });
  }

  if (inputEl && inputEl.value) transformText();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});