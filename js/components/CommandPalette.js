/**
 * Global Command Palette (Ctrl+K / Cmd+K / Slash)
 * Instant modal search across all 515 tools with full keyboard navigation.
 */
(function() {
  'use strict';

  function createCommandPalette() {
    if (document.getElementById('cmd-palette-backdrop')) return;

    const backdrop = document.createElement('div');
    backdrop.id = 'cmd-palette-backdrop';
    backdrop.style.cssText = `
      position: fixed; inset: 0; z-index: 99999;
      background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(8px);
      display: none; align-items: flex-start; justify-content: center;
      padding-top: 10vh; animation: fadeIn 0.15s ease-out;
    `;

    const modal = document.createElement('div');
    modal.style.cssText = `
      background: var(--surface-1, #1e293b); color: var(--text-primary, #f8fafc);
      width: 90%; max-width: 650px; border-radius: 12px;
      border: 1px solid var(--border, #334155); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      overflow: hidden; display: flex; flex-direction: column;
    `;

    modal.innerHTML = `
      <div style="display:flex;align-items:center;padding:0.85rem 1.25rem;border-bottom:1px solid var(--border,#334155);gap:0.75rem">
        <span style="font-size:1.2rem;opacity:0.7">🔍</span>
        <input type="text" id="cmd-input" placeholder="Type a tool name or command... (e.g. Merge PDF, CGPA, Resistor)" style="flex:1;background:transparent;border:none;outline:none;color:inherit;font-size:1rem;font-weight:500;">
        <span style="font-size:0.75rem;background:var(--surface-2,#0f172a);padding:2px 8px;border-radius:4px;border:1px solid var(--border,#334155);color:var(--text-secondary,#94a3b8)">ESC</span>
      </div>
      <div id="cmd-results" style="max-height:380px;overflow-y:auto;padding:0.5rem"></div>
      <div style="display:flex;align-items:center;justify-content:space-between;padding:0.6rem 1.25rem;background:var(--surface-2,#0f172a);border-top:1px solid var(--border,#334155);font-size:0.75rem;color:var(--text-secondary,#94a3b8)">
        <span>Use <kbd>↑</kbd> <kbd>↓</kbd> to navigate</span>
        <span>Press <kbd>↵</kbd> to select</span>
      </div>
    `;

    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);

    const input = modal.querySelector('#cmd-input');
    const resultsContainer = modal.querySelector('#cmd-results');
    let activeIndex = -1;

    function getTools() {
      if (window.SEARCH_INDEX) return window.SEARCH_INDEX;
      return [];
    }

    function renderResults(query) {
      const q = (query || '').toLowerCase().trim();
      const tools = getTools();
      const filtered = q === '' 
        ? tools.slice(0, 8) 
        : tools.filter(t => t.name.toLowerCase().includes(q) || (t.desc && t.desc.toLowerCase().includes(q)) || (t.cat && t.cat.toLowerCase().includes(q))).slice(0, 15);

      if (filtered.length === 0) {
        resultsContainer.innerHTML = '<div style="padding:1.5rem;text-align:center;color:var(--text-secondary,#94a3b8)">No tools found matching your query.</div>';
        activeIndex = -1;
        return;
      }

      let html = '';
      filtered.forEach((t, idx) => {
        html += `
          <div class="cmd-item" data-url="${t.url}" data-idx="${idx}" style="display:flex;align-items:center;justify-content:space-between;padding:0.75rem 1rem;border-radius:8px;cursor:pointer;margin-bottom:2px;transition:background 0.1s ease">
            <div style="display:flex;align-items:center;gap:0.75rem">
              <span style="font-size:1.2rem">${t.icon || '🛠️'}</span>
              <div>
                <div style="font-weight:700;font-size:0.92rem">${t.name}</div>
                <div style="font-size:0.75rem;color:var(--text-secondary,#94a3b8);line-height:1.2">${(t.desc || '').slice(0, 60)}</div>
              </div>
            </div>
            <span style="font-size:0.7rem;background:rgba(255,90,31,0.15);color:var(--primary,#ff5a1f);padding:2px 8px;border-radius:12px;font-weight:600">${t.cat || 'Tool'}</span>
          </div>
        `;
      });

      resultsContainer.innerHTML = html;
      activeIndex = 0;
      updateActiveItem();

      // Click event
      resultsContainer.querySelectorAll('.cmd-item').forEach(item => {
        item.addEventListener('click', function() {
          const url = this.getAttribute('data-url');
          if (url) window.location.href = url;
        });
      });
    }

    function updateActiveItem() {
      const items = resultsContainer.querySelectorAll('.cmd-item');
      items.forEach((item, idx) => {
        if (idx === activeIndex) {
          item.style.background = 'var(--primary, #ff5a1f)';
          item.style.color = '#ffffff';
          item.querySelectorAll('*').forEach(c => c.style.color = '#ffffff');
          item.scrollIntoView({ block: 'nearest' });
        } else {
          item.style.background = 'transparent';
          item.style.color = 'var(--text-primary, #f8fafc)';
          const desc = item.querySelector('div > div:last-child');
          if (desc) desc.style.color = 'var(--text-secondary, #94a3b8)';
        }
      });
    }

    function openPalette() {
      backdrop.style.display = 'flex';
      input.value = '';
      renderResults('');
      setTimeout(() => input.focus(), 50);
      if (window.triggerHaptic) window.triggerHaptic(15);
    }

    function closePalette() {
      backdrop.style.display = 'none';
    }

    // Keyboard events in Palette
    input.addEventListener('input', (e) => renderResults(e.target.value));

    modal.addEventListener('keydown', (e) => {
      const items = resultsContainer.querySelectorAll('.cmd-item');
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (items.length > 0) {
          activeIndex = (activeIndex + 1) % items.length;
          updateActiveItem();
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (items.length > 0) {
          activeIndex = (activeIndex - 1 + items.length) % items.length;
          updateActiveItem();
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (items[activeIndex]) {
          const url = items[activeIndex].getAttribute('data-url');
          if (url) window.location.href = url;
        }
      } else if (e.key === 'Escape') {
        closePalette();
      }
    });

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closePalette();
    });

    // Global Key Listener for Ctrl+K, Cmd+K, or Slash /
    window.addEventListener('keydown', (e) => {
      const activeEl = document.activeElement;
      const isInputting = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable);

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (backdrop.style.display === 'flex') closePalette();
        else openPalette();
      } else if (e.key === '/' && !isInputting) {
        e.preventDefault();
        openPalette();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createCommandPalette);
  } else {
    createCommandPalette();
  }
})();
