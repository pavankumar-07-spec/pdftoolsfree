/**
 * FreeToolsPDF Cookie Consent Banner
 * Respects user privacy, supports Google Consent Mode v2 and Microsoft Clarity consent.
 */
class CookieBanner {
  constructor() {
    this.storageKey = 'suh-cookie-consent';
    this.bannerId = 'suh-cookie-banner';
  }

  init() {
    const consentState = localStorage.getItem(this.storageKey);
    if (consentState === 'accepted') {
      this.updateConsentState('granted');
      this.loadAdSense();
      return;
    } else if (consentState === 'declined') {
      this.updateConsentState('denied');
      return;
    }
    
    // Default consent state: denied until explicit accept
    this.updateConsentState('denied');
    this.render();
  }

  updateConsentState(status) {
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        'ad_storage': status,
        'ad_user_data': status,
        'ad_personalization': status,
        'analytics_storage': status
      });
    }
    if (status === 'granted' && typeof window.clarity === 'function') {
      window.clarity('consent');
    }
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
    if (document.getElementById(this.bannerId)) return;

    const banner = document.createElement('div');
    banner.id = this.bannerId;
    banner.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      background: var(--surface-1, #ffffff);
      color: var(--text, #111827);
      border-top: 1px solid var(--border, #e5e7eb);
      padding: var(--space-4, 16px) var(--space-6, 24px);
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-4, 16px);
      z-index: 99999;
      box-shadow: 0 -4px 20px rgba(0,0,0,0.1);
      transform: translateY(100%);
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    `;

    const text = document.createElement('div');
    text.style.cssText = `
      flex: 1;
      min-width: 260px;
      font-size: 0.875rem;
      color: var(--text-secondary, #4b5563);
      line-height: 1.5;
    `;
    text.innerHTML = `
      We use cookies (Google AdSense & Microsoft Clarity) to personalize ads, analyze site traffic, and improve user experience.
      Read our <a href="/privacy.html" style="color:var(--primary, #FF5A1F);text-decoration:underline;">Privacy Policy</a> for details.
    `;

    const btnContainer = document.createElement('div');
    btnContainer.style.display = 'flex';
    btnContainer.style.gap = '8px';
    btnContainer.style.alignItems = 'center';

    const declineBtn = document.createElement('button');
    declineBtn.className = 'btn btn-secondary btn-sm';
    declineBtn.style.cssText = `
      background: transparent;
      border: 1px solid var(--border, #d1d5db);
      color: var(--text, #374151);
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 0.825rem;
      font-weight: 600;
      cursor: pointer;
    `;
    declineBtn.textContent = 'Decline';
    declineBtn.onclick = () => this.decline(banner);

    const acceptBtn = document.createElement('button');
    acceptBtn.className = 'btn btn-primary btn-sm';
    acceptBtn.style.cssText = `
      background: var(--primary, #FF5A1F);
      border: none;
      color: #ffffff;
      padding: 6px 16px;
      border-radius: 6px;
      font-size: 0.825rem;
      font-weight: 600;
      cursor: pointer;
    `;
    acceptBtn.textContent = 'Accept All';
    acceptBtn.onclick = () => this.accept(banner);

    btnContainer.appendChild(declineBtn);
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
    this.updateConsentState('granted');
    this.loadAdSense();
    banner.style.transform = 'translateY(100%)';
    setTimeout(() => {
      if (banner.parentNode) banner.parentNode.removeChild(banner);
    }, 400);
  }

  decline(banner) {
    localStorage.setItem(this.storageKey, 'declined');
    this.updateConsentState('denied');
    banner.style.transform = 'translateY(100%)';
    setTimeout(() => {
      if (banner.parentNode) banner.parentNode.removeChild(banner);
    }, 400);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new CookieBanner().init();
});