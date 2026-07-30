const copyToClipboard = async (text) => {
  if (!text) return false;

  
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      console.warn('[Copy] Clipboard API failed, using fallback:', e.message);
    }
  }

  
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = [
      'position:fixed',
      'top:0',
      'left:0',
      'width:1px',
      'height:1px',
      'opacity:0',
      'overflow:hidden',
      'white-space:pre',
      'user-select:all',
      '-webkit-user-select:all',
    ].join(';');
    ta.setAttribute('readonly', '');
    ta.setAttribute('tabindex', '-1');
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    ta.setSelectionRange(0, ta.value.length);
    const success = document.execCommand('copy');
    document.body.removeChild(ta);
    return success;
  } catch (e) {
    console.error('[Copy] Fallback also failed:', e.message);
    return false;
  }
};


const copyWithToast = async (text, message = 'Copied to clipboard!', type = 'success') => {
  const success = await copyToClipboard(text);
  if (typeof showToast === 'function') {
    showToast(success ? message : 'Failed to copy. Please copy manually.', success ? type : 'error');
  }
  return success;
};


const copyHtmlToClipboard = async (html, plainText = '') => {
  if (!navigator.clipboard || !window.ClipboardItem) {
    return copyToClipboard(plainText || html.replace(/<[^>]*>/g, ''));
  }

  try {
    const htmlBlob  = new Blob([html], { type: 'text/html' });
    const textBlob  = new Blob([plainText || html.replace(/<[^>]*>/g, '')], { type: 'text/plain' });
    const item      = new ClipboardItem({ 'text/html': htmlBlob, 'text/plain': textBlob });
    await navigator.clipboard.write([item]);
    return true;
  } catch (e) {
    
    return copyToClipboard(plainText || html.replace(/<[^>]*>/g, ''));
  }
};


const addCopyButton = (el, label = 'Copy') => {
  const btn = document.createElement('button');
  btn.className = 'btn btn-secondary btn-sm btn-copy';
  btn.type = 'button';
  btn.innerHTML = `📋 <span>${label}</span>`;
  btn.addEventListener('click', async () => {
    const text = el.textContent || el.innerText || el.value || '';
    const ok = await copyToClipboard(text.trim());
    if (ok) {
      btn.innerHTML = '✓ <span>Copied!</span>';
      btn.classList.add('btn-success');
      setTimeout(() => {
        btn.innerHTML = `📋 <span>${label}</span>`;
        btn.classList.remove('btn-success');
      }, 2000);
    }
  });
  return btn;
};


if (typeof module !== 'undefined' && module.exports) {
  module.exports = { copyToClipboard, copyWithToast, copyHtmlToClipboard, addCopyButton };
}