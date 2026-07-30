/**
 * FreeToolsPDF - Privacy Shield Component
 * Automatically injects a visual badge into tool hero containers indicating 100% Client-Side In-Browser Processing.
 */
(function() {
  function injectPrivacyShield() {
    // Only run on tool pages with a tool-hero section
    const toolHero = document.querySelector('.tool-hero, .hero-content, .tool-header');
    if (!toolHero || document.querySelector('.privacy-shield-badge')) return;

    const shieldHTML = `
      <div class="privacy-shield-badge" style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.4rem 0.85rem;background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.25);border-radius:30px;font-size:0.8rem;font-weight:600;color:#10B981;margin-top:0.75rem;backdrop-filter:blur(4px);box-shadow:0 2px 8px rgba(16,185,129,0.08);transition:transform 0.2s ease, box-shadow 0.2s ease;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="m9 12 2 2 4-4"/>
        </svg>
        <span>100% Private — Files & Data Never Leave Your Device</span>
      </div>
    `;

    // Try inserting after hero subtitle or title
    const subtitle = toolHero.querySelector('p, .hero-subtitle, .tool-description');
    if (subtitle) {
      subtitle.insertAdjacentHTML('afterend', shieldHTML);
    } else {
      toolHero.insertAdjacentHTML('beforeend', shieldHTML);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectPrivacyShield);
  } else {
    injectPrivacyShield();
  }
})();
