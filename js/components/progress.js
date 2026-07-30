/* Simple progress UI component. Exposes ProgressBar.show(id) and .update(id, pct) and .hide(id) */
(function (global) {
  function ensureRoot() {
    let root = document.getElementById('worker-progress-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'worker-progress-root';
      root.style.position = 'fixed';
      root.style.left = '50%';
      root.style.transform = 'translateX(-50%)';
      root.style.bottom = '20px';
      root.style.zIndex = 9999;
      document.body.appendChild(root);
    }
    return root;
  }

  function show(id, label) {
    const root = ensureRoot();
    if (document.getElementById('progress-' + id)) return;
    const container = document.createElement('div');
    container.id = 'progress-' + id;
    container.style.minWidth = '280px';
    container.style.background = 'rgba(0,0,0,0.6)';
    container.style.color = '#fff';
    container.style.padding = '8px 12px';
    container.style.borderRadius = '8px';
    container.style.boxShadow = '0 6px 18px rgba(0,0,0,0.3)';
    container.innerHTML = `<div style="font-size:0.9rem;margin-bottom:6px">${label||'Processing...'}</div><div style="background:rgba(255,255,255,0.12);height:8px;border-radius:6px;overflow:hidden"><div class="bar" style="width:0%;height:100%;background:linear-gradient(90deg,#4f46e5,#06b6d4)"></div></div>`;
    root.appendChild(container);
  }

  function update(id, pct) {
    const el = document.querySelector('#progress-' + id + ' .bar');
    if (el) el.style.width = Math.max(0, Math.min(100, pct)) + '%';
  }

  function hide(id) {
    const node = document.getElementById('progress-' + id);
    if (node && node.parentNode) node.parentNode.removeChild(node);
  }

  global.ProgressBar = { show, update, hide };
})(window);
