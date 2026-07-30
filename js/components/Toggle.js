class DarkModeToggle {
  
  constructor(config = {}) {
    if (!config) config = {};
    this.id         = config.id         || 'dark-mode-toggle';
    this.onChange   = config.onChange   || null;
    this.showLabel  = config.showLabel  || false;
    this._element   = null;
    this._isDark    = false;

    
    this._initTheme();
  }

  
  _initTheme() {
    const stored = localStorage.getItem('suh-theme');

    if (stored === 'dark') {
      this._isDark = true;
    } else if (stored === 'light') {
      this._isDark = false;
    } else {
      
      this._isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    
    this._applyTheme(false);

    
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('suh-theme')) {
          this._isDark = e.matches;
          this._applyTheme(true);
          this._updateToggleUI();
        }
      });
    }
  }

  
  _applyTheme(withTransition = true) {
    if (withTransition) {
      document.body.classList.remove('no-transition');
    } else {
      document.body.classList.add('no-transition');
    }

    document.documentElement.setAttribute('data-theme', this._isDark ? 'dark' : 'light');
    document.documentElement.setAttribute('color-scheme', this._isDark ? 'dark' : 'light');
    document.documentElement.style.colorScheme = this._isDark ? 'dark' : 'light';

    
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', this._isDark ? '#0f1117' : '#ffffff');
    }

    if (!withTransition) {
      
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.body.classList.remove('no-transition');
          document.body.classList.add('theme-ready');
        });
      });
    }
  }

  
  savePreference() {
    localStorage.setItem('suh-theme', this._isDark ? 'dark' : 'light');
  }

  
  toggle() {
    this._isDark = !this._isDark;
    this._applyTheme(true);
    this.savePreference();
    this._updateToggleUI();

    if (this.onChange) this.onChange(this._isDark);

    
    const announce = document.getElementById('theme-announcement');
    if (announce) {
      announce.textContent = `Switched to ${this._isDark ? 'dark' : 'light'} mode`;
    }
  }

  
  setDark(isDark) {
    this._isDark = isDark;
    this._applyTheme(true);
    this.savePreference();
    this._updateToggleUI();
  }

  
  isDark() { return this._isDark; }

  
  _updateToggleUI() {
    if (!this._element) return;
    const thumb = this._element.querySelector('.dark-toggle-thumb');
    if (thumb) {
      thumb.textContent = this._isDark ? '🌙' : '☀️';
    }
    this._element.setAttribute('aria-pressed', this._isDark ? 'true' : 'false');
    this._element.setAttribute('aria-label', `Switch to ${this._isDark ? 'light' : 'dark'} mode`);

    if (this.showLabel) {
      const label = this._element.nextElementSibling;
      if (label && label.classList.contains('toggle-label')) {
        label.textContent = this._isDark ? 'Dark' : 'Light';
      }
    }
  }

  
  render() {
    const wrap = document.createElement('div');
    wrap.className = 'toggle-wrap';
    wrap.style.cssText = 'display:flex;align-items:center;gap:8px';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = this.id;
    btn.className = 'dark-toggle';
    btn.setAttribute('role', 'switch');
    btn.setAttribute('aria-pressed', this._isDark ? 'true' : 'false');
    btn.setAttribute('aria-label', `Switch to ${this._isDark ? 'light' : 'dark'} mode`);
    btn.title = 'Toggle dark mode';

    const thumb = document.createElement('span');
    thumb.className = 'dark-toggle-thumb';
    thumb.textContent = this._isDark ? '🌙' : '☀️';
    thumb.setAttribute('aria-hidden', 'true');
    btn.appendChild(thumb);

    btn.addEventListener('click', () => this.toggle());

    
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggle();
      }
    });

    this._element = btn;
    wrap.appendChild(btn);

    if (this.showLabel) {
      const label = document.createElement('span');
      label.className = 'toggle-label';
      label.style.cssText = 'font-size:0.8125rem;font-weight:500;color:var(--text-secondary)';
      label.textContent = this._isDark ? 'Dark' : 'Light';
      wrap.appendChild(label);
    }

    
    if (!document.getElementById('theme-announcement')) {
      const announce = document.createElement('div');
      announce.id = 'theme-announcement';
      announce.setAttribute('aria-live', 'polite');
      announce.setAttribute('aria-atomic', 'true');
      announce.className = 'visually-hidden';
      document.body.appendChild(announce);
    }

    return wrap;
  }

  
  static getInstance() {
    if (!DarkModeToggle._instance) {
      DarkModeToggle._instance = new DarkModeToggle();
    }
    return DarkModeToggle._instance;
  }
}


(function immediateThemeInit() {
  const stored = localStorage.getItem('suh-theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = stored === 'dark' || (!stored && prefersDark);
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
})();