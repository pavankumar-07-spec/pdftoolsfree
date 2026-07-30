class CookieBanner {
  constructor() {
    this.storageKey = 'suh-cookie-consent';
    this.bannerId = 'suh-cookie-banner';
  }

  init() {
    if (localStorage.getItem(this.storageKey) === 'accepted') {
      this.loadAdSense();
      return; 
    }
    
    this.render();
  }

  loadAdSense() {
    if (document.querySelector('script[src*="adsbygoogle.js"]')) return;
    const script = document.createElement('script');
    script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6309397984772642";
    script.async = true;
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);
  }

  render() {
    const banner = document.createElement('div');
    banner.id = this.bannerId;
    banner.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      background: var(--bg-overlay);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border-top: 1px solid var(--card-border);
      padding: var(--space-4) var(--space-6);
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-4);
      z-index: 9999;
      box-shadow: 0 -4px 20px rgba(0,0,0,0.1);
      transform: translateY(100%);
      transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    `;

    const text = document.createElement('div');
    text.style.cssText = `
      flex: 1;
      min-width: 250px;
      font-size: var(--text-sm);
      color: var(--text-secondary);
      line-height: 1.5;
    `;
    text.innerHTML = `
      We use cookies (including third-party cookies from Google) to serve personalized ads, analyze traffic, and improve your experience. 
      By continuing to use this site, you consent to our use of cookies. 
      <a href="/privacy.html" style="color:var(--primary);text-decoration:underline;">Learn more in our Privacy Policy</a>.
    `;

    const btnContainer = document.createElement('div');
    btnContainer.style.display = 'flex';
    btnContainer.style.gap = 'var(--space-3)';

    const acceptBtn = document.createElement('button');
    acceptBtn.className = 'btn btn-primary btn-sm';
    acceptBtn.textContent = 'Accept & Continue';
    acceptBtn.onclick = () => this.accept(banner);

    btnContainer.appendChild(acceptBtn);
    banner.appendChild(text);
    banner.appendChild(btnContainer);
    
    document.body.appendChild(banner);

    
    requestAnimationFrame(() => {
      banner.style.transform = 'translateY(0)';
    });
  }

  accept(banner) {
    localStorage.setItem(this.storageKey, 'accepted');
    this.loadAdSense();
    banner.style.transform = 'translateY(100%)';
    setTimeout(() => {
      if (banner.parentNode) banner.parentNode.removeChild(banner);
    }, 500);
  }
}


document.addEventListener('DOMContentLoaded', () => {
  new CookieBanner().init();
});