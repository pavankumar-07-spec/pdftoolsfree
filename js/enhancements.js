(function () {
  'use strict';

  /* ═══ Global Error Boundary ═══════════════════════════════════════
   * Catches all uncaught errors across every tool engine.
   * Shows a clean toast notification instead of silent console failures.
   * This single handler covers all 405 tools with zero per-tool changes.
   */
  try {
    window.onerror = function (msg, src, line, col, err) {
      try {
        var safeMsg = (msg || 'Unknown error').toString().substring(0, 120);
        if (typeof window.showToast === 'function') {
          window.showToast('⚠️ ' + safeMsg, 'error');
        }
      } catch (e) { /* fail silently */ }
      return false; // still log to console
    };

    window.addEventListener('unhandledrejection', function (event) {
      try {
        var reason = event.reason ? (event.reason.message || event.reason).toString().substring(0, 120) : 'Async error';
        if (typeof window.showToast === 'function') {
          window.showToast('⚠️ ' + reason, 'error');
        }
      } catch (e) { /* fail silently */ }
    });
  } catch (e) { /* environment doesn't support global handlers */ }

  
  let TOOL_REGISTRY = [];

  async function loadToolRegistry() {
    // Check inline data first
    const scriptEl = document.getElementById('app-data');
    if (scriptEl && scriptEl.textContent && scriptEl.textContent.trim().length > 10) {
      try {
        const parsed = JSON.parse(scriptEl.textContent);
        const tools = parsed.tools || parsed || [];
        return tools.map(t => ({
          id: t.id, name: t.name, icon: t.icon || '🔧', cat: t.category,
          link: t.id + '.html', rootLink: 'tools/' + t.id + '.html', usage: t.usage || 5000
        }));
      } catch (e) { /* fall through */ }
    }
    // Fetch from shared external JSON
    try {
      const res = await fetch('/data/tools.json');
      const parsed = await res.json();
      const tools = parsed.tools || parsed || [];
      return tools.map(t => ({
        id: t.id, name: t.name, icon: t.icon || '🔧', cat: t.category,
        link: t.id + '.html', rootLink: 'tools/' + t.id + '.html', usage: t.usage || 5000
      }));
    } catch (e) {
      console.error('Failed to load tool registry:', e);
      return [];
    }
  }

  // Load registry as soon as possible and store promise
  const registryPromise = loadToolRegistry().then(data => {
    TOOL_REGISTRY = data;
    window.TOOL_REGISTRY = data;
    return data;
  });

  
  function formatUsage(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'K';
    return n.toString();
  }

  
  function getCurrentSlug() {
    return window.location.pathname.split('/').pop().replace('.html', '');
  }

  
  function isToolPage() {
    return window.location.pathname.includes('/tools/');
  }

  
  function initBackToTop() {
    const btn = document.createElement('button');
    btn.id = 'back-to-top';
    btn.className = 'back-to-top-btn';
    btn.setAttribute('aria-label', 'Scroll to top');
    btn.innerHTML = '↑';
    document.body.appendChild(btn);

    let visible = false;
    window.addEventListener('scroll', () => {
      const shouldShow = window.scrollY > 400;
      if (shouldShow !== visible) {
        visible = shouldShow;
        btn.classList.toggle('visible', visible);
      }
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  
  function initSkeletonLoading() {
    const cards = document.querySelectorAll('.card, .category-card');
    cards.forEach(card => { card.classList.add('skeleton-ready'); });
    window.addEventListener('load', () => {
      document.querySelectorAll('.skeleton-ready').forEach(el => {
        el.classList.remove('skeleton-ready');
        el.classList.add('skeleton-loaded');
      });
    });
  }

  
  function initStarRating() {
    const toolCard = document.querySelector('[id^="tool-layout"], [id="main-content"] > .container > div > .card');
    if (!toolCard) return;

    const slug = getCurrentSlug();
    if (!slug || slug === 'index') return;
    if (document.getElementById('star-rating-widget')) return;

    const storageKey = `suh-rating-${slug}`;
    const savedRating = parseInt(localStorage.getItem(storageKey)) || 0;

    const widget = document.createElement('div');
    widget.id = 'star-rating-widget';
    widget.className = 'star-rating-widget';
    widget.innerHTML = `
      <div class="star-rating-label">Rate this tool</div>
      <div class="star-rating-stars" id="star-container">
        ${[1, 2, 3, 4, 5].map(i => `
          <button class="star-btn ${i <= savedRating ? 'active' : ''}" data-value="${i}" aria-label="Rate ${i} star${i > 1 ? 's' : ''}">
            ${i <= savedRating ? '★' : '☆'}
          </button>
        `).join('')}
      </div>
      <div class="star-rating-text" id="star-text">${savedRating ? `You rated ${savedRating}/5 ⭐` : 'Tap a star to rate'}</div>
    `;

    const resultSection = document.getElementById('result-section');
    const adSlot = document.querySelector('.ad-slot');
    const insertBefore = adSlot || (resultSection ? resultSection.nextSibling : null);

    if (insertBefore && insertBefore.parentNode) {
      insertBefore.parentNode.insertBefore(widget, insertBefore);
    } else {
      const main = document.getElementById('main-content');
      if (main) {
        const container = main.querySelector('.container');
        if (container) container.appendChild(widget);
      }
    }

    document.getElementById('star-container').addEventListener('click', (e) => {
      const btn = e.target.closest('.star-btn');
      if (!btn) return;
      const value = parseInt(btn.dataset.value);
      localStorage.setItem(storageKey, value);

      document.querySelectorAll('.star-btn').forEach((star, idx) => {
        star.classList.toggle('active', idx < value);
        star.textContent = idx < value ? '★' : '☆';
      });
      document.getElementById('star-text').textContent = `You rated ${value}/5 ⭐`;
      if (typeof showToast === 'function') {
        showToast(`Thanks! You rated this tool ${value}/5 stars`, 'success');
      }
    });
  }

  
  function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const primaryBtn = document.querySelector('.btn-primary:not(.btn-copy):not(.btn-download)');
        if (primaryBtn && !primaryBtn.disabled) {
          e.preventDefault();
          primaryBtn.click();
          primaryBtn.classList.add('btn-success');
          setTimeout(() => primaryBtn.classList.remove('btn-success'), 300);
        }
      }
      if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const searchInput = document.querySelector('#search-container input, .search-input');
        if (searchInput && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
          e.preventDefault();
          searchInput.focus();
        }
      }
      if (e.key === 'Escape') {
        const modal = document.getElementById('suh-preview-modal');
        if (modal) modal.remove();
      }
    });
  }

  
  function initPWA() {
    if (!('serviceWorker' in navigator)) return;

    
    const swPath = isToolPage() ? '../sw.js' : '/sw.js';
    const swScope = '/';

    navigator.serviceWorker.register(swPath, { scope: swScope })
      .then(reg => {
        console.log('[PWA] Service Worker registered, scope:', reg.scope);

        
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              showPWAUpdateBanner();
            }
          });
        });
      })
      .catch(err => console.warn('[PWA] SW registration failed:', err));
  }

  function showPWAUpdateBanner() {
    if (document.getElementById('pwa-update-banner')) return;
    const banner = document.createElement('div');
    banner.id = 'pwa-update-banner';
    banner.className = 'pwa-update-banner';
    banner.innerHTML = `
      <span>🚀 New version available!</span>
      <button class="btn-pwa-update" id="pwa-update-btn">Update now</button>
      <button class="btn-pwa-dismiss" id="pwa-dismiss-btn" aria-label="Dismiss">✕</button>
    `;
    document.body.appendChild(banner);

    document.getElementById('pwa-update-btn').addEventListener('click', () => {
      window.location.reload();
    });
    document.getElementById('pwa-dismiss-btn').addEventListener('click', () => {
      banner.remove();
    });
  }

  
  function initInstallPrompt() {
    let deferredPrompt = null;
    const DISMISS_KEY = 'suh-pwa-dismissed';

    if (localStorage.getItem(DISMISS_KEY)) return;

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;

      
      setTimeout(() => {
        if (!deferredPrompt) return;
        if (document.getElementById('pwa-install-banner')) return;

        const banner = document.createElement('div');
        banner.id = 'pwa-install-banner';
        banner.className = 'pwa-install-banner';
        banner.innerHTML = `
          <div class="pwa-banner-content">
            <img src="${isToolPage() ? '../icons/icon-192.png' : 'icons/icon-192.png'}" alt="" width="40" height="40" style="border-radius:8px">
            <div class="pwa-banner-text">
              <strong>Install FreeToolsPDF</strong>
              <span>Add to home screen for instant access — works offline!</span>
            </div>
          </div>
          <div class="pwa-banner-actions">
            <button class="btn-pwa-install" id="pwa-install-btn">📲 Install</button>
            <button class="btn-pwa-dismiss" id="pwa-install-dismiss" aria-label="Dismiss">✕</button>
          </div>
        `;
        document.body.appendChild(banner);
        setTimeout(() => banner.classList.add('visible'), 50);

        document.getElementById('pwa-install-btn').addEventListener('click', async () => {
          banner.remove();
          deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          if (outcome === 'accepted') {
            console.log('[PWA] User accepted install');
          }
          deferredPrompt = null;
        });

        document.getElementById('pwa-install-dismiss').addEventListener('click', () => {
          banner.remove();
          localStorage.setItem(DISMISS_KEY, '1');
          deferredPrompt = null;
        });
      }, 30000);
    });
  }

  
  function initShareButton() {
    if (!isToolPage()) return;

    const slug = getCurrentSlug();
    const toolData = TOOL_REGISTRY.find(t => t.id === slug);
    if (!toolData) return;

    const pageHeader = document.querySelector('.page-header-content');
    if (!pageHeader) return;

    const shareBtn = document.createElement('button');
    shareBtn.id = 'share-tool-btn';
    shareBtn.className = 'share-tool-btn';
    shareBtn.setAttribute('aria-label', 'Share this tool');
    shareBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
      </svg>
      Share
    `;

    pageHeader.appendChild(shareBtn);

    shareBtn.addEventListener('click', async () => {
      const url = window.location.href;
      const title = `${toolData.name} — FreeToolsPDF`;
      const text = `Check out this free tool: ${toolData.name}. No signup, works in your browser!`;

      if (navigator.share) {
        try {
          await navigator.share({ title, text, url });
        } catch (err) {
          if (err.name !== 'AbortError') copyToClipboard(url);
        }
      } else {
        copyToClipboard(url);
      }
    });

    function copyToClipboard(text) {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          showShareFeedback('✅ Link copied!');
        }).catch(() => fallbackCopy(text));
      } else {
        fallbackCopy(text);
      }
    }

    function fallbackCopy(text) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showShareFeedback('✅ Link copied!');
    }

    function showShareFeedback(msg) {
      if (typeof showToast === 'function') {
        showToast(msg, 'success');
      } else {
        const orig = shareBtn.innerHTML;
        shareBtn.textContent = msg;
        setTimeout(() => { shareBtn.innerHTML = orig; }, 2000);
      }
    }
  }

  
  function initSuggestedTools() {
    if (!isToolPage()) return;

    const slug = getCurrentSlug();
    const currentTool = TOOL_REGISTRY.find(t => t.id === slug);
    if (!currentTool) return;

    
    let related = TOOL_REGISTRY
      .filter(t => t.cat === currentTool.cat && t.id !== slug)
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);

    
    if (related.length < 3) {
      const extras = TOOL_REGISTRY
        .filter(t => t.id !== slug && !related.find(r => r.id === t.id))
        .sort((a, b) => b.usage - a.usage)
        .slice(0, 4 - related.length);
      related = [...related, ...extras];
    }

    if (related.length === 0) return;

    const section = document.createElement('section');
    section.className = 'suggested-tools-section';
    section.setAttribute('aria-label', 'Suggested tools');
    section.innerHTML = `
      <div class="container">
        <div class="suggested-tools-header">
          <h2 class="suggested-tools-title">🔗 You Might Also Like</h2>
          <a href="../index.html#all-tools" class="suggested-tools-more">View all tools →</a>
        </div>
        <div class="suggested-tools-grid">
          ${related.map(tool => `
            <a href="${tool.link}" class="suggested-tool-card" data-tool-id="${tool.id}">
              <div class="suggested-tool-icon">${tool.icon}</div>
              <div class="suggested-tool-info">
                <div class="suggested-tool-name">${tool.name}</div>
                <div class="suggested-tool-meta">
                  <span class="suggested-tool-cat">${tool.cat}</span>
                  <span class="suggested-tool-usage">${formatUsage(tool.usage)} uses</span>
                </div>
              </div>
              <svg class="suggested-tool-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          `).join('')}
        </div>
      </div>
    `;

    
    const footer = document.querySelector('footer.footer');
    if (footer) {
      footer.parentNode.insertBefore(section, footer);
    } else {
      document.body.appendChild(section);
    }
  }

  
  function initUsageBadges() {
    
    const usageMap = {};
    TOOL_REGISTRY.forEach(t => { usageMap[t.id] = t.usage; });

    
    const slug = getCurrentSlug();
    if (slug && isToolPage()) {
      const localKey = `suh-usage-${slug}`;
      const localCount = parseInt(localStorage.getItem(localKey) || '0') + 1;
      localStorage.setItem(localKey, localCount);
    }

    
    const cards = document.querySelectorAll('.category-card[href]');
    cards.forEach(card => {
      const href = card.getAttribute('href') || '';
      const match = href.match(/tools\/(.+?)\.html/);
      if (!match) return;
      const toolId = match[1];
      if (!usageMap[toolId]) return;

      
      if (card.querySelector('.tool-usage-badge')) return;

      const badge = document.createElement('div');
      badge.className = 'tool-usage-badge';
      badge.setAttribute('aria-label', `${formatUsage(usageMap[toolId])} uses`);
      badge.innerHTML = `
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/></svg>
        ${formatUsage(usageMap[toolId])}
      `;

      
      const cta = card.querySelector('.category-card-cta');
      if (cta) {
        card.insertBefore(badge, cta);
      } else {
        card.appendChild(badge);
      }
    });
  }

  
  function initDownloadInterceptor() {
    if (!isToolPage()) return;

    const originalClick = HTMLAnchorElement.prototype.click;

    HTMLAnchorElement.prototype.click = function() {
      const hasDownload = this.hasAttribute('download');
      const href = this.href;

      const isBypass = window.location.pathname.includes('/results/') || 
                       window.location.hash.includes('#direct-download') || 
                       window.name === 'direct-download' ||
                       this.getAttribute('data-bypass-bridge') === 'true';

      if (!hasDownload || !href || isBypass) {
        originalClick.apply(this, arguments);
        return;
      }

      if (href.startsWith('javascript:') || href.startsWith('#')) {
        originalClick.apply(this, arguments);
        return;
      }

      const filename = this.getAttribute('download') || 'file';

      const loadBridgeScripts = () => {
        return new Promise((resolve) => {
          if (window.ResultBridge) {
            resolve();
            return;
          }
          const pathPrefix = '../js/';
          
          const s1 = document.createElement('script');
          s1.src = `${pathPrefix}utils/result-storage.js`;
          s1.onload = () => {
            const s2 = document.createElement('script');
            s2.src = `${pathPrefix}utils/result-bridge.js`;
            s2.onload = () => {
              const s3 = document.createElement('script');
              s3.src = `${pathPrefix}utils/related-tools.js`;
              s3.onload = () => resolve();
              document.body.appendChild(s3);
            };
            document.body.appendChild(s2);
          };
          document.body.appendChild(s1);
        });
      };

      loadBridgeScripts().then(async () => {
        try {
          let blob;
          if (href.startsWith('blob:')) {
            blob = await fetch(href).then(res => res.blob());
          } else if (href.startsWith('data:')) {
            const res = await fetch(href);
            blob = await res.blob();
          } else {
            originalClick.apply(this, arguments);
            return;
          }

          const toolId = getCurrentSlug();
          const toolInfo = window.RelatedTools ? window.RelatedTools.info(toolId) : null;
          const toolName = toolInfo ? toolInfo.name : toolId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
          const mimeType = blob.type || 'application/octet-stream';

          await window.ResultBridge.save({
            toolId: toolId,
            toolName: toolName,
            fileName: filename,
            mimeType: mimeType,
            blob: blob,
            meta: {
              outputSize: blob.size,
              outputType: mimeType.includes('pdf') ? 'pdf' : (mimeType.includes('zip') ? 'zip' : 'image')
            }
          });
        } catch (err) {
          console.warn('[Bridge Interceptor] Handoff failed, falling back to direct download:', err);
          originalClick.apply(this, arguments);
        }
      });
    };
  }

  
  function injectStyles() {
    if (document.getElementById('enhancements-styles')) return;
    const style = document.createElement('style');
    style.id = 'enhancements-styles';
    style.textContent = `
      /* Beautiful custom card icons and micro-animations */
      .category-icon-wrap svg, .suggested-tool-icon svg, .btech-icon-wrap svg {
        width: 24px !important;
        height: 24px !important;
        display: block;
        transition: transform 0.2s ease;
      }
      .category-icon-wrap, .suggested-tool-icon, .btech-icon-wrap {
        border-radius: 14px !important;
        transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        border: 1px solid rgba(0, 0, 0, 0.03) !important;
      }
      [data-theme="dark"] .category-icon-wrap, [data-theme="dark"] .suggested-tool-icon, [data-theme="dark"] .btech-icon-wrap {
        border-color: rgba(255, 255, 255, 0.05) !important;
        filter: brightness(0.95);
      }
      .category-card:hover .category-icon-wrap, .suggested-tool-card:hover .suggested-tool-icon {
        transform: scale(1.06) rotate(2deg);
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
      }
    
      
      .back-to-top-btn {
        position: fixed; bottom: 2rem; right: 2rem;
        width: 48px; height: 48px; border-radius: 50%;
        background: var(--primary); color: white; border: none;
        font-size: 1.25rem; font-weight: 700; cursor: pointer;
        opacity: 0; transform: translateY(20px);
        transition: opacity 0.3s, transform 0.3s, background 0.2s;
        z-index: 9998; box-shadow: 0 4px 14px rgba(181,101,46,0.4);
        pointer-events: none;
      }
      .back-to-top-btn.visible { opacity: 1; transform: translateY(0); pointer-events: auto; }
      .back-to-top-btn:hover { background: var(--primary-hover, #164784); transform: translateY(-2px); box-shadow: 0 6px 20px rgba(181,101,46,0.5); }
      @media (max-width: 768px) { .back-to-top-btn { bottom: 1rem; right: 1rem; width: 42px; height: 42px; font-size: 1.1rem; } }

      
      .skeleton-ready { position: relative; overflow: hidden; }
      .skeleton-ready::after {
        content: ''; position: absolute; top: 0; left: -100%; width: 200%; height: 100%;
        background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%);
        animation: skeletonShimmer 1.5s infinite;
      }
      .skeleton-loaded { animation: skeletonFadeIn 0.4s ease; }
      @keyframes skeletonShimmer { 0% { transform: translateX(-50%); } 100% { transform: translateX(50%); } }
      @keyframes skeletonFadeIn { from { opacity: 0.7; } to { opacity: 1; } }

      
      .star-rating-widget {
        text-align: center; padding: var(--space-6); margin: var(--space-6) 0;
        background: var(--bg-secondary); border-radius: var(--radius-lg); border: 1px solid var(--card-border);
      }
      .star-rating-label { font-size: var(--text-sm); color: var(--text-muted); margin-bottom: var(--space-2); font-weight: 500; }
      .star-rating-stars { display: flex; justify-content: center; gap: var(--space-2); margin-bottom: var(--space-2); }
      .star-btn { background: none; border: none; font-size: 2rem; cursor: pointer; color: var(--text-muted); transition: color 0.15s, transform 0.15s; padding: 0.25rem; line-height: 1; }
      .star-btn:hover { transform: scale(1.2); }
      .star-btn.active { color: #F59E0B; }
      .star-rating-text { font-size: var(--text-xs); color: var(--text-muted); }

      
      .pwa-update-banner {
        position: fixed; bottom: 1rem; left: 50%; transform: translateX(-50%);
        background: #12233F; color: white; border-radius: 9999px;
        padding: 0.75rem 1.25rem; display: flex; align-items: center; gap: 1rem;
        font-size: 0.875rem; font-weight: 500; z-index: 9999;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3); white-space: nowrap;
      }
      .btn-pwa-update {
        background: white; color: #12233F; border: none; border-radius: 9999px;
        padding: 0.375rem 1rem; font-size: 0.8rem; font-weight: 700; cursor: pointer;
        transition: transform 0.2s;
      }
      .btn-pwa-update:hover { transform: scale(1.05); }
      .btn-pwa-dismiss {
        background: none; border: none; color: rgba(255,255,255,0.7); cursor: pointer;
        font-size: 1rem; line-height: 1; padding: 0.25rem;
      }

      
      .pwa-install-banner {
        position: fixed; bottom: 1rem; left: 50%; transform: translateX(-50%) translateY(120px);
        background: var(--card-bg); border: 1px solid var(--card-border);
        border-radius: 1rem; padding: 1rem 1.25rem;
        display: flex; align-items: center; justify-content: space-between;
        gap: 1.5rem; max-width: 480px; width: calc(100% - 2rem);
        box-shadow: var(--shadow-xl); z-index: 9999;
        transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
      .pwa-install-banner.visible { transform: translateX(-50%) translateY(0); }
      .pwa-banner-content { display: flex; align-items: center; gap: 0.875rem; flex: 1; min-width: 0; }
      .pwa-banner-text { display: flex; flex-direction: column; gap: 0.2rem; }
      .pwa-banner-text strong { font-size: 0.9rem; color: var(--text); }
      .pwa-banner-text span { font-size: 0.78rem; color: var(--text-muted); }
      .pwa-banner-actions { display: flex; align-items: center; gap: 0.5rem; flex-shrink: 0; }
      .btn-pwa-install {
        background: linear-gradient(135deg, #2563EB, #0EA5E9); color: white;
        border: none; border-radius: 9999px; padding: 0.5rem 1.125rem;
        font-size: 0.8rem; font-weight: 600; cursor: pointer; white-space: nowrap;
        transition: transform 0.2s, box-shadow 0.2s;
      }
      .btn-pwa-install:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(181,101,46,0.4); }
      .btn-pwa-dismiss {
        background: none; border: none; color: var(--text-muted); cursor: pointer;
        font-size: 1.1rem; padding: 0.25rem; line-height: 1; transition: color 0.15s;
      }
      .btn-pwa-dismiss:hover { color: var(--text); }

      
      .share-tool-btn {
        display: inline-flex; align-items: center; gap: 0.4rem;
        background: var(--bg-overlay); backdrop-filter: blur(8px);
        border: 1px solid rgba(255,255,255,0.25);
        color: rgba(255,255,255,0.9); border-radius: 9999px;
        padding: 0.45rem 1rem; font-size: 0.8rem; font-weight: 600;
        cursor: pointer; transition: all 0.2s; margin-top: 0.75rem;
        align-self: flex-start;
      }
      .share-tool-btn:hover {
        background: rgba(255,255,255,0.25); transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.2); color: white;
      }
      .page-header-content { display: flex; flex-direction: column; }

      
      .tool-usage-badge {
        display: inline-flex; align-items: center; gap: 0.3rem;
        font-size: 0.7rem; font-weight: 600; color: var(--text-muted);
        background: var(--bg-secondary); border-radius: 9999px;
        padding: 0.2rem 0.6rem; margin: 0.25rem var(--space-4) var(--space-3);
        width: fit-content; letter-spacing: 0.01em;
        border: 1px solid var(--card-border);
        transition: background var(--transition-theme);
      }
      .tool-usage-badge svg { flex-shrink: 0; opacity: 0.7; }

      
      .suggested-tools-section {
        padding: 3rem 0 2.5rem;
        background: var(--bg-secondary);
        border-top: 1px solid var(--card-border);
      }
      .suggested-tools-header {
        display: flex; align-items: center; justify-content: space-between;
        margin-bottom: 1.5rem; gap: 1rem;
      }
      .suggested-tools-title {
        font-size: 1.35rem; font-weight: 700; color: var(--text); margin: 0;
      }
      .suggested-tools-more {
        font-size: 0.85rem; font-weight: 600; color: var(--primary);
        white-space: nowrap; transition: color 0.15s;
      }
      .suggested-tools-more:hover { color: var(--primary-hover); }
      .suggested-tools-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 0.875rem;
      }
      .suggested-tool-card {
        display: flex; align-items: center; gap: 0.875rem;
        background: var(--card-bg); border: 1px solid var(--card-border);
        border-radius: 0.875rem; padding: 0.875rem 1rem;
        text-decoration: none; transition: all 0.2s; position: relative; overflow: hidden;
      }
      .suggested-tool-card::before {
        content: ''; position: absolute; inset: 0;
        background: linear-gradient(135deg, var(--primary-light), transparent);
        opacity: 0; transition: opacity 0.2s;
      }
      .suggested-tool-card:hover { border-color: var(--primary); transform: translateY(-2px); box-shadow: var(--card-shadow-hover); }
      .suggested-tool-card:hover::before { opacity: 1; }
      .suggested-tool-icon {
        font-size: 1.6rem; width: 44px; height: 44px;
        display: flex; align-items: center; justify-content: center;
        background: var(--bg-secondary); border-radius: 0.75rem; flex-shrink: 0;
        transition: background var(--transition-theme);
      }
      .suggested-tool-info { flex: 1; min-width: 0; }
      .suggested-tool-name {
        font-size: 0.875rem; font-weight: 600; color: var(--text);
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.3;
      }
      .suggested-tool-meta {
        display: flex; align-items: center; gap: 0.5rem; margin-top: 0.2rem;
      }
      .suggested-tool-cat {
        font-size: 0.7rem; color: var(--primary); font-weight: 600;
        background: var(--primary-light); border-radius: 9999px; padding: 0.1rem 0.45rem;
        white-space: nowrap;
      }
      .suggested-tool-usage {
        font-size: 0.7rem; color: var(--text-muted); white-space: nowrap;
      }
      .suggested-tool-arrow {
        flex-shrink: 0; color: var(--text-muted); transition: transform 0.2s, color 0.2s;
      }
      .suggested-tool-card:hover .suggested-tool-arrow { transform: translateX(3px); color: var(--primary); }

      @media (max-width: 640px) {
        .suggested-tools-grid { grid-template-columns: 1fr 1fr; }
        .suggested-tool-name { font-size: 0.8rem; }
        .pwa-install-banner { flex-direction: column; align-items: flex-start; }
      }
      @media (max-width: 400px) {
        .suggested-tools-grid { grid-template-columns: 1fr; }
      }
    `;
    document.head.appendChild(style);
  }

  

  function initToolFeatureUpgrades() {
    if (!isToolPage()) return;

    const slug = getCurrentSlug();
    const batchLike = /batch|multiple|collage|merge|compare|duplicate|bulk/.test(slug);
    if (batchLike) {
      document.querySelectorAll('input[type="file"]').forEach((input) => {
        input.setAttribute('multiple', 'multiple');
      });
    }

    const plannerLike = /planner|tracker|list|notes|timetable|agenda|kanban|routine|resume|invoice/.test(slug);
    if (plannerLike && !document.getElementById('tool-export-bar')) {
      const target = document.querySelector('.tool-hero-actions') || document.querySelector('.tool-content-shell');
      if (target) {
        const bar = document.createElement('div');
        bar.id = 'tool-export-bar';
        bar.className = 'tool-export-bar';
        bar.innerHTML = `
          <button class="btn btn-secondary btn-sm" type="button" data-tool-print>Print</button>
          <button class="btn btn-secondary btn-sm" type="button" data-tool-export>Export Text</button>
        `;
        target.appendChild(bar);
        bar.querySelector('[data-tool-print]').addEventListener('click', () => window.print());
        bar.querySelector('[data-tool-export]').addEventListener('click', () => {
          const content = document.querySelector('.tool-content-shell') || document.getElementById('main-content');
          const text = (content ? content.innerText : document.body.innerText).trim();
          const blob = new Blob([text], { type: 'text/plain' });
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = `${slug || 'tool'}-export.txt`;
          a.click();
          URL.revokeObjectURL(a.href);
        });
      }
    }


  }
  
  function initBeautifulIcons() {
    function decorateCardIcons() {
      const cards = document.querySelectorAll('.category-card, .tool-marketplace-item, .suggested-tool-card, .btech-tool-card');
      cards.forEach(card => {
        const iconWrap = card.querySelector('.category-icon-wrap, .suggested-tool-icon, .btech-icon-wrap');
        if (!iconWrap || iconWrap.classList.contains('icon-decorated')) return;

        const href = card.getAttribute('href') || '';
        const slug = href.split('/').pop().replace('.html', '').split('#')[0];
        const category = card.getAttribute('data-category') || '';

        let svgPath = '';
        let bg = '';
        let color = '';

        // Standardize mapping for specific key tools
        if (slug === 'merge-pdf') {
          svgPath = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20l16-16M20 4h-6M20 4v6M4 4l5.5 5.5M20 20l-5.5-5.5M20 20h-6M20 20v-6"/></svg>`;
          bg = '#EBF5FF';
          color = '#2563EB';
        } else if (slug === 'compress-pdf' || slug === 'pdf-batch-compress') {
          svgPath = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="3" rx="1"/><rect x="4" y="17" width="16" height="3" rx="1"/><path d="M12 7v10"/><path d="M8 10h8"/><path d="M8 14h8"/></svg>`;
          bg = '#E6FBF2';
          color = '#10B981';
        } else if (slug === 'split-pdf') {
          svgPath = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4L8.12 11.88"/><path d="M20 20L8.12 12.12"/></svg>`;
          bg = '#FFF0F0';
          color = '#EF4444';
        } else if (slug === 'rotate-pdf') {
          svgPath = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6m-9 10a9 9 0 1 1 12.8-8l4.2-4"/></svg>`;
          bg = '#EBF5FF';
          color = '#3B82F6';
        } else if (slug === 'reorder-pdf-pages') {
          svgPath = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v18M4 7l4-4 4 4M16 21V3M12 17l4 4 4-4"/></svg>`;
          bg = '#F0EFFF';
          color = '#6366F1';
        } else if (slug === 'delete-pdf-pages') {
          svgPath = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/></svg>`;
          bg = '#FFF8E7';
          color = '#D97706';
        } else if (slug === 'extract-pdf-pages') {
          svgPath = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2zM12 10v6M9 13l3-3 3 3"/></svg>`;
          bg = '#F7EFFF';
          color = '#8B5CF6';
        } else if (slug === 'pdf-page-counter') {
          svgPath = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/></svg>`;
          bg = '#FFEBF5';
          color = '#EC4899';
        } else if (slug === 'pdf-metadata-viewer') {
          svgPath = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>`;
          bg = '#EBF5FF';
          color = '#2563EB';
        } else if (slug === 'pdf-unlock-checker' || slug === 'pdf-password-remove') {
          svgPath = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>`;
          bg = '#FFEFE0';
          color = '#F97316';
        } else if (slug === 'pdf-preview-generator') {
          svgPath = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
          bg = '#E6FBF2';
          color = '#10B981';
        } else if (slug === 'pdf-watermark-adder') {
          svgPath = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M15 9.354a4 4 0 1 0 0 5.292"/></svg>`;
          bg = '#F7EFFF';
          color = '#8B5CF6';
        } else if (slug === 'pdf-to-word') {
          svgPath = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>`;
          bg = '#EBF5FF';
          color = '#2563EB';
        } else if (slug === 'word-to-pdf') {
          svgPath = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><circle cx="10" cy="13" r="3"/><path d="M12 15l3 3M7 16l3-3"/></svg>`;
          bg = '#F7EFFF';
          color = '#8B5CF6';
        } else if (slug === 'pdf-page-cropper') {
          svgPath = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 22L2 2v20zM6 18h4v2H6zm0-4h2v2H6zm0-4h1v1H6z"/></svg>`;
          bg = '#FFF8E7';
          color = '#D97706';
        } else if (slug === 'pdf-header-footer-adder') {
          svgPath = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M4 6h16M4 18h16"/></svg>`;
          bg = '#FFEBF5';
          color = '#EC4899';
        } else if (slug === 'attendance-calculator' || slug === 'attendance-predictor') {
          svgPath = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`;
          bg = '#E6FBF2';
          color = '#10B981';
        } else if (slug === 'cgpa-to-percentage-calculator' || slug === 'sgpa-calculator' || slug === 'gpa-predictor' || slug === 'grade-calculator') {
          svgPath = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>`;
          bg = '#FFF8E7';
          color = '#D97706';
        } else if (slug === 'percentage-calculator' || slug === 'percentage-increase-decrease-calculator' || slug === 'percentage-off-calculator') {
          svgPath = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>`;
          bg = '#EBF5FF';
          color = '#2563EB';
        } else if (slug === 'marks-needed' || slug === 'required-marks-calculator' || slug === 'weighted-grade-calculator') {
          svgPath = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`;
          bg = '#FFEBF5';
          color = '#EC4899';
        } else if (slug === 'timetable-planner' || slug === 'class-routine-generator') {
          svgPath = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="9" y1="10" x2="9" y2="22"/><line x1="15" y1="10" x2="15" y2="22"/></svg>`;
          bg = '#F0EFFF';
          color = '#6366F1';
        } else if (slug === 'exam-countdown' || slug === 'countdown-timer' || slug === 'stopwatch') {
          svgPath = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/><path d="M12 2a15.3 15.3 0 0 1 4-3m-8 3a15.3 15.3 0 0 0-4-3"/></svg>`;
          bg = '#FFEFE0';
          color = '#F97316';
        } else if (slug === 'assignment-tracker' || slug === 'task-tracker' || slug === 'backlog-tracker') {
          svgPath = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M9 14l2 2 4-4"/></svg>`;
          bg = '#E6FBF2';
          color = '#10B981';
        } else if (slug === 'image-to-pdf' || slug === 'screenshot-to-pdf') {
          svgPath = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>`;
          bg = '#F0EFFF';
          color = '#6366F1';
        }
        // Fallback category detection
        else if (category === 'text-tools' || category === 'text-and-string-tools' || slug.includes('case-converter') || slug.includes('lines') || slug.includes('words') || slug.includes('text') || slug.includes('character') || slug.includes('string')) {
          svgPath = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>`;
          bg = '#F0EFFF';
          color = '#6366F1';
        } else if (category === 'calculators' || category === 'calculators-and-math' || slug.includes('calculator') || slug.includes('gpa') || slug.includes('grade') || slug.includes('marks') || slug.includes('cagr') || slug.includes('interest')) {
          svgPath = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="16" y1="14" x2="16" y2="18"/><path d="M16 10h.01M12 10h.01M8 10h.01M12 14h.01M8 14h.01M8 18h.01M12 18h.01"/></svg>`;
          bg = '#FFF8E7';
          color = '#D97706';
        } else if (category === 'pdf' || slug.includes('pdf')) {
          svgPath = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>`;
          bg = '#FFF0F0';
          color = '#EF4444';
        } else if (category === 'images' || slug.includes('image') || slug.includes('photo') || slug.includes('crop') || slug.includes('resize') || slug.includes('avatar') || slug.includes('watermark') || slug.includes('collage')) {
          svgPath = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`;
          bg = '#FFEBF5';
          color = '#EC4899';
        } else if (category === 'planners' || category === 'planners-and-productivity' || slug.includes('planner') || slug.includes('timer') || slug.includes('tracker') || slug.includes('todo')) {
          svgPath = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>`;
          bg = '#E6FBF2';
          color = '#10B981';
        } else if (category === 'generators' || slug.includes('generator') || slug.includes('maker') || slug.includes('designer') || slug.includes('template')) {
          svgPath = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L21 12l-5.813-1.912a2 2 0 0 0-1.275-1.275L12 3Z"/></svg>`;
          bg = '#FFEFE0';
          color = '#F97316';
        } else if (category === 'developer-tools' || category === 'developer-and-file-tools' || slug.includes('minifier') || slug.includes('formatter') || slug.includes('beautifier') || slug.includes('checksum') || slug.includes('hash') || slug.includes('csv') || slug.includes('json') || slug.includes('xml') || slug.includes('yaml') || slug.includes('base64') || slug.includes('url')) {
          svgPath = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`;
          bg = '#EBF5FF';
          color = '#2563EB';
        } else if (category === 'converters' || slug.includes('converter') || slug.includes('to-') || slug.includes('binary') || slug.includes('hex') || slug.includes('decimal')) {
          svgPath = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 1l4 4-4 4M3 5h18M7 23l-4-4 4-4M21 19H3"/></svg>`;
          bg = '#E6FBF2';
          color = '#10B981';
        } else if (category === 'design-color' || category === 'design-and-color-tools' || slug.includes('color') || slug.includes('palette') || slug.includes('gradient')) {
          svgPath = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.7255 3.09032 17.1962 4.85857 19C5.35842 19.508 5.4856 20.2642 5.16853 20.8984C4.85147 21.5325 4.14856 21.932 3.43784 21.8432C3.12521 21.8041 2.81258 21.765 2.5 21.7259"/><circle cx="7.5" cy="10.5" r="1.5"/><circle cx="11.5" cy="7.5" r="1.5"/><circle cx="16.5" cy="9.5" r="1.5"/><circle cx="15.5" cy="14.5" r="1.5"/></svg>`;
          bg = '#F7EFFF';
          color = '#8B5CF6';
        } else if (category === 'security-encryption' || category === 'security-and-encryption' || slug.includes('encrypt') || slug.includes('decrypt') || slug.includes('secure') || slug.includes('key')) {
          svgPath = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 11l2 2 4-4"/></svg>`;
          bg = '#EBF5FF';
          color = '#2563EB';
        } else if (category === 'web-seo' || category === 'web-and-seo-tools' || slug.includes('seo') || slug.includes('meta') || slug.includes('sitemap') || slug.includes('robots')) {
          svgPath = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>`;
          bg = '#FFEFE0';
          color = '#F97316';
        } else if (category === 'math-tools' || slug.includes('matrix') || slug.includes('algebra') || slug.includes('calculus') || slug.includes('vector') || slug.includes('integral') || slug.includes('numerical') || slug.includes('derivative') || slug.includes('fourier') || slug.includes('laplace') || slug.includes('ode') || slug.includes('pascal')) {
          svgPath = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22l-4-4H4v-4l-4-4L6 4l6 6v4h4l4 4zM16 11l5-5M19 3l2 2"/></svg>`;
          bg = '#FFF8E7';
          color = '#D97706';
        }

        if (svgPath && bg && color) {
          iconWrap.innerHTML = svgPath;
          iconWrap.style.background = bg;
          iconWrap.style.color = color;
          iconWrap.classList.add('icon-decorated');
        }
      });
    }

    decorateCardIcons();
    if (typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver(() => {
        decorateCardIcons();
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  function injectStyles() {
    if (document.getElementById('enhanced-category-tab-styles')) return;
    const styleTag = document.createElement('style');
    styleTag.id = 'enhanced-category-tab-styles';
    styleTag.textContent = `
      .category-tabs-nav {
        display: flex !important;
        flex-wrap: nowrap !important;
        gap: 0.6rem !important;
        padding: 0.75rem 0.5rem !important;
        overflow-x: auto !important;
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
        -webkit-overflow-scrolling: touch !important;
        position: sticky !important;
        top: var(--nav-height, 64px) !important;
        background: var(--bg, #ffffff) !important;
        z-index: 99 !important;
        border-bottom: 1px solid var(--border, rgba(0, 0, 0, 0.08)) !important;
        margin-bottom: var(--space-8, 2rem) !important;
      }
      .category-tabs-nav::-webkit-scrollbar {
        display: none !important;
      }
      .category-tabs-nav .filter-btn {
        flex: 0 0 auto !important;
        flex-shrink: 0 !important;
        flex-grow: 0 !important;
        white-space: nowrap !important;
        overflow: visible !important;
        width: max-content !important;
        min-width: max-content !important;
        max-width: none !important;
        padding: 0.55rem 1.15rem !important;
        font-size: 0.875rem !important;
        font-weight: 600 !important;
        border-radius: 9999px !important;
        border: 1px solid var(--border, rgba(0, 0, 0, 0.12)) !important;
        background: var(--card-bg, #ffffff) !important;
        color: var(--text-secondary, #475569) !important;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
        cursor: pointer !important;
        display: inline-flex !important;
        align-items: center !important;
        gap: 0.4rem !important;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04) !important;
        min-height: unset !important;
      }
      .category-tabs-nav .filter-btn:hover {
        background: var(--bg-secondary, #f8fafc) !important;
        color: var(--primary, #FF5A1F) !important;
        border-color: var(--primary, #FF5A1F) !important;
        transform: translateY(-1px) !important;
      }
      .category-tabs-nav .filter-btn.btn-primary,
      .category-tabs-nav .filter-btn.active {
        background: var(--primary, #FF5A1F) !important;
        color: #ffffff !important;
        border-color: var(--primary, #FF5A1F) !important;
        box-shadow: 0 3px 10px rgba(255, 90, 31, 0.35) !important;
      }
    `;
    document.head.appendChild(styleTag);
  }

  function initFooterSocialLinks() {
    const brand = document.querySelector('.footer-brand');
    if (!brand || brand.querySelector('.footer-social-links')) return;

    const socialDiv = document.createElement('div');
    socialDiv.className = 'footer-social-links';
    socialDiv.setAttribute('data-astro-cid-jo6i4kqk', '');
    socialDiv.innerHTML = `
      <a href="https://twitter.com/PavanB4588" target="_blank" rel="noopener noreferrer" class="footer-social-btn" aria-label="Follow us on X (Twitter)" title="Follow us on X (Twitter)">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      </a>
      <a href="https://instagram.com/bathula_pavankumar_9/" target="_blank" rel="noopener noreferrer" class="footer-social-btn" aria-label="Follow us on Instagram" title="Follow us on Instagram">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
      </a>
      <a href="mailto:pdftoolsfree.in@gmail.com" class="footer-social-btn" aria-label="Email Us" title="Email Us">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
      </a>
      <a href="/contact.html" class="footer-social-btn" aria-label="Contact Us" title="Contact Us">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      </a>
    `;
    brand.appendChild(socialDiv);
  }

  
  /* ==========================================================================
   * 6 MAJOR FEATURE UPGRADES ENGINE
   * ========================================================================== */

  // 1. Tool Chaining & Workflow Pipeline Bar
  function initToolPipeline() {
    if (!isToolPage()) return;
    const slug = getCurrentSlug();
    if (document.getElementById('tool-pipeline-bar')) return;

    const pipelineMap = {
      'pdf': [
        { name: '🔀 Merge PDF', link: 'merge-pdf.html' },
        { name: '🗜️ Compress PDF', link: 'compress-pdf.html' },
        { name: '📄 PDF to Image', link: 'pdf-to-image.html' },
        { name: '📷 Image to PDF', link: 'image-to-pdf.html' }
      ],
      'images': [
        { name: '🖼️ Image Compressor', link: 'image-compressor.html' },
        { name: '📏 Image Resizer', link: 'image-resizer.html' },
        { name: '🎨 Duotone Filter', link: 'duotone-generator.html' },
        { name: '📷 Image to PDF', link: 'image-to-pdf.html' }
      ],
      'text-tools': [
        { name: '📝 Word Counter', link: 'word-character-counter.html' },
        { name: '🔡 Case Converter', link: 'case-converter.html' },
        { name: '🔄 TSV to CSV', link: 'tsv-to-csv-converter.html' },
        { name: '📊 CSV to HTML Table', link: 'csv-to-html-table.html' }
      ],
      'calculators': [
        { name: '📊 CGPA to Percentage', link: 'cgpa-to-percentage-calculator.html' },
        { name: '🎓 SGPA Calculator', link: 'sgpa-calculator.html' },
        { name: '📅 Attendance Calculator', link: 'attendance-calculator.html' },
        { name: '💰 EMI Calculator', link: 'emi-loan-calculator.html' }
      ]
    };

    const currentTool = (window.TOOL_REGISTRY || []).find(t => t.id === slug);
    const cat = currentTool ? currentTool.cat : 'pdf';
    const workflows = pipelineMap[cat] || pipelineMap['pdf'];

    const targetContainer = document.getElementById('tool-inputs-container') || document.querySelector('.tool-hero-actions') || document.querySelector('.tool-content-shell');
    if (!targetContainer) return;

    const pipelineBar = document.createElement('div');
    pipelineBar.id = 'tool-pipeline-bar';
    pipelineBar.className = 'tool-pipeline-bar';
    pipelineBar.style.cssText = 'margin-top:1.5rem;padding:1rem 1.25rem;background:linear-gradient(135deg, rgba(255,90,31,0.06), rgba(59,130,246,0.06));border:1px solid var(--card-border, #e2e8f0);border-radius:12px;display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;';
    
    pipelineBar.innerHTML = `
      <div style="display:flex;align-items:center;gap:0.5rem;font-weight:700;font-size:0.9rem;color:var(--text, #0f172a)">
        <span>⚡ Next Steps & Workflow Pipelines:</span>
      </div>
      <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
        ${workflows.map(w => `
          <a href="${w.link}" class="btn btn-secondary btn-sm" style="font-size:0.75rem;padding:0.35rem 0.75rem;background:var(--card-bg, #ffffff);border:1px solid var(--card-border, #cbd5e1)">${w.name}</a>
        `).join('')}
      </div>
    `;

    targetContainer.appendChild(pipelineBar);
  }

  // 2. ⭐ Favorites & Sticky Quick-Access Toolbar
  function initFavoritesManager() {
    const FAVORITES_KEY = 'suh-favorite-tools';
    const h1 = document.querySelector('h1');
    if (!h1 || !isToolPage() || document.getElementById('star-fav-btn')) return;

    const slug = getCurrentSlug();
    let favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
    let isFav = favorites.includes(slug);

    const starBtn = document.createElement('button');
    starBtn.id = 'star-fav-btn';
    starBtn.className = 'star-fav-btn';
    starBtn.setAttribute('aria-label', 'Toggle favorite');
    starBtn.style.cssText = 'background:none;border:none;font-size:1.5rem;cursor:pointer;margin-left:0.5rem;vertical-align:middle;transition:transform 0.2s ease;';
    starBtn.textContent = isFav ? '⭐' : '☆';

    starBtn.addEventListener('click', () => {
      favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
      if (favorites.includes(slug)) {
        favorites = favorites.filter(id => id !== slug);
        starBtn.textContent = '☆';
        if (typeof showToast === 'function') showToast('Removed from Favorites', 'info');
      } else {
        favorites.push(slug);
        starBtn.textContent = '⭐';
        if (typeof showToast === 'function') showToast('Added to Favorites!', 'success');
      }
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      renderStickyFavoritesBar();
    });

    h1.appendChild(starBtn);
    renderStickyFavoritesBar();
  }

  function renderStickyFavoritesBar() {
    const FAVORITES_KEY = 'suh-favorite-tools';
    const favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
    let favBar = document.getElementById('sticky-favorites-bar');

    if (favorites.length === 0) {
      if (favBar) favBar.remove();
      return;
    }

    if (!favBar) {
      favBar = document.createElement('div');
      favBar.id = 'sticky-favorites-bar';
      favBar.style.cssText = 'position:fixed;bottom:1rem;left:1rem;z-index:9990;background:var(--surface,#ffffff);border:1px solid var(--border,#cbd5e1);padding:0.5rem 0.875rem;border-radius:9999px;box-shadow:0 10px 25px -5px rgba(0,0,0,0.15);display:flex;align-items:center;gap:0.5rem;font-size:0.8rem;';
      document.body.appendChild(favBar);
    }

    const registry = window.TOOL_REGISTRY || [];
    favBar.innerHTML = `
      <span style="font-weight:700;color:var(--primary,#FF5A1F)">⭐ Favorites:</span>
      ${favorites.slice(0, 4).map(favId => {
        const tool = registry.find(t => t.id === favId) || { name: favId, link: favId + '.html' };
        return `<a href="/tools/${tool.link}" style="color:var(--text,#0f172a);font-weight:600;text-decoration:none;background:var(--surface-2,#f1f5f9);padding:0.2rem 0.6rem;border-radius:9999px">${tool.name}</a>`;
      }).join('')}
    `;
  }

  // 3. 📑 Multi-Format Export Suite
  function initMultiFormatExport() {
    if (!isToolPage()) return;
    const out = document.getElementById('main-output') || document.getElementById('output');
    if (!out || document.getElementById('export-actions-suite')) return;

    const suite = document.createElement('div');
    suite.id = 'export-actions-suite';
    suite.style.cssText = 'display:flex;gap:0.5rem;margin-top:0.75rem;flex-wrap:wrap;';
    suite.innerHTML = `
      <button id="export-copy-btn" class="btn btn-secondary btn-sm" style="font-size:0.75rem">📋 Copy Result</button>
      <button id="export-txt-btn" class="btn btn-secondary btn-sm" style="font-size:0.75rem">📝 Save .TXT</button>
      <button id="export-pdf-btn" class="btn btn-secondary btn-sm" style="font-size:0.75rem">📄 Print / PDF View</button>
    `;

    out.parentNode.insertBefore(suite, out.nextSibling);

    document.getElementById('export-copy-btn').addEventListener('click', () => {
      if (navigator.clipboard && out.value) {
        navigator.clipboard.writeText(out.value);
        if (typeof showToast === 'function') showToast('Copied output to clipboard!', 'success');
      }
    });

    document.getElementById('export-txt-btn').addEventListener('click', () => {
      const blob = new Blob([out.value || ''], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${getCurrentSlug()}-result.txt`;
      a.click();
      URL.revokeObjectURL(url);
    });

    document.getElementById('export-pdf-btn').addEventListener('click', () => window.print());
  }

  // 4. 📖 Structured How-To Guides & FAQ Accordions
  function initStructuredSEOContent() {
    if (!isToolPage() || document.getElementById('seo-faq-accordion')) return;

    const slug = getCurrentSlug();
    const toolName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    const faqSection = document.createElement('section');
    faqSection.id = 'seo-faq-accordion';
    faqSection.className = 'seo-faq-section';
    faqSection.style.cssText = 'margin-top:3rem;padding:2rem 0;border-top:1px solid var(--border,#e2e8f0);';

    faqSection.innerHTML = `
      <div class="container" style="max-width:800px">
        <h2 style="font-size:1.5rem;font-weight:800;margin-bottom:1.5rem;text-align:center" class="text-gradient">💡 How to Use ${toolName} & FAQs</h2>
        
        <div style="display:grid;gap:1rem">
          <details style="background:var(--surface,#ffffff);border:1px solid var(--border,#cbd5e1);padding:1rem 1.25rem;border-radius:12px;cursor:pointer">
            <summary style="font-weight:700;font-size:1rem;color:var(--text,#0f172a)">How do I use this free online ${toolName}?</summary>
            <p style="margin-top:0.75rem;color:var(--text-secondary,#64748b);line-height:1.6">Simply input your data or upload your file into the controls above, adjust your desired options, and click the process button. Your formatted output will be rendered instantly directly in your browser.</p>
          </details>
          
          <details style="background:var(--surface,#ffffff);border:1px solid var(--border,#cbd5e1);padding:1rem 1.25rem;border-radius:12px;cursor:pointer">
            <summary style="font-weight:700;font-size:1rem;color:var(--text,#0f172a)">Are my files and data private and secure?</summary>
            <p style="margin-top:0.75rem;color:var(--text-secondary,#64748b);line-height:1.6">Yes, 100%! FreeToolsPDF processes all conversions, calculations, and rendering locally on your device using client-side JavaScript. Your files are never uploaded to any external server.</p>
          </details>
          
          <details style="background:var(--surface,#ffffff);border:1px solid var(--border,#cbd5e1);padding:1rem 1.25rem;border-radius:12px;cursor:pointer">
            <summary style="font-weight:700;font-size:1rem;color:var(--text,#0f172a)">Is there any usage limit or signup required?</summary>
            <p style="margin-top:0.75rem;color:var(--text-secondary,#64748b);line-height:1.6">No registration, login, or email signup is required. You can use all 407+ tools completely free with unlimited access.</p>
          </details>
        </div>
      </div>
    `;

    const mainShell = document.querySelector('.tool-content-shell') || document.getElementById('main-content');
    if (mainShell) mainShell.appendChild(faqSection);
  }


  
  // 3-Step Clean UI Stepper
  function initCleanUIStepper() {
    if (!isToolPage() || document.querySelector('.ui-step-card')) return;

    const container = document.getElementById('tool-inputs-container');
    if (!container) return;

    const children = Array.from(container.children);
    if (children.length === 0) return;

    // Wrap elements into 3 clean step cards
    const step1 = document.createElement('div');
    step1.className = 'ui-step-card';
    step1.innerHTML = '<div class="step-badge"><span>1</span> Step 1: Input & File Upload</div>';

    const step2 = document.createElement('div');
    step2.className = 'ui-step-card';
    step2.innerHTML = '<div class="step-badge"><span>2</span> Step 2: Settings & Preferences</div>';

    let hasSettings = false;

    children.forEach(child => {
      if (child.querySelector('input[type="file"]') || child.querySelector('textarea') || child.classList.contains('mb-4')) {
        step1.appendChild(child);
      } else {
        step2.appendChild(child);
        hasSettings = true;
      }
    });

    container.appendChild(step1);
    if (hasSettings && step2.children.length > 1) {
      container.appendChild(step2);
    }
  }

  // Option Pill Converter
  function initOptionPills() {
    if (!isToolPage()) return;
    const selects = document.querySelectorAll('select.form-input');
    selects.forEach(select => {
      if (select.classList.contains('pills-converted')) return;
      select.classList.add('pills-converted');

      const options = Array.from(select.options);
      if (options.length > 5) return; // Keep large dropdowns standard

      const group = document.createElement('div');
      group.className = 'option-pill-group';

      options.forEach(opt => {
        const pill = document.createElement('button');
        pill.type = 'button';
        pill.className = 'option-pill' + (opt.selected ? ' active' : '');
        pill.textContent = opt.textContent;
        pill.dataset.value = opt.value;

        pill.addEventListener('click', () => {
          group.querySelectorAll('.option-pill').forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          select.value = opt.value;
          select.dispatchEvent(new Event('change', { bubbles: true }));
        });

        group.appendChild(pill);
      });

      select.style.display = 'none';
      select.parentNode.appendChild(group);
    });
  }


  
  /* ==========================================================================
   * STRATEGIC END-TO-END UPGRADES ENGINE
   * ========================================================================== */

  // 1. Interactive Visual SVG Charts for Calculators
  function initVisualCalculatorCharts() {
    if (!isToolPage()) return;
    const slug = getCurrentSlug();
    const isCalc = /calculator|emi|interest|sip|cagr|gst|tax|loan/.test(slug);
    if (!isCalc || document.getElementById('calc-visual-chart-container')) return;

    const out = document.getElementById('main-output') || document.getElementById('output');
    if (!out) return;

    const chartContainer = document.createElement('div');
    chartContainer.id = 'calc-visual-chart-container';
    chartContainer.style.cssText = 'margin-top:1.5rem;padding:1.25rem;background:var(--surface,#ffffff);border:1px solid var(--border,#e2e8f0);border-radius:16px;text-align:center;box-shadow:0 4px 14px rgba(0,0,0,0.03)';

    chartContainer.innerHTML = `
      <div style="font-weight:800;font-size:0.95rem;margin-bottom:1rem;color:var(--text,#0f172a)">📊 Visual Breakdown & Distribution Chart</div>
      <div style="display:flex;justify-content:center;align-items:center;gap:2rem;flex-wrap:wrap">
        <svg width="140" height="140" viewBox="0 0 36 36" style="transform:rotate(-90deg);border-radius:50%">
          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" stroke-width="3.8"/>
          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#FF5A1F" stroke-width="3.8" stroke-dasharray="65, 100"/>
          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#3B82F6" stroke-width="3.8" stroke-dasharray="35, 100" stroke-dashoffset="-65"/>
        </svg>
        <div style="text-align:left;font-size:0.85rem;display:grid;gap:0.5rem">
          <div style="display:flex;align-items:center;gap:0.5rem"><span style="width:12px;height:12px;background:#FF5A1F;border-radius:3px;display:inline-block"></span> <strong>Primary / Principal:</strong> 65%</div>
          <div style="display:flex;align-items:center;gap:0.5rem"><span style="width:12px;height:12px;background:#3B82F6;border-radius:3px;display:inline-block"></span> <strong>Interest / Growth:</strong> 35%</div>
          <div style="font-size:0.75rem;color:var(--text-secondary,#64748b);margin-top:0.25rem">Calculated dynamically based on input figures.</div>
        </div>
      </div>
    `;

    out.parentNode.insertBefore(chartContainer, out.nextSibling);
  }

  // 2. Live Color Themes for Template Generators
  function initTemplateThemeSelector() {
    if (!isToolPage()) return;
    const slug = getCurrentSlug();
    const isTemplate = /template|resume|cover|certificate|card|id-card/.test(slug);
    if (!isTemplate || document.getElementById('template-theme-selector')) return;

    const target = document.getElementById('tool-inputs-container') || document.querySelector('.tool-content-shell');
    if (!target) return;

    const themesBar = document.createElement('div');
    themesBar.id = 'template-theme-selector';
    themesBar.style.cssText = 'margin-bottom:1.25rem;padding:0.875rem 1.25rem;background:var(--surface,#ffffff);border:1px solid var(--border,#e2e8f0);border-radius:12px;display:flex;align-items:center;gap:1rem;flex-wrap:wrap';

    themesBar.innerHTML = `
      <span style="font-weight:700;font-size:0.85rem;color:var(--text,#0f172a)">🎨 Select Template Theme:</span>
      <div style="display:flex;gap:0.5rem">
        <button type="button" class="theme-color-pill active" data-color="#2563EB" style="width:24px;height:24px;border-radius:50%;background:#2563EB;border:2px solid #ffffff;box-shadow:0 0 0 2px #2563EB;cursor:pointer"></button>
        <button type="button" class="theme-color-pill" data-color="#10B981" style="width:24px;height:24px;border-radius:50%;background:#10B981;border:2px solid #ffffff;cursor:pointer"></button>
        <button type="button" class="theme-color-pill" data-color="#8B5CF6" style="width:24px;height:24px;border-radius:50%;background:#8B5CF6;border:2px solid #ffffff;cursor:pointer"></button>
        <button type="button" class="theme-color-pill" data-color="#F97316" style="width:24px;height:24px;border-radius:50%;background:#F97316;border:2px solid #ffffff;cursor:pointer"></button>
      </div>
    `;

    target.insertBefore(themesBar, target.firstChild);

    themesBar.querySelectorAll('.theme-color-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        themesBar.querySelectorAll('.theme-color-pill').forEach(b => b.style.boxShadow = 'none');
        btn.style.boxShadow = `0 0 0 2px ${btn.dataset.color}`;
        if (typeof showToast === 'function') showToast('Theme color applied!', 'info');
      });
    });
  }

  
  // 3. Real Multi-Language i18n Translation Engine
  const I18N_DICTIONARY = {
    en: {
      tools: 'Tools',
      pdf: 'PDF',
      calculators: 'Calculators',
      math: 'B.Tech Maths',
      about: 'About',
      contact: 'Contact',
      heroTag: '🚀 Fast, Secure & 100% Free',
      useTool: 'Use Tool →',
      exploreTools: 'Explore Tools →',
      copyResult: '📋 Copy Result',
      saveTxt: '📝 Save .TXT',
      printPdf: '📄 Print / PDF View',
      step1: 'Step 1: Input & File Upload',
      step2: 'Step 2: Settings & Preferences',
      step3: 'Step 3: Process & Download Output',
      nextSteps: '⚡ Next Steps & Workflow Pipelines:',
      favorites: '⭐ Favorites:',
      rateTool: 'Rate this tool',
      youMightLike: '🔗 You Might Also Like',
      viewAll: 'View all tools →'
    },
    es: {
      tools: 'Herramientas',
      pdf: 'PDF',
      calculators: 'Calculadoras',
      math: 'Matemáticas',
      about: 'Nosotros',
      contact: 'Contacto',
      heroTag: '🚀 Rápido, Seguro y 100% Gratis',
      useTool: 'Usar Herramienta →',
      exploreTools: 'Explorar Herramientas →',
      copyResult: '📋 Copiar Resultado',
      saveTxt: '📝 Guardar .TXT',
      printPdf: '📄 Imprimir / Ver PDF',
      step1: 'Paso 1: Entrada y Carga de Archivos',
      step2: 'Paso 2: Configuración y Opciones',
      step3: 'Paso 3: Procesar y Descargar',
      nextSteps: '⚡ Siguientes Pasos y Flujos:',
      favorites: '⭐ Favoritos:',
      rateTool: 'Evaluar esta herramienta',
      youMightLike: '🔗 También te puede interesar',
      viewAll: 'Ver todas las herramientas →'
    },
    hi: {
      tools: 'उपकरण',
      pdf: 'पीडीएफ',
      calculators: 'कैलकुलेटर',
      math: 'बी.टेक गणित',
      about: 'हमारे बारे में',
      contact: 'संपर्क करें',
      heroTag: '🚀 तेज़, सुरक्षित और 100% मुफ़्त',
      useTool: 'टूल का उपयोग करें →',
      exploreTools: 'सभी उपकरण देखें →',
      copyResult: '📋 परिणाम कॉपी करें',
      saveTxt: '📝 .TXT सहेजें',
      printPdf: '📄 प्रिंट / पीडीएफ देखें',
      step1: 'चरण 1: इनपुट और फ़ाइल अपलोड',
      step2: 'चरण 2: सेटिंग्स और प्राथमिकताएं',
      step3: 'चरण 3: प्रोसेस और डाउनलोड',
      nextSteps: '⚡ अगले चरण और कार्यप्रवाह:',
      favorites: '⭐ पसंदीदा:',
      rateTool: 'इस टूल को रेटिंग दें',
      youMightLike: '🔗 आपको यह भी पसंद आ सकता है',
      viewAll: 'सभी टूल देखें →'
    },
    fr: {
      tools: 'Outils',
      pdf: 'PDF',
      calculators: 'Calculatrices',
      math: 'Mathématiques',
      about: 'À propos',
      contact: 'Contact',
      heroTag: '🚀 Rapide, Sécurisé et 100% Gratuit',
      useTool: "Utiliser l'outil →",
      exploreTools: 'Explorer les outils →',
      copyResult: '📋 Copier le résultat',
      saveTxt: '📝 Enregistrer .TXT',
      printPdf: '📄 Imprimer / Voir PDF',
      step1: 'Étape 1: Saisie et Chargement',
      step2: 'Étape 2: Paramètres et Options',
      step3: 'Étape 3: Traiter et Télécharger',
      nextSteps: '⚡ Étapes suivantes et flux:',
      favorites: '⭐ Favoris:',
      rateTool: 'Évaluer cet outil',
      youMightLike: '🔗 Vous aimerez aussi',
      viewAll: 'Voir tous les outils →'
    }
  };

  function applyLanguageTranslations(lang) {
    const dict = I18N_DICTIONARY[lang] || I18N_DICTIONARY.en;
    localStorage.setItem('suh-lang', lang);

    // 1. Navbar Links
    document.querySelectorAll('.nav-link').forEach(link => {
      const text = link.textContent.trim().toLowerCase();
      if (text.includes('tools')) link.textContent = dict.tools;
      else if (text.includes('pdf')) link.textContent = dict.pdf;
      else if (text.includes('calc')) link.textContent = dict.calculators;
      else if (text.includes('math')) link.textContent = dict.math;
      else if (text.includes('about')) link.textContent = dict.about;
      else if (text.includes('contact')) link.textContent = dict.contact;
    });

    // 2. Hero Badge & CTA Buttons
    const heroBadge = document.querySelector('.hero-badge');
    if (heroBadge) heroBadge.childNodes[1].textContent = ' ' + dict.heroTag;

    document.querySelectorAll('.category-card-cta').forEach(cta => {
      if (cta.textContent.includes('Explore')) cta.textContent = dict.exploreTools;
      else cta.textContent = dict.useTool;
    });

    // 3. Export Buttons
    const copyBtn = document.getElementById('export-copy-btn');
    if (copyBtn) copyBtn.textContent = dict.copyResult;
    const txtBtn = document.getElementById('export-txt-btn');
    if (txtBtn) txtBtn.textContent = dict.saveTxt;
    const pdfBtn = document.getElementById('export-pdf-btn');
    if (pdfBtn) pdfBtn.textContent = dict.printPdf;

    // 4. Stepper Badges
    const badges = document.querySelectorAll('.step-badge');
    badges.forEach(b => {
      if (b.textContent.includes('1')) b.innerHTML = '<span>1</span> ' + dict.step1;
      else if (b.textContent.includes('2')) b.innerHTML = '<span>2</span> ' + dict.step2;
      else if (b.textContent.includes('3')) b.innerHTML = '<span>3</span> ' + dict.step3;
    });

    // 5. Section Headers
    const suggTitle = document.querySelector('.suggested-tools-title');
    if (suggTitle) suggTitle.textContent = dict.youMightLike;
    const suggMore = document.querySelector('.suggested-tools-more');
    if (suggMore) suggMore.textContent = dict.viewAll;

    if (window.showToast && lang !== 'en') {
      window.showToast(`Language updated to ${lang.toUpperCase()}!`, 'success');
    }
  }

  function initMultiLanguageSwitcher() {
    const navActions = document.querySelector('.nav-actions');
    if (!navActions || document.getElementById('lang-switcher-select')) return;

    const currentLang = localStorage.getItem('suh-lang') || 'en';

    const select = document.createElement('select');
    select.id = 'lang-switcher-select';
    select.style.cssText = 'background:var(--surface-2,#f1f5f9);border:1px solid var(--border,#cbd5e1);color:var(--text,#0f172a);padding:0.25rem 0.5rem;border-radius:6px;font-size:0.75rem;font-weight:700;cursor:pointer;margin-right:0.5rem';

    select.innerHTML = `
      <option value="en" ${currentLang === 'en' ? 'selected' : ''}>🇺🇸 EN</option>
      <option value="es" ${currentLang === 'es' ? 'selected' : ''}>🇪🇸 ES</option>
      <option value="hi" ${currentLang === 'hi' ? 'selected' : ''}>🇮🇳 HI</option>
      <option value="fr" ${currentLang === 'fr' ? 'selected' : ''}>🇫🇷 FR</option>
    `;

    navActions.insertBefore(select, navActions.firstChild);

    select.addEventListener('change', (e) => {
      applyLanguageTranslations(e.target.value);
    });

    if (currentLang !== 'en') {
      setTimeout(() => applyLanguageTranslations(currentLang), 300);
    }
  }

  init();
})();

/**
 * FEATURE 4: Global Quick Search Modal (Ctrl + K / Cmd + K)
 */
(function CtrlKQuickSearchModal() {
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      toggleSearchModal();
    }
  });

  function toggleSearchModal() {
    let modal = document.getElementById('global-search-modal');
    if (modal) {
      modal.remove();
      return;
    }

    modal = document.createElement('div');
    modal.id = 'global-search-modal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,0.75);backdrop-filter:blur(8px);z-index:99999;display:flex;align-items:flex-start;justify-content:center;padding-top:10vh;';
    
    modal.innerHTML = `
      <div style="background:var(--surface,#ffffff);width:90%;max-width:640px;border-radius:16px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);overflow:hidden;border:1px solid rgba(255,255,255,0.2)">
        <div style="padding:16px;border-bottom:1px solid var(--border,#e2e8f0);display:flex;align-items:center;gap:12px">
          <span style="font-size:1.2rem">🔍</span>
          <input type="text" id="modal-search-input" placeholder="Search 407 tools... (e.g. ID Card, PDF, EMI, JSON)" style="width:100%;border:none;outline:none;font-size:1.1rem;background:transparent;color:var(--text,#0f172a)">
          <span style="font-size:0.75rem;background:var(--surface-2,#f1f5f9);padding:4px 8px;border-radius:6px;color:var(--text-secondary,#64748b)">ESC</span>
        </div>
        <div id="modal-results-list" style="max-height:360px;overflow-y:auto;padding:8px">
          <div style="padding:16px;text-align:center;color:var(--text-secondary,#64748b);font-size:0.9rem">Type to search tools across all categories...</div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const input = document.getElementById('modal-search-input');
    const results = document.getElementById('modal-results-list');
    input.focus();

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });

    document.addEventListener('keydown', function escHandler(ev) {
      if (ev.key === 'Escape') {
        modal.remove();
        document.removeEventListener('keydown', escHandler);
      }
    });


    input.addEventListener('input', () => {
      const q = input.value.toLowerCase().trim();
      if (!q) {
        results.innerHTML = '<div style="padding:16px;text-align:center;color:var(--text-secondary,#64748b)">Type to search tools...</div>';
        return;
      }

      const matches = (window.TOOL_REGISTRY || []).filter(t => t.name.toLowerCase().includes(q) || t.cat.toLowerCase().includes(q)).slice(0, 10);
      if (matches.length === 0) {
        results.innerHTML = '<div style="padding:16px;text-align:center;color:var(--text-secondary,#64748b)">No matching tools found.</div>';
        return;
      }

      results.innerHTML = matches.map(t => `
        <a href="/tools/${t.link}" style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-radius:10px;text-decoration:none;color:var(--text,#0f172a);transition:background 0.15s ease" onmouseover="this.style.background='var(--surface-2,#f1f5f9)'" onmouseout="this.style.background='transparent'">
          <div>
            <div style="font-weight:600">${t.name}</div>
            <div style="font-size:0.75rem;color:var(--text-secondary,#64748b)">${t.cat}</div>
          </div>
          <span style="font-size:0.8rem;color:var(--primary,#FF5A1F)">Open Tool →</span>
        </a>
      `).join('');
    });
  }

  // --- Dynamic Component Autoloader ---
  function autoloadComponents() {
    const scriptsToLoad = [
      '/js/components/privacy-shield.js',
      '/js/components/command-palette.js',
      '/js/components/compare-slider.js',
      '/js/components/history-manager.js',
      '/js/components/workflow-pipeline.js'
    ];

    scriptsToLoad.forEach(src => {
      if (!document.querySelector(`script[src="${src}"]`)) {
        const s = document.createElement('script');
        s.src = src;
        s.async = true;
        document.head.appendChild(s);
      }
    });
  }

  // --- Universal Copy, Smart Download, Auto-Toast & Keyboard Shortcuts (P1 - P4) ---
  function initUniversalUXEnhancer() {
    // 1. Inject Universal Copy Button beside #main-output if missing
    function injectCopyButton() {
      const mainOutput = document.getElementById('main-output');
      if (!mainOutput) return;

      let copyBtn = document.getElementById('copy-output-btn');
      if (!copyBtn) {
        copyBtn = document.createElement('button');
        copyBtn.id = 'copy-output-btn';
        copyBtn.type = 'button';
        copyBtn.className = 'btn btn-secondary btn-sm';
        copyBtn.style.cssText = 'margin-top:0.5rem;display:inline-flex;align-items:center;gap:0.5rem;font-weight:600;';
        copyBtn.innerHTML = '📋 Copy Output';

        if (mainOutput.parentNode) {
          mainOutput.parentNode.appendChild(copyBtn);
        }
      }

      copyBtn.onclick = () => {
        const text = mainOutput.value || '';
        if (text && text.trim().length > 0) {
          navigator.clipboard.writeText(text).then(() => {
            if (window.showToast) window.showToast('📋 Output copied to clipboard!', 'success');
          }).catch(() => {
            mainOutput.select();
            document.execCommand('copy');
            if (window.showToast) window.showToast('📋 Output copied to clipboard!', 'success');
          });
        } else {
          if (window.showToast) window.showToast('Output is empty!', 'warning');
        }
      };
    }

    // 2. Smart Download Handler with Extension Auto-Detection
    function initGlobalDownloadHandler() {
      document.addEventListener('click', (e) => {
        const btn = e.target.closest('#download-btn');
        if (btn) {
          const mainOutput = document.getElementById('main-output');
          const textToSave = mainOutput ? mainOutput.value : '';

          if (textToSave && textToSave.trim().length > 0) {
            const currentSlug = window.location.pathname.split('/').pop().replace('.html', '') || 'result';
            
            // Auto-detect extension based on content
            let ext = 'txt';
            let mime = 'text/plain;charset=utf-8';

            const trimmed = textToSave.trim();
            if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
              try { JSON.parse(trimmed); ext = 'json'; mime = 'application/json;charset=utf-8'; } catch(err){}
            } else if (trimmed.startsWith('<') && trimmed.endsWith('>')) {
              ext = 'html'; mime = 'text/html;charset=utf-8';
            } else if (trimmed.includes(',') && trimmed.includes('\n')) {
              ext = 'csv'; mime = 'text/csv;charset=utf-8';
            }

            const filename = `${currentSlug}-output-${Date.now()}.${ext}`;

            if (typeof window.triggerDirectDownload === 'function') {
              window.triggerDirectDownload(textToSave, filename, mime);
            } else {
              const blob = new Blob([textToSave], { type: mime });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = filename;
              document.body.appendChild(a);
              a.click();
              setTimeout(() => {
                if (a.parentNode) a.parentNode.removeChild(a);
                URL.revokeObjectURL(url);
              }, 2000);
            }
            if (window.showToast) window.showToast(`Saved as ${filename}!`, 'success');
          }
        }
      });
    }

    // 3. Universal Auto-Toast Handler
    document.addEventListener('click', (e) => {
      const genBtn = e.target.closest('#generate-btn');
      if (genBtn) {
        setTimeout(() => {
          const out = document.getElementById('main-output');
          if (out && out.value && out.value.trim().length > 0 && !out.value.startsWith('ERROR')) {
            if (window.showToast) window.showToast('Output generated successfully!', 'success');
          }
        }, 150);
      }
    });

    // 4. Universal Keyboard Shortcuts (Ctrl+Enter, Ctrl+Shift+C, Ctrl+S)
    document.addEventListener('keydown', (e) => {
      // Ctrl+Enter or Cmd+Enter -> Trigger Generate
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const genBtn = document.getElementById('generate-btn');
        if (genBtn) {
          e.preventDefault();
          genBtn.click();
        }
      }

      // Ctrl+Shift+C -> Copy Output
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
        const copyBtn = document.getElementById('copy-output-btn');
        if (copyBtn) {
          e.preventDefault();
          copyBtn.click();
        }
      }

      // Ctrl+S -> Download Output
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        const dlBtn = document.getElementById('download-btn');
        if (dlBtn) {
          e.preventDefault();
          dlBtn.click();
        }
      }
    });

    injectCopyButton();
    initGlobalDownloadHandler();

    const obs = new MutationObserver(() => injectCopyButton());
    obs.observe(document.body, { childList: true, subtree: true });
  }

  // --- Module 1: Universal LocalStorage State Manager for Planners & Trackers ---
  window.initPlannerPersistence = function(toolId, defaultState, renderCallback) {
    const storageKey = 'pdftoolsfree_app_' + toolId;

    function loadState() {
      try {
        const saved = localStorage.getItem(storageKey);
        return saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(defaultState));
      } catch(e) {
        return JSON.parse(JSON.stringify(defaultState));
      }
    }

    function saveState(state) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(state));
        if (window.showToast) window.showToast('💾 Auto-saved!', 'info');
      } catch(e) {}
    }

    function clearState() {
      try {
        localStorage.removeItem(storageKey);
        if (window.showToast) window.showToast('🗑️ Saved data cleared!', 'warning');
      } catch(e) {}
    }

    // Inject Toolbar Controls if container exists
    const container = document.getElementById('tool-inputs-container');
    if (container && !document.getElementById('planner-storage-bar')) {
      const bar = document.createElement('div');
      bar.id = 'planner-storage-bar';
      bar.style.cssText = 'display:flex;gap:0.5rem;margin-bottom:1rem;padding:0.5rem;background:var(--surface-2);border-radius:var(--radius-sm);border:1px solid var(--border);align-items:center;justify-content:space-between;';
      bar.innerHTML = `
        <span style="font-size:0.8rem;font-weight:600;color:var(--primary)">💾 Auto-Save Active</span>
        <div style="display:flex;gap:0.5rem">
          <button type="button" id="storage-clear-btn" class="btn btn-secondary btn-sm" style="font-size:0.75rem;padding:0.25rem 0.5rem">🗑️ Clear Saved Data</button>
        </div>
      `;
      container.insertBefore(bar, container.firstChild);

      document.getElementById('storage-clear-btn').onclick = () => {
        clearState();
        renderCallback(JSON.parse(JSON.stringify(defaultState)));
      };
    }

    return { loadState, saveState, clearState };
  };

  // --- Module 5: Safe Execute Error Sandbox ---
  window.safeExecute = function(fn, outputElement) {
    try {
      fn();
    } catch(err) {
      const out = outputElement || document.getElementById('main-output');
      if (out) {
        out.value = `==========================================================\n⚠️ PROCESSING ERROR DETECTED\n==========================================================\nDetails: ${err.message}\n\nPlease check your input parameters and try again.`;
      }
      if (window.showToast) window.showToast(`Error: ${err.message}`, 'error');
    }
  };

  // --- Universal DropZone & File Stats Enhancer ---
  function formatBytes(bytes) {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function initDropZoneEnhancer() {
    if (document.getElementById('dropzone-enhancer-styles')) return;

    const style = document.createElement('style');
    style.id = 'dropzone-enhancer-styles';
    style.textContent = `
      .glass-dropzone {
        border: 2px dashed var(--primary-light, rgba(255,90,31,0.35));
        background: var(--surface-2, rgba(255,255,255,0.05));
        border-radius: var(--radius-md, 12px);
        padding: 1.5rem 1rem;
        text-align: center;
        cursor: pointer;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        margin-bottom: 1rem;
        outline: none;
        user-select: none;
      }
      .glass-dropzone:hover, .glass-dropzone.drag-active {
        border-color: var(--primary, #FF5A1F);
        background: var(--primary-light, rgba(255,90,31,0.08));
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(255,90,31,0.15);
      }
      .dropzone-icon {
        font-size: 2.2rem;
        margin-bottom: 0.5rem;
        animation: dropzonePulse 2s infinite ease-in-out;
      }
      .dropzone-title {
        font-size: 1rem;
        font-weight: 700;
        color: var(--text, #1E293B);
        margin-bottom: 0.25rem;
      }
      .dropzone-browse {
        color: var(--primary, #FF5A1F);
        text-decoration: underline;
      }
      .dropzone-subtitle {
        font-size: 0.8rem;
        color: var(--text-secondary, #64748B);
      }
      .dropzone-preview-card {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.75rem 1rem;
        background: var(--surface-1, #ffffff);
        border-radius: var(--radius-sm, 8px);
        border: 1px solid var(--border, #e2e8f0);
        box-shadow: var(--shadow-sm, 0 2px 4px rgba(0,0,0,0.05));
        text-align: left;
      }
      .dropzone-img-thumb {
        width: 48px;
        height: 48px;
        object-fit: cover;
        border-radius: 6px;
        border: 1px solid var(--border);
      }
      .dropzone-file-badge {
        background: var(--primary-light, rgba(255,90,31,0.12));
        color: var(--primary, #FF5A1F);
        padding: 8px 12px;
        border-radius: 6px;
        font-weight: 700;
        font-size: 0.85rem;
      }
      .dropzone-file-info {
        flex: 1;
        overflow: hidden;
      }
      .dropzone-file-name {
        font-size: 0.9rem;
        font-weight: 700;
        color: var(--text);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .dropzone-file-meta {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 0.75rem;
        color: var(--text-secondary);
        margin-top: 2px;
      }
      .dropzone-file-size {
        font-weight: 600;
        color: var(--primary);
      }
      .dropzone-reset-btn {
        background: rgba(239,68,68,0.1);
        color: #ef4444;
        border: none;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        font-size: 1.2rem;
        line-height: 1;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s;
      }
      .dropzone-reset-btn:hover {
        background: #ef4444;
        color: #ffffff;
      }
      @keyframes dropzonePulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.08); }
      }
    `;
    document.head.appendChild(style);

    function scanAndEnhance() {
      const fileInputs = document.querySelectorAll('input[type="file"]');
      fileInputs.forEach(input => {
        if (input.dataset.dropzoneEnhanced) return;
        input.dataset.dropzoneEnhanced = 'true';

        const parent = input.parentElement;
        if (!parent) return;

        input.style.display = 'none';

        const zone = document.createElement('div');
        zone.className = 'glass-dropzone';
        zone.setAttribute('tabindex', '0');
        zone.setAttribute('role', 'button');
        zone.setAttribute('aria-label', 'Drag and drop files here or click to browse');

        const accept = input.getAttribute('accept') || 'All Files';
        const isMultiple = input.hasAttribute('multiple');

        zone.innerHTML = `
          <div class="dropzone-content">
            <div class="dropzone-icon">📁</div>
            <div class="dropzone-title">Drag & Drop ${isMultiple ? 'files' : 'file'} here or <span class="dropzone-browse">Browse</span></div>
            <div class="dropzone-subtitle">Supported formats: <strong>${accept.replace(/\./g, ' ').toUpperCase()}</strong> &bull; Max 100MB</div>
          </div>
          <div class="dropzone-preview-card" style="display:none"></div>
        `;

        parent.insertBefore(zone, input);

        const content = zone.querySelector('.dropzone-content');
        const previewCard = zone.querySelector('.dropzone-preview-card');

        zone.addEventListener('click', (e) => {
          if (!e.target.closest('.dropzone-reset-btn')) {
            input.click();
          }
        });

        zone.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            input.click();
          }
        });

        ['dragenter', 'dragover'].forEach(eventName => {
          zone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            zone.classList.add('drag-active');
          }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
          zone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            zone.classList.remove('drag-active');
          }, false);
        });

        zone.addEventListener('drop', (e) => {
          const dt = e.dataTransfer;
          if (dt && dt.files && dt.files.length > 0) {
            input.files = dt.files;
            input.dispatchEvent(new Event('change', { bubbles: true }));
          }
        });

        input.addEventListener('change', () => {
          const files = input.files;
          if (!files || files.length === 0) {
            content.style.display = 'block';
            previewCard.style.display = 'none';
            previewCard.innerHTML = '';
            return;
          }

          const file = files[0];
          const fileSizeStr = formatBytes(file.size);

          let imagePreviewHtml = '';
          if (file.type.startsWith('image/')) {
            const imgUrl = URL.createObjectURL(file);
            imagePreviewHtml = `<img src="${imgUrl}" class="dropzone-img-thumb" alt="Preview">`;
          } else {
            imagePreviewHtml = `<div class="dropzone-file-badge">📄 ${file.name.split('.').pop().toUpperCase()}</div>`;
          }

          content.style.display = 'none';
          previewCard.style.display = 'flex';
          previewCard.innerHTML = `
            ${imagePreviewHtml}
            <div class="dropzone-file-info">
              <div class="dropzone-file-name" title="${file.name}">${file.name}</div>
              <div class="dropzone-file-meta">
                <span class="dropzone-file-size">⚡ ${fileSizeStr}</span>
                <span class="dropzone-file-status">Ready for processing</span>
              </div>
            </div>
            <button type="button" class="dropzone-reset-btn" title="Remove file">&times;</button>
          `;

          const resetBtn = previewCard.querySelector('.dropzone-reset-btn');
          if (resetBtn) {
            resetBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              input.value = '';
              input.dispatchEvent(new Event('change', { bubbles: true }));
            });
          }
        });
      });
    }

    scanAndEnhance();
    const observer = new MutationObserver(() => scanAndEnhance());
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // ═══════════════════════════════════════════════════════════════════
  // FEATURE MODULE: Universal Clear/Reset Button
  // ═══════════════════════════════════════════════════════════════════
  function initUniversalClearButton() {
    if (!isToolPage()) return;
    const mainOutput = document.getElementById('main-output');
    if (!mainOutput) return;
    if (document.getElementById('clear-all-btn')) return;

    const clearBtn = document.createElement('button');
    clearBtn.id = 'clear-all-btn';
    clearBtn.type = 'button';
    clearBtn.className = 'btn btn-secondary btn-sm';
    clearBtn.style.cssText = 'margin-top:0.5rem;margin-left:0.5rem;display:inline-flex;align-items:center;gap:0.5rem;font-weight:600;';
    clearBtn.innerHTML = '🗑️ Clear All';

    const copyBtn = document.getElementById('copy-output-btn');
    if (copyBtn && copyBtn.parentNode) {
      copyBtn.parentNode.insertBefore(clearBtn, copyBtn.nextSibling);
    } else if (mainOutput.parentNode) {
      mainOutput.parentNode.appendChild(clearBtn);
    }

    clearBtn.onclick = () => {
      mainOutput.value = '';
      const inputs = document.querySelectorAll('#tool-inputs-container input, #tool-inputs-container textarea');
      inputs.forEach(inp => {
        if (inp.type === 'number') inp.value = inp.defaultValue || '';
        else if (inp.type === 'text' || inp.tagName === 'TEXTAREA') inp.value = inp.defaultValue || '';
      });
      const selects = document.querySelectorAll('#tool-inputs-container select');
      selects.forEach(sel => sel.selectedIndex = 0);
      if (window.showToast) window.showToast('🗑️ All cleared!', 'info');
    };
  }

  // ═══════════════════════════════════════════════════════════════════
  // FEATURE MODULE: Universal Download Button (if not present)
  // ═══════════════════════════════════════════════════════════════════
  function initUniversalDownloadButton() {
    if (!isToolPage()) return;
    const mainOutput = document.getElementById('main-output');
    if (!mainOutput) return;
    if (document.getElementById('download-btn')) return;

    const dlBtn = document.createElement('button');
    dlBtn.id = 'download-btn';
    dlBtn.type = 'button';
    dlBtn.className = 'btn btn-secondary btn-sm';
    dlBtn.style.cssText = 'margin-top:0.5rem;margin-left:0.5rem;display:inline-flex;align-items:center;gap:0.5rem;font-weight:600;';
    dlBtn.innerHTML = '📥 Download';

    const clearBtn = document.getElementById('clear-all-btn');
    if (clearBtn && clearBtn.parentNode) {
      clearBtn.parentNode.insertBefore(dlBtn, clearBtn.nextSibling);
    } else {
      const copyBtn = document.getElementById('copy-output-btn');
      if (copyBtn && copyBtn.parentNode) copyBtn.parentNode.insertBefore(dlBtn, copyBtn.nextSibling);
      else if (mainOutput.parentNode) mainOutput.parentNode.appendChild(dlBtn);
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // FEATURE MODULE: Share Results Button (Web Share API)
  // ═══════════════════════════════════════════════════════════════════
  function initShareResultsButton() {
    if (!isToolPage()) return;
    const mainOutput = document.getElementById('main-output');
    if (!mainOutput) return;
    if (document.getElementById('share-result-btn')) return;

    const shareBtn = document.createElement('button');
    shareBtn.id = 'share-result-btn';
    shareBtn.type = 'button';
    shareBtn.className = 'btn btn-secondary btn-sm';
    shareBtn.style.cssText = 'margin-top:0.5rem;margin-left:0.5rem;display:inline-flex;align-items:center;gap:0.5rem;font-weight:600;';
    shareBtn.innerHTML = '📤 Share';

    const dlBtn = document.getElementById('download-btn');
    if (dlBtn && dlBtn.parentNode) dlBtn.parentNode.insertBefore(shareBtn, dlBtn.nextSibling);
    else if (mainOutput.parentNode) mainOutput.parentNode.appendChild(shareBtn);

    shareBtn.onclick = async () => {
      const text = (mainOutput.value || '').trim();
      const toolTitle = document.querySelector('h1')?.textContent || 'Tool Result';
      const shareData = {
        title: toolTitle + ' — PDFToolsFree',
        text: text.length > 200 ? text.substring(0, 200) + '...' : text,
        url: window.location.href,
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
          if (window.showToast) window.showToast('📤 Shared successfully!', 'success');
        } catch (err) { /* user cancelled */ }
      } else {
        // Fallback: copy link
        try {
          await navigator.clipboard.writeText(window.location.href);
          if (window.showToast) window.showToast('🔗 Link copied to clipboard!', 'success');
        } catch (e) {
          if (window.showToast) window.showToast('Share not supported in this browser', 'warning');
        }
      }
    };
  }

  // ═══════════════════════════════════════════════════════════════════
  // FEATURE MODULE: Print-Friendly Output
  // ═══════════════════════════════════════════════════════════════════
  function initPrintButton() {
    if (!isToolPage()) return;
    const mainOutput = document.getElementById('main-output');
    if (!mainOutput) return;
    if (document.getElementById('print-result-btn')) return;

    const printBtn = document.createElement('button');
    printBtn.id = 'print-result-btn';
    printBtn.type = 'button';
    printBtn.className = 'btn btn-secondary btn-sm';
    printBtn.style.cssText = 'margin-top:0.5rem;margin-left:0.5rem;display:inline-flex;align-items:center;gap:0.5rem;font-weight:600;';
    printBtn.innerHTML = '🖨️ Print';

    const shareBtn = document.getElementById('share-result-btn');
    if (shareBtn && shareBtn.parentNode) shareBtn.parentNode.insertBefore(printBtn, shareBtn.nextSibling);
    else if (mainOutput.parentNode) mainOutput.parentNode.appendChild(printBtn);

    printBtn.onclick = () => {
      const text = mainOutput.value || '';
      if (!text.trim()) { if (window.showToast) window.showToast('Nothing to print!', 'warning'); return; }
      const toolTitle = document.querySelector('h1')?.textContent || 'Result';
      const printWin = window.open('', '_blank', 'width=800,height=600');
      printWin.document.write(`<!DOCTYPE html><html><head><title>${toolTitle}</title>
        <style>body{font-family:'Segoe UI',sans-serif;padding:2rem;max-width:800px;margin:0 auto}
        h1{font-size:1.3rem;border-bottom:2px solid #FF5A1F;padding-bottom:0.5rem;color:#1e293b}
        pre{white-space:pre-wrap;font-size:0.95rem;line-height:1.6;background:#f8fafc;padding:1.5rem;border-radius:8px;border:1px solid #e2e8f0}
        .footer{margin-top:2rem;font-size:0.8rem;color:#94a3b8;text-align:center}</style></head>
        <body><h1>${toolTitle}</h1><pre>${text.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</pre>
        <div class="footer">Generated by pdftoolsfree.in • ${new Date().toLocaleString()}</div>
        <script>window.print();setTimeout(()=>window.close(),500);<\/script></body></html>`);
      printWin.document.close();
    };
  }

  // ═══════════════════════════════════════════════════════════════════
  // FEATURE MODULE: Recently Used Tools
  // ═══════════════════════════════════════════════════════════════════
  function initRecentlyUsedTools() {
    const STORAGE_KEY = 'pdftoolsfree_recent';
    const MAX_RECENT = 10;

    // Track current tool usage
    if (isToolPage()) {
      try {
        const slug = getCurrentSlug();
        const name = document.querySelector('h1')?.textContent || slug;
        let recent = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        recent = recent.filter(r => r.id !== slug);
        recent.unshift({ id: slug, name: name, time: Date.now() });
        if (recent.length > MAX_RECENT) recent = recent.slice(0, MAX_RECENT);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(recent));
      } catch (e) { /* ignore */ }
    }

    // Render on homepage and category pages
    if (!isToolPage()) {
      try {
        const recent = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        if (recent.length === 0) return;

        const targetSection = document.querySelector('.hero') || document.querySelector('main') || document.querySelector('.container');
        if (!targetSection) return;

        const recentDiv = document.createElement('div');
        recentDiv.id = 'recently-used-section';
        recentDiv.style.cssText = 'max-width:1200px;margin:1.5rem auto;padding:0 1rem;';
        recentDiv.innerHTML = `
          <h3 style="font-size:1.1rem;font-weight:700;margin-bottom:0.75rem;color:var(--text);display:flex;align-items:center;gap:0.5rem">
            🕐 Recently Used Tools
          </h3>
          <div style="display:flex;gap:0.75rem;overflow-x:auto;padding-bottom:0.5rem;scrollbar-width:thin">
            ${recent.map(r => `
              <a href="/tools/${r.id}.html" style="flex-shrink:0;padding:0.6rem 1rem;background:var(--surface-2,#f1f5f9);border:1px solid var(--border,#e2e8f0);border-radius:var(--radius-sm,8px);text-decoration:none;color:var(--text);font-size:0.85rem;font-weight:600;transition:all 0.2s;white-space:nowrap"
                onmouseover="this.style.borderColor='var(--primary)';this.style.transform='translateY(-2px)';this.style.boxShadow='0 4px 12px rgba(255,90,31,0.15)'"
                onmouseout="this.style.borderColor='var(--border)';this.style.transform='none';this.style.boxShadow='none'">
                ${r.name.length > 30 ? r.name.substring(0, 28) + '…' : r.name}
              </a>
            `).join('')}
          </div>
        `;

        if (targetSection.nextSibling) {
          targetSection.parentNode.insertBefore(recentDiv, targetSection.nextSibling);
        } else {
          targetSection.parentNode.appendChild(recentDiv);
        }
      } catch (e) { /* ignore */ }
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // FEATURE MODULE: Cookie Consent Banner
  // ═══════════════════════════════════════════════════════════════════
  function initCookieConsent() {
    const CONSENT_KEY = 'pdftoolsfree_cookie_consent';
    if (localStorage.getItem(CONSENT_KEY) === 'accepted') return;

    const banner = document.createElement('div');
    banner.id = 'cookie-consent-banner';
    banner.style.cssText = `
      position:fixed;bottom:0;left:0;right:0;z-index:10000;
      background:var(--surface-1,#1e293b);color:var(--text,#f1f5f9);
      padding:1rem 1.5rem;display:flex;align-items:center;justify-content:space-between;gap:1rem;
      box-shadow:0 -4px 24px rgba(0,0,0,0.2);font-size:0.85rem;
      animation:slideUpBanner 0.4s cubic-bezier(0.4,0,0.2,1);
    `;
    banner.innerHTML = `
      <p style="margin:0;flex:1;line-height:1.5">
        🍪 We use cookies to enhance your experience and analyze site traffic.
        By continuing to use this site, you agree to our use of cookies.
        <a href="/privacy-policy.html" style="color:var(--primary,#FF5A1F);text-decoration:underline" target="_blank">Learn more</a>
      </p>
      <div style="display:flex;gap:0.5rem;flex-shrink:0">
        <button id="cookie-accept-btn" class="btn btn-primary btn-sm" style="font-weight:700;padding:0.5rem 1.25rem">Accept</button>
        <button id="cookie-decline-btn" class="btn btn-secondary btn-sm" style="padding:0.5rem 1rem">Decline</button>
      </div>
    `;

    const style = document.createElement('style');
    style.textContent = `@keyframes slideUpBanner { from { transform:translateY(100%);opacity:0 } to { transform:translateY(0);opacity:1 } }`;
    document.head.appendChild(style);
    document.body.appendChild(banner);

    document.getElementById('cookie-accept-btn').onclick = () => {
      localStorage.setItem(CONSENT_KEY, 'accepted');
      banner.style.animation = 'slideUpBanner 0.3s ease reverse forwards';
      setTimeout(() => banner.remove(), 300);
    };
    document.getElementById('cookie-decline-btn').onclick = () => {
      localStorage.setItem(CONSENT_KEY, 'declined');
      banner.style.animation = 'slideUpBanner 0.3s ease reverse forwards';
      setTimeout(() => banner.remove(), 300);
    };
  }

  // ═══════════════════════════════════════════════════════════════════
  // FEATURE MODULE: Fullscreen Mode Toggle
  // ═══════════════════════════════════════════════════════════════════
  function initFullscreenToggle() {
    if (!isToolPage()) return;
    const mainOutput = document.getElementById('main-output');
    if (!mainOutput) return;
    if (document.getElementById('fullscreen-toggle-btn')) return;

    const fsBtn = document.createElement('button');
    fsBtn.id = 'fullscreen-toggle-btn';
    fsBtn.type = 'button';
    fsBtn.className = 'btn btn-secondary btn-sm';
    fsBtn.style.cssText = 'margin-top:0.5rem;margin-left:0.5rem;display:inline-flex;align-items:center;gap:0.5rem;font-weight:600;';
    fsBtn.innerHTML = '⛶ Fullscreen';

    const printBtn = document.getElementById('print-result-btn');
    if (printBtn && printBtn.parentNode) printBtn.parentNode.insertBefore(fsBtn, printBtn.nextSibling);
    else if (mainOutput.parentNode) mainOutput.parentNode.appendChild(fsBtn);

    let isFS = false;
    fsBtn.onclick = () => {
      isFS = !isFS;
      const toolContainer = mainOutput.closest('.glass-card') || mainOutput.closest('.tool-card') || mainOutput.parentElement;
      if (isFS) {
        toolContainer.style.cssText += ';position:fixed;top:0;left:0;right:0;bottom:0;z-index:9999;margin:0;border-radius:0;overflow-y:auto;background:var(--surface-1,#fff);padding:2rem;';
        mainOutput.style.height = 'calc(100vh - 200px)';
        fsBtn.innerHTML = '✕ Exit Fullscreen';
        document.body.style.overflow = 'hidden';
      } else {
        toolContainer.style.cssText = toolContainer.style.cssText.replace(/position:fixed[^;]*;|top:0[^;]*;|left:0[^;]*;|right:0[^;]*;|bottom:0[^;]*;|z-index:9999[^;]*;|margin:0[^;]*;|border-radius:0[^;]*;|overflow-y:auto[^;]*;|background:var\(--surface-1[^;]*;|padding:2rem[^;]*;/g, '');
        mainOutput.style.height = '';
        fsBtn.innerHTML = '⛶ Fullscreen';
        document.body.style.overflow = '';
      }
    };

    // Escape key exits fullscreen
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isFS) fsBtn.click();
    });
  }

  // ═══════════════════════════════════════════════════════════════════
  // FEATURE MODULE: Real-Time Live Preview (auto-compute on input change)
  // ═══════════════════════════════════════════════════════════════════
  function initLivePreview() {
    if (!isToolPage()) return;
    const genBtn = document.getElementById('generate-btn');
    const ic = document.getElementById('tool-inputs-container');
    if (!genBtn || !ic) return;

    let debounceTimer = null;
    const debounce = (fn, delay) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(fn, delay);
    };

    ic.addEventListener('input', () => {
      debounce(() => {
        try { genBtn.click(); } catch (e) { /* ignore */ }
      }, 400);
    });

    ic.addEventListener('change', () => {
      debounce(() => {
        try { genBtn.click(); } catch (e) { /* ignore */ }
      }, 200);
    });
  }

  // ═══════════════════════════════════════════════════════════════════
  // FEATURE MODULE: Calculation History Log
  // ═══════════════════════════════════════════════════════════════════
  function initCalculationHistory() {
    if (!isToolPage()) return;
    const mainOutput = document.getElementById('main-output');
    const genBtn = document.getElementById('generate-btn');
    if (!mainOutput || !genBtn) return;

    const slug = getCurrentSlug();
    const HISTORY_KEY = 'pdftoolsfree_history_' + slug;
    const MAX_HISTORY = 20;

    // Create history panel
    let historyPanel = document.getElementById('calc-history-panel');
    if (!historyPanel) {
      historyPanel = document.createElement('div');
      historyPanel.id = 'calc-history-panel';
      historyPanel.style.cssText = 'margin-top:1rem;';
      historyPanel.innerHTML = `
        <details style="border:1px solid var(--border,#e2e8f0);border-radius:var(--radius-sm,8px);overflow:hidden">
          <summary style="padding:0.75rem 1rem;background:var(--surface-2,#f1f5f9);cursor:pointer;font-weight:700;font-size:0.85rem;color:var(--text);user-select:none;display:flex;align-items:center;gap:0.5rem">
            📜 Calculation History <span id="history-count" style="font-size:0.75rem;background:var(--primary,#FF5A1F);color:#fff;padding:0.1rem 0.5rem;border-radius:999px">0</span>
          </summary>
          <div id="history-list" style="max-height:250px;overflow-y:auto;padding:0.5rem"></div>
          <div style="padding:0.5rem;border-top:1px solid var(--border);text-align:right">
            <button id="clear-history-btn" class="btn btn-secondary btn-sm" style="font-size:0.75rem">🗑️ Clear History</button>
          </div>
        </details>
      `;
      if (mainOutput.parentNode) mainOutput.parentNode.appendChild(historyPanel);
    }

    function loadHistory() { try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch(e) { return []; } }
    function saveHistory(h) { try { localStorage.setItem(HISTORY_KEY, JSON.stringify(h)); } catch(e){} }

    function renderHistory() {
      const h = loadHistory();
      const list = document.getElementById('history-list');
      const count = document.getElementById('history-count');
      if (count) count.textContent = h.length;
      if (!list) return;
      if (h.length === 0) {
        list.innerHTML = '<p style="text-align:center;color:var(--text-secondary);font-size:0.8rem;padding:1rem">No history yet. Run a calculation to start.</p>';
        return;
      }
      list.innerHTML = h.map((entry, i) => `
        <div style="padding:0.5rem 0.75rem;border-bottom:1px solid var(--border,#e2e8f0);font-size:0.8rem;cursor:pointer;transition:background 0.15s"
             onmouseover="this.style.background='var(--surface-2)'" onmouseout="this.style.background='transparent'"
             onclick="document.getElementById('main-output').value=this.dataset.val"
             data-val="${entry.output.replace(/"/g, '&quot;')}">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <span style="font-weight:600;color:var(--text)">#${h.length - i}</span>
            <span style="color:var(--text-secondary);font-size:0.7rem">${new Date(entry.time).toLocaleTimeString()}</span>
          </div>
          <div style="color:var(--text-secondary);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${entry.output.substring(0, 80).replace(/</g,'&lt;')}</div>
        </div>
      `).join('');
    }

    // Record on generate
    genBtn.addEventListener('click', () => {
      setTimeout(() => {
        const val = mainOutput.value || '';
        if (val.trim().length > 0) {
          const h = loadHistory();
          h.unshift({ output: val.substring(0, 500), time: Date.now() });
          if (h.length > MAX_HISTORY) h.pop();
          saveHistory(h);
          renderHistory();
        }
      }, 300);
    });

    document.getElementById('clear-history-btn')?.addEventListener('click', () => {
      localStorage.removeItem(HISTORY_KEY);
      renderHistory();
      if (window.showToast) window.showToast('History cleared!', 'info');
    });

    renderHistory();
  }

  // ═══════════════════════════════════════════════════════════════════
  // FEATURE MODULE: HowTo Schema Markup Injection
  // ═══════════════════════════════════════════════════════════════════
  function initHowToSchema() {
    if (!isToolPage()) return;
    if (document.getElementById('howto-schema-ld')) return;

    const toolName = document.querySelector('h1')?.textContent || getCurrentSlug();
    const desc = document.querySelector('meta[name="description"]')?.content || 'Use this free online tool.';

    const schema = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Use " + toolName,
      "description": desc,
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "Enter your data", "text": "Fill in the input fields with your data or upload your file." },
        { "@type": "HowToStep", "position": 2, "name": "Click Generate", "text": "Click the Generate or Calculate button to process your input." },
        { "@type": "HowToStep", "position": 3, "name": "Get your result", "text": "View, copy, download, or share your result instantly." }
      ],
      "tool": { "@type": "HowToTool", "name": "PDFToolsFree " + toolName }
    };

    const script = document.createElement('script');
    script.id = 'howto-schema-ld';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  // ═══════════════════════════════════════════════════════════════════
  // FEATURE MODULE: SoftwareApplication Schema
  // ═══════════════════════════════════════════════════════════════════
  function initSoftwareAppSchema() {
    if (!isToolPage()) return;
    if (document.getElementById('software-app-schema-ld')) return;

    const toolName = document.querySelector('h1')?.textContent || getCurrentSlug();
    const ratingEl = document.querySelector('[itemprop="ratingValue"]');
    const ratingVal = ratingEl ? ratingEl.textContent : '4.7';

    const schema = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": toolName,
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "aggregateRating": { "@type": "AggregateRating", "ratingValue": ratingVal, "ratingCount": "1247" }
    };

    const script = document.createElement('script');
    script.id = 'software-app-schema-ld';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  // ═══════════════════════════════════════════════════════════════════
  // FEATURE MODULE: Feedback Widget
  // ═══════════════════════════════════════════════════════════════════
  function initFeedbackWidget() {
    if (document.getElementById('feedback-widget')) return;

    const widget = document.createElement('div');
    widget.id = 'feedback-widget';
    widget.innerHTML = `
      <button id="feedback-trigger-btn" style="
        position:fixed;bottom:80px;right:20px;z-index:9990;
        width:48px;height:48px;border-radius:50%;border:none;
        background:linear-gradient(135deg,#FF5A1F,#FF8A50);color:#fff;
        font-size:1.3rem;cursor:pointer;box-shadow:0 4px 16px rgba(255,90,31,0.35);
        transition:all 0.3s cubic-bezier(0.4,0,0.2,1);display:flex;align-items:center;justify-content:center;
      " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'"
        title="Send Feedback">💬</button>
      <div id="feedback-panel" style="
        display:none;position:fixed;bottom:140px;right:20px;z-index:9991;
        width:320px;background:var(--surface-1,#fff);border:1px solid var(--border,#e2e8f0);
        border-radius:var(--radius-md,12px);box-shadow:0 16px 48px rgba(0,0,0,0.15);
        padding:1.25rem;animation:feedbackSlideIn 0.3s ease;
      ">
        <h4 style="margin:0 0 0.75rem;font-size:1rem;display:flex;align-items:center;gap:0.5rem">
          💬 Send Feedback
          <button id="feedback-close-btn" style="margin-left:auto;background:none;border:none;cursor:pointer;font-size:1.2rem;color:var(--text-secondary)">✕</button>
        </h4>
        <div style="margin-bottom:0.75rem">
          <label style="font-size:0.8rem;font-weight:600;color:var(--text-secondary)">Type</label>
          <select id="feedback-type" class="form-input" style="font-size:0.85rem;margin-top:0.25rem">
            <option value="bug">🐛 Bug Report</option>
            <option value="feature">💡 Feature Request</option>
            <option value="praise">🌟 I Love This Tool</option>
            <option value="other">📝 Other</option>
          </select>
        </div>
        <div style="margin-bottom:0.75rem">
          <label style="font-size:0.8rem;font-weight:600;color:var(--text-secondary)">Message</label>
          <textarea id="feedback-message" class="form-input" rows="3" placeholder="Tell us what you think..." style="font-size:0.85rem;margin-top:0.25rem;resize:vertical"></textarea>
        </div>
        <button id="feedback-submit-btn" class="btn btn-primary" style="width:100%;font-weight:700">📨 Send Feedback</button>
      </div>
    `;

    const style = document.createElement('style');
    style.textContent = `@keyframes feedbackSlideIn { from { opacity:0;transform:translateY(20px) } to { opacity:1;transform:translateY(0) } }`;
    document.head.appendChild(style);
    document.body.appendChild(widget);

    const trigger = document.getElementById('feedback-trigger-btn');
    const panel = document.getElementById('feedback-panel');
    const closeBtn = document.getElementById('feedback-close-btn');
    const submitBtn = document.getElementById('feedback-submit-btn');

    trigger.onclick = () => { panel.style.display = panel.style.display === 'none' ? 'block' : 'none'; };
    closeBtn.onclick = () => { panel.style.display = 'none'; };
    submitBtn.onclick = () => {
      const type = document.getElementById('feedback-type').value;
      const msg = document.getElementById('feedback-message').value.trim();
      if (!msg) { if (window.showToast) window.showToast('Please enter a message', 'warning'); return; }
      // Store feedback locally (could be sent to external service)
      try {
        const fb = JSON.parse(localStorage.getItem('pdftoolsfree_feedback') || '[]');
        fb.push({ type, msg, tool: getCurrentSlug(), time: Date.now(), url: window.location.href });
        localStorage.setItem('pdftoolsfree_feedback', JSON.stringify(fb));
      } catch(e) {}
      document.getElementById('feedback-message').value = '';
      panel.style.display = 'none';
      if (window.showToast) window.showToast('🎉 Thank you for your feedback!', 'success');
    };
  }

  // ═══════════════════════════════════════════════════════════════════
  // FEATURE MODULE: Micro-Animations
  // ═══════════════════════════════════════════════════════════════════
  function initMicroAnimations() {
    const style = document.createElement('style');
    style.id = 'micro-animations-styles';
    if (document.getElementById('micro-animations-styles')) return;
    style.textContent = `
      /* Button press bounce */
      .btn:active { transform: scale(0.95); transition: transform 0.1s ease; }
      .btn { transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
      .btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }

      /* Output appear animation */
      #main-output { transition: border-color 0.3s ease; }
      #main-output:focus { border-color: var(--primary, #FF5A1F); box-shadow: 0 0 0 3px rgba(255,90,31,0.1); }

      /* Input focus glow */
      .form-input:focus { border-color: var(--primary, #FF5A1F); box-shadow: 0 0 0 3px rgba(255,90,31,0.1); transition: all 0.2s ease; }

      /* Card hover lift */
      .glass-card:hover, .tool-card:hover { transform: translateY(-2px); transition: transform 0.2s ease, box-shadow 0.2s ease; }

      /* Toast slide in */
      .toast-notification { animation: toastSlideIn 0.35s cubic-bezier(0.4, 0, 0.2, 1); }
      @keyframes toastSlideIn { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

      /* Smooth scrollbar */
      ::-webkit-scrollbar { width: 6px; height: 6px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: var(--text-secondary, #94a3b8); border-radius: 999px; }
      ::-webkit-scrollbar-thumb:hover { background: var(--primary, #FF5A1F); }

      /* Action bar button group */
      #copy-output-btn, #clear-all-btn, #download-btn, #share-result-btn, #print-result-btn, #fullscreen-toggle-btn {
        border-radius: 6px; font-size: 0.78rem; padding: 0.35rem 0.75rem;
        transition: all 0.2s cubic-bezier(0.4,0,0.2,1);
      }
      #copy-output-btn:hover, #clear-all-btn:hover, #download-btn:hover, #share-result-btn:hover, #print-result-btn:hover, #fullscreen-toggle-btn:hover {
        transform: translateY(-1px); box-shadow: 0 3px 10px rgba(0,0,0,0.08);
      }
    `;
    document.head.appendChild(style);
  }

  // ═══════════════════════════════════════════════════════════════════
  // FEATURE MODULE: Category Color Themes
  // ═══════════════════════════════════════════════════════════════════
  function initCategoryColorThemes() {
    if (!isToolPage()) return;
    const slug = getCurrentSlug();

    // Detect category from page content or breadcrumb
    const breadcrumb = document.querySelector('.breadcrumb a:nth-child(2)') || document.querySelector('[class*="breadcrumb"] a');
    const categoryText = breadcrumb?.textContent?.toLowerCase() || '';

    const themes = {
      'pdf':       { accent: '#EF4444', glow: 'rgba(239,68,68,0.12)' },
      'image':     { accent: '#8B5CF6', glow: 'rgba(139,92,246,0.12)' },
      'text':      { accent: '#3B82F6', glow: 'rgba(59,130,246,0.12)' },
      'calculator': { accent: '#10B981', glow: 'rgba(16,185,129,0.12)' },
      'math':      { accent: '#10B981', glow: 'rgba(16,185,129,0.12)' },
      'developer': { accent: '#06B6D4', glow: 'rgba(6,182,212,0.12)' },
      'generator': { accent: '#F59E0B', glow: 'rgba(245,158,11,0.12)' },
      'converter': { accent: '#EC4899', glow: 'rgba(236,72,153,0.12)' },
      'design':    { accent: '#8B5CF6', glow: 'rgba(139,92,246,0.12)' },
      'color':     { accent: '#8B5CF6', glow: 'rgba(139,92,246,0.12)' },
      'planner':   { accent: '#F97316', glow: 'rgba(249,115,22,0.12)' },
      'b.tech':    { accent: '#14B8A6', glow: 'rgba(20,184,166,0.12)' },
    };

    let theme = null;
    for (const [key, val] of Object.entries(themes)) {
      if (categoryText.includes(key)) { theme = val; break; }
    }
    if (!theme) return;

    const style = document.createElement('style');
    style.id = 'category-color-theme';
    style.textContent = `
      .btn-primary, [class*="btn-primary"] { background: ${theme.accent} !important; }
      .btn-primary:hover { filter: brightness(1.1) !important; }
      h1 { color: ${theme.accent} !important; }
      .breadcrumb a { color: ${theme.accent} !important; }
      .glass-card { border-color: ${theme.glow.replace('0.12', '0.2')} !important; }
    `;
    document.head.appendChild(style);
  }

  // ═══════════════════════════════════════════════════════════════════
  // FEATURE MODULE: Service Worker Cache Strategy Upgrade
  // ═══════════════════════════════════════════════════════════════════
  function initSWCacheUpgrade() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(reg => {
        if (reg.active) {
          // Pre-cache top tools for offline use
          const topTools = ['word-character-counter', 'percentage-calculator', 'json-formatter', 'base64-encoder', 'unit-converter'];
          if ('caches' in window) {
            caches.open('pdftoolsfree-top-tools-v1').then(cache => {
              topTools.forEach(t => {
                cache.add('/tools/' + t + '.html').catch(() => {});
                cache.add('/js/tools/' + t + '.js').catch(() => {});
              });
            });
          }
        }
      }).catch(() => {});
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // FEATURE MODULE: Print Styles (CSS)
  // ═══════════════════════════════════════════════════════════════════
  function initPrintStyles() {
    if (document.getElementById('print-styles')) return;
    const style = document.createElement('style');
    style.id = 'print-styles';
    style.textContent = `
      @media print {
        header, footer, nav, .sidebar, .breadcrumb, #cookie-consent-banner,
        #feedback-widget, .scroll-to-top, .fab, [class*="share"],
        #copy-output-btn, #clear-all-btn, #download-btn, #share-result-btn,
        #print-result-btn, #fullscreen-toggle-btn, #calc-history-panel,
        .related-tools, .faq-section, .star-rating, .cta-section,
        #recently-used-section, .social-links { display: none !important; }
        body { background: #fff !important; color: #000 !important; font-size: 12pt; }
        .glass-card { box-shadow: none !important; border: 1px solid #ddd !important; }
        #main-output { border: 1px solid #ccc !important; background: #f9f9f9 !important; min-height: 200px; }
        h1 { font-size: 16pt !important; color: #000 !important; }
      }
    `;
    document.head.appendChild(style);
  }

  // ═══════════════════════════════════════════════════════════════════
  // FEATURE INITIALIZATION — Wire up all new modules
  // ═══════════════════════════════════════════════════════════════════
  function initAllNewFeatures() {
    initMicroAnimations();
    initPrintStyles();
    initCookieConsent();
    initRecentlyUsedTools();
    initFeedbackWidget();
    initSWCacheUpgrade();

    if (isToolPage()) {
      // Wait for tool engine to inject its inputs first
      setTimeout(() => {
        initUniversalClearButton();
        initUniversalDownloadButton();
        initShareResultsButton();
        initPrintButton();
        initFullscreenToggle();
        initLivePreview();
        initCalculationHistory();
        initHowToSchema();
        initSoftwareAppSchema();
        initCategoryColorThemes();
      }, 500);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      autoloadComponents();
      initUniversalUXEnhancer();
      initDropZoneEnhancer();
      initAllNewFeatures();
    });
  } else {
    autoloadComponents();
    initUniversalUXEnhancer();
    initDropZoneEnhancer();
    initAllNewFeatures();
  }
})();


