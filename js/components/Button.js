class Button {
  
  constructor(config = {}) {
    this.variant   = config.variant   || 'primary';
    this.text      = config.text      || 'Button';
    this.onClick   = config.onClick   || null;
    this.id        = config.id        || `btn-${Math.random().toString(36).slice(2, 7)}`;
    this.icon      = config.icon      || null;
    this.size      = config.size      || 'md';
    this.disabled  = config.disabled  || false;
    this.type      = config.type      || 'button';
    this.ariaLabel = config.ariaLabel || '';
    this.fullWidth = config.fullWidth || false;
    this._element  = null;

    
    this._variantIcons = {
      copy:     '📋',
      download: '⬇️',
      share:    '🔗',
      reset:    '🔄',
    };
  }

  
  render() {
    const btn = document.createElement('button');
    btn.type = this.type;
    btn.id = this.id;
    btn.className = this._buildClass();
    if (this.disabled) btn.disabled = true;
    if (this.ariaLabel) btn.setAttribute('aria-label', this.ariaLabel);
    if (this.fullWidth) btn.style.width = '100%';

    
    const icon = this.icon || this._variantIcons[this.variant] || null;
    if (icon) {
      const iconSpan = document.createElement('span');
      iconSpan.className = 'btn-icon-el';
      iconSpan.setAttribute('aria-hidden', 'true');
      iconSpan.innerHTML = icon;
      btn.appendChild(iconSpan);
    }

    const textSpan = document.createElement('span');
    textSpan.className = 'btn-text-el';
    textSpan.textContent = this.text;
    btn.appendChild(textSpan);

    
    const spinner = document.createElement('span');
    spinner.className = 'btn-spinner';
    spinner.setAttribute('aria-hidden', 'true');
    spinner.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" opacity="0.3"/>
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
    </svg>`;
    btn.appendChild(spinner);

    this._element = btn;
    this.bindClick();
    return btn;
  }

  
  _buildClass() {
    const variantClassMap = {
      primary:   'btn btn-primary',
      secondary: 'btn btn-secondary',
      outline:   'btn btn-outline',
      ghost:     'btn btn-ghost',
      accent:    'btn btn-accent',
      copy:      'btn btn-secondary btn-copy',
      download:  'btn btn-primary btn-download',
      share:     'btn btn-ghost btn-share',
      reset:     'btn btn-ghost btn-reset',
    };

    const sizeClassMap = {
      sm: 'btn-sm',
      md: '',
      lg: 'btn-lg',
    };

    const base = variantClassMap[this.variant] || 'btn btn-primary';
    const size = sizeClassMap[this.size] || '';
    return `${base} ${size}`.trim();
  }

  
  bindClick() {
    if (!this._element) return;

    this._element.addEventListener('click', (e) => {
      if (this._element.disabled) return;
      this._addRipple(e);
      if (this.onClick) this.onClick(e, this);
    });
  }

  
  _addRipple(e) {
    const btn = this._element;
    const ripple = document.createElement('span');
    ripple.className = 'btn-ripple';
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top  = `${e.clientY - rect.top - size / 2}px`;
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  }

  
  setText(text) {
    this.text = text;
    if (this._element) {
      const textEl = this._element.querySelector('.btn-text-el');
      if (textEl) textEl.textContent = text;
    }
  }

  
  setLoading(loadingText = 'Processing...') {
    if (!this._element) return;
    this._element.classList.add('btn-loading');
    this._element.disabled = true;
    const textEl = this._element.querySelector('.btn-text-el');
    if (textEl) {
      this._savedText = textEl.textContent;
      textEl.textContent = loadingText;
    }
  }

  
  setDone(successText = null) {
    if (!this._element) return;
    this._element.classList.remove('btn-loading');
    this._element.disabled = this.disabled;
    const textEl = this._element.querySelector('.btn-text-el');
    if (textEl) {
      textEl.textContent = successText || this._savedText || this.text;
    }
    if (successText) {
      this._element.classList.add('btn-success');
      setTimeout(() => {
        this._element && this._element.classList.remove('btn-success');
        if (textEl) textEl.textContent = this._savedText || this.text;
      }, 2000);
    }
  }

  
  setDisabled(disabled) {
    this.disabled = disabled;
    if (this._element) this._element.disabled = disabled;
  }

  
  static primary(text, onClick) {
    return new Button({ variant: 'primary', text, onClick });
  }

  
  static copy(onClick) {
    return new Button({ variant: 'copy', text: 'Copy', onClick });
  }

  
  static download(text = 'Download', onClick) {
    return new Button({ variant: 'download', text, onClick });
  }
}


(function injectButtonStyles() {
  if (document.getElementById('button-component-styles')) return;
  const style = document.createElement('style');
  style.id = 'button-component-styles';
  style.textContent = `
    
    .btn { overflow: hidden; position: relative; }
    .btn-ripple {
      position: absolute;
      border-radius: 50%;
      background: rgba(255,255,255,0.35);
      transform: scale(0);
      animation: rippleAnim 0.5s linear;
      pointer-events: none;
    }
    @keyframes rippleAnim {
      to { transform: scale(2.5); opacity: 0; }
    }

    
    .btn-loading .btn-spinner {
      display: inline-flex !important;
      animation: spin 0.7s linear infinite;
    }
    .btn-spinner {
      display: none;
      width: 16px;
      height: 16px;
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    .btn-loading .btn-icon-el { display: none; }

    
    .btn-success {
      background: var(--success) !important;
      box-shadow: 0 4px 14px rgba(63,143,95,0.35) !important;
    }

    
    .btn-copy:active { transform: scale(0.95); }
  `;
  document.head.appendChild(style);
})();