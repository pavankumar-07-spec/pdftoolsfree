/**
 * FreeToolsPDF Cookie Consent Banner & Privacy Gate
 * Respects user consent for Google AdSense and Microsoft Clarity analytics.
 */
(function() {
  const CONSENT_KEY = 'ftp_cookie_consent';

  function getConsent() {
    return localStorage.getItem(CONSENT_KEY);
  }

  function setConsent(choice) {
    localStorage.setItem(CONSENT_KEY, choice);
    applyConsent(choice);
    hideBanner();
  }

  function loadClarity() {
    if (window.clarityLoaded) return;
    window.clarityLoaded = true;
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "x8xlyl54pl");
  }

  function applyConsent(choice) {
    if (choice === 'granted') {
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('consent', 'update', {
        'ad_storage': 'granted',
        'ad_user_data': 'granted',
        'ad_personalization': 'granted',
        'analytics_storage': 'granted'
      });
      // Dynamically load Microsoft Clarity tag ONLY after user grants consent
      loadClarity();
    } else {
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('consent', 'update', {
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied',
        'analytics_storage': 'denied'
      });
    }
  }

  function hideBanner() {
    const banner = document.getElementById('ftp-consent-banner');
    if (banner) {
      banner.style.opacity = '0';
      banner.style.transform = 'translateY(20px)';
      setTimeout(() => banner.remove(), 300);
    }
  }

  function showBanner() {
    if (document.getElementById('ftp-consent-banner')) return;

    const banner = document.createElement('div');
    banner.id = 'ftp-consent-banner';
    banner.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      right: 20px;
      max-width: 540px;
      margin: 0 auto;
      background: var(--surface-1, #ffffff);
      color: var(--text, #111827);
      border: 1px solid var(--border, #e5e7eb);
      border-radius: 12px;
      padding: 16px 20px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
      z-index: 999999;
      font-family: inherit;
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
      gap: 12px;
    `;

    banner.innerHTML = `
      <div style="display:flex;align-items:flex-start;gap:12px">
        <span style="font-size:1.5rem;line-height:1">🍪</span>
        <div>
          <h4 style="margin:0 0 4px 0;font-size:0.95rem;font-weight:700">We value your privacy</h4>
          <p style="margin:0;font-size:0.85rem;color:var(--text-muted, #4b5563);line-height:1.4">
            We use cookies to personalize ads (Google AdSense) and analyze traffic (Microsoft Clarity). Learn more in our <a href="/privacy.html" style="color:var(--primary, #FF5A1F);text-decoration:underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
      <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:4px">
        <button id="ftp-consent-reject" style="background:transparent;border:1px solid var(--border, #d1d5db);color:var(--text, #374151);padding:6px 14px;border-radius:6px;font-size:0.825rem;font-weight:600;cursor:pointer">
          Decline
        </button>
        <button id="ftp-consent-accept" style="background:var(--primary, #FF5A1F);border:none;color:#ffffff;padding:6px 16px;border-radius:6px;font-size:0.825rem;font-weight:600;cursor:pointer">
          Accept All
        </button>
      </div>
    `;

    document.body.appendChild(banner);

    document.getElementById('ftp-consent-accept')?.addEventListener('click', () => setConsent('granted'));
    document.getElementById('ftp-consent-reject')?.addEventListener('click', () => setConsent('denied'));
  }

  // Initialize consent state
  document.addEventListener('DOMContentLoaded', () => {
    const currentConsent = getConsent();
    if (!currentConsent) {
      // Set default Consent Mode to denied
      applyConsent('denied');
      showBanner();
    } else {
      applyConsent(currentConsent);
    }
  });
})();
