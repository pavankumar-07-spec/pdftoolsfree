/**
 * Session Recent History Drawer Component
 * Auto-saves recent calculation summaries & exports to localStorage with 1-click restore.
 */
(function() {
  'use strict';

  const STORAGE_KEY = 'ft-recent-history';

  function getHistory() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveHistory(item) {
    let list = getHistory();
    list = list.filter(h => h.url !== item.url || h.title !== item.title);
    list.unshift(item);
    if (list.length > 20) list = list.slice(0, 20);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {}
  }

  function recordCurrentTool() {
    const title = document.title.split('-')[0].trim() || 'Tool';
    const url = window.location.pathname;
    if (url && url.startsWith('/tools/')) {
      saveHistory({
        title: title,
        url: url,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }
  }

  function buildHistoryDrawer() {
    if (document.getElementById('history-drawer-wrap')) return;

    // 1. Floating Action Trigger Button
    const fab = document.createElement('button');
    fab.id = 'history-fab-btn';
    fab.setAttribute('aria-label', 'Open recent activity history');
    fab.style.cssText = `
      position: fixed; bottom: 20px; right: 20px; z-index: 9999;
      background: var(--surface-2, #1e293b); color: var(--text-primary, #f8fafc);
      border: 1px solid var(--border, #334155); padding: 0.6rem 1rem;
      border-radius: 30px; font-weight: 700; font-size: 0.85rem;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4); cursor: pointer;
      display: flex; align-items: center; gap: 0.5rem; transition: transform 0.15s ease;
    `;
    fab.innerHTML = `<span>🕒</span><span>History</span>`;
    fab.addEventListener('click', toggleDrawer);
    document.body.appendChild(fab);

    // 2. Slide-out Drawer Panel
    const wrap = document.createElement('div');
    wrap.id = 'history-drawer-wrap';
    wrap.style.cssText = `
      position: fixed; inset: 0; z-index: 99999; display: none;
      background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px);
    `;

    const panel = document.createElement('div');
    panel.style.cssText = `
      position: absolute; top: 0; right: 0; bottom: 0; width: 340px; max-width: 85vw;
      background: var(--surface-1, #1e293b); border-left: 1px solid var(--border, #334155);
      box-shadow: -10px 0 25px rgba(0, 0, 0, 0.5); display: flex; flex-direction: column;
    `;

    panel.innerHTML = `
      <div style="padding:1rem 1.25rem;border-bottom:1px solid var(--border,#334155);display:flex;align-items:center;justify-content:space-between">
        <h3 style="font-size:1rem;font-weight:800;margin:0;display:flex;align-items:center;gap:0.5rem">🕒 Recent Activity</h3>
        <button id="close-history-btn" style="background:transparent;border:none;color:var(--text-secondary,#94a3b8);font-size:1.2rem;cursor:pointer">&times;</button>
      </div>
      <div id="history-items-list" style="flex:1;overflow-y:auto;padding:1rem;display:flex;flex-direction:column;gap:0.5rem"></div>
      <div style="padding:0.75rem 1.25rem;border-top:1px solid var(--border,#334155);text-align:right">
        <button id="clear-history-btn" class="btn btn-ghost btn-sm" style="font-size:0.75rem;color:#ef4444">Clear History</button>
      </div>
    `;

    wrap.appendChild(panel);
    document.body.appendChild(wrap);

    function renderHistoryItems() {
      const list = getHistory();
      const container = panel.querySelector('#history-items-list');
      if (list.length === 0) {
        container.innerHTML = '<div style="text-align:center;color:var(--text-secondary,#94a3b8);font-size:0.85rem;padding:2rem 0">No recent activity recorded yet.</div>';
        return;
      }

      let html = '';
      list.forEach(item => {
        html += `
          <a href="${item.url}" style="display:flex;align-items:center;justify-content:space-between;padding:0.75rem;background:var(--surface-2,#0f172a);border:1px solid var(--border,#334155);border-radius:8px;text-decoration:none;color:inherit;transition:border-color 0.15s ease">
            <div>
              <div style="font-weight:700;font-size:0.85rem">${item.title}</div>
              <div style="font-size:0.7rem;color:var(--text-secondary,#94a3b8)">${item.time}</div>
            </div>
            <span style="font-size:0.8rem;color:var(--primary,#ff5a1f)">&rarr;</span>
          </a>
        `;
      });
      container.innerHTML = html;
    }

    function toggleDrawer() {
      const isOpen = wrap.style.display === 'block';
      if (isOpen) {
        wrap.style.display = 'none';
      } else {
        renderHistoryItems();
        wrap.style.display = 'block';
        if (window.triggerHaptic) window.triggerHaptic(15);
      }
    }

    wrap.querySelector('#close-history-btn').addEventListener('click', toggleDrawer);
    wrap.querySelector('#clear-history-btn').addEventListener('click', () => {
      localStorage.removeItem(STORAGE_KEY);
      renderHistoryItems();
      if (window.showToast) window.showToast('History cleared!', 'info');
    });

    wrap.addEventListener('click', (e) => {
      if (e.target === wrap) toggleDrawer();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      recordCurrentTool();
      buildHistoryDrawer();
    });
  } else {
    recordCurrentTool();
    buildHistoryDrawer();
  }
})();
