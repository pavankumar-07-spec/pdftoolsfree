/**
 * FreeToolsPDF Global Instant Search System
 * Handles Ctrl+K / ⌘K hotkey, search modal injection, fuzzy filtering & keyboard navigation
 */
document.addEventListener('DOMContentLoaded', () => {
  // Inject Search Modal HTML Shell into Body
  const modalHTML = `
    <div id="global-search-modal" class="search-modal-backdrop" aria-hidden="true" style="display:none;position:fixed;inset:0;z-index:9999;background:rgba(15,23,42,0.6);backdrop-filter:blur(8px);align-items:flex-start;justify-content:center;padding:4rem 1rem 1rem;">
      <div class="search-modal-card" style="width:100%;max-width:640px;background:var(--surface-1, #ffffff);border:1px solid var(--border, #e2e8f0);border-radius:16px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);overflow:hidden;display:flex;flex-direction:column;max-height:80vh;">
        
        <!-- Search Input Bar -->
        <div style="display:flex;align-items:center;padding:1rem 1.25rem;border-bottom:1px solid var(--border, #e2e8f0);gap:0.75rem;">
          <span style="font-size:1.25rem;color:var(--text-muted, #94a3b8);">🔍</span>
          <input type="text" id="global-search-input" placeholder="Search 407+ free PDF, math & dev tools... (Esc to close)" autocomplete="off" style="width:100%;border:none;background:transparent;font-size:1.1rem;color:var(--text, #0f172a);outline:none;">
          <kbd style="font-family:monospace;font-size:0.75rem;padding:0.2rem 0.5rem;background:var(--surface-2, #f1f5f9);border-radius:6px;color:var(--text-muted, #64748b);">ESC</kbd>
        </div>

        <!-- Category Filter Chips -->
        <div style="display:flex;gap:0.5rem;padding:0.75rem 1.25rem;overflow-x:auto;border-bottom:1px solid var(--border, #e2e8f0);background:var(--surface-2, #f8fafc);">
          <button class="search-cat-chip active" data-cat="all" style="padding:0.25rem 0.75rem;border-radius:20px;font-size:0.8rem;font-weight:600;border:1px solid var(--border);background:var(--accent, #FF5A1F);color:#fff;cursor:pointer;">All Tools</button>
          <button class="search-cat-chip" data-cat="pdf" style="padding:0.25rem 0.75rem;border-radius:20px;font-size:0.8rem;font-weight:600;border:1px solid var(--border);background:transparent;color:var(--text);cursor:pointer;">📄 PDF</button>
          <button class="search-cat-chip" data-cat="calc" style="padding:0.25rem 0.75rem;border-radius:20px;font-size:0.8rem;font-weight:600;border:1px solid var(--border);background:transparent;color:var(--text);cursor:pointer;">🧮 Math</button>
          <button class="search-cat-chip" data-cat="image" style="padding:0.25rem 0.75rem;border-radius:20px;font-size:0.8rem;font-weight:600;border:1px solid var(--border);background:transparent;color:var(--text);cursor:pointer;">🖼️ Image</button>
          <button class="search-cat-chip" data-cat="dev" style="padding:0.25rem 0.75rem;border-radius:20px;font-size:0.8rem;font-weight:600;border:1px solid var(--border);background:transparent;color:var(--text);cursor:pointer;">💻 Dev</button>
        </div>

        <!-- Search Results List -->
        <div id="global-search-results" style="overflow-y:auto;padding:0.5rem;display:flex;flex-direction:column;gap:0.25rem;min-height:200px;">
          <!-- Items injected via JS -->
        </div>

        <!-- Search Footer -->
        <div style="display:flex;justify-content:space-between;align-items:center;padding:0.75rem 1.25rem;border-top:1px solid var(--border, #e2e8f0);font-size:0.75rem;color:var(--text-muted, #64748b);background:var(--surface-2, #f8fafc);">
          <span>Use <strong>↑</strong> <strong>↓</strong> to navigate, <strong>↵</strong> to select</span>
          <span id="search-results-count">407 Tools Available</span>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  const modal = document.getElementById('global-search-modal');
  const input = document.getElementById('global-search-input');
  const resultsContainer = document.getElementById('global-search-results');
  const countEl = document.getElementById('search-results-count');
  const chips = document.querySelectorAll('.search-cat-chip');

  let activeCategory = 'all';
  let selectedIndex = 0;
  let currentResults = [];

  let worker = null;
  try {
    const pathPrefix = window.location.pathname.includes('/tools/') || window.location.pathname.includes('/categories/') ? '../' : '/';
    worker = new Worker(`${pathPrefix}js/workers/search-worker.js`);
    worker.postMessage({ type: 'INIT', pathPrefix });
    worker.onmessage = (e) => {
      if (e.data.type === 'SEARCH_RESULTS') {
        currentResults = e.data.results;
        renderSearchResultsDOM();
      }
    };
  } catch (err) {
    console.warn('[SearchModal] Web Worker fallback to main thread:', err);
  }

  function openModal() {
    if (modal) {
      modal.style.display = 'flex';
      modal.setAttribute('aria-hidden', 'false');
      if (input) {
        input.value = '';
        input.focus();
      }
      renderResults('');
    }
  }

  function closeModal() {
    if (modal) {
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  // Hotkey Listener (Ctrl+K or ⌘K, Escape)
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      if (modal.style.display === 'flex') closeModal();
      else openModal();
    } else if (e.key === 'Escape' && modal.style.display === 'flex') {
      closeModal();
    }
  });

  // Close on Backdrop Click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Filter Chips Logic
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => {
        c.style.background = 'transparent';
        c.style.color = 'var(--text)';
        c.classList.remove('active');
      });
      chip.style.background = 'var(--accent, #FF5A1F)';
      chip.style.color = '#fff';
      chip.classList.add('active');
      activeCategory = chip.getAttribute('data-cat');
      renderResults(input ? input.value : '');
    });
  });

  function getSearchIndex() {
    return window.FREE_TOOLS_SEARCH_INDEX || [];
  }


  function renderResults(query) {
    if (worker) {
      worker.postMessage({ type: 'SEARCH', query, activeCategory });
    } else {
      const index = getSearchIndex();
      const q = query.toLowerCase().trim();
      currentResults = index.filter(item => {
        const matchCat = activeCategory === 'all' || item.categorySlug === activeCategory;
        if (!matchCat) return false;
        if (!q) return true;
        return item.title.toLowerCase().includes(q) ||
               item.slug.toLowerCase().includes(q) ||
               item.description.toLowerCase().includes(q);
      }).slice(0, 30);
      renderSearchResultsDOM();
    }
  }

  function renderSearchResultsDOM() {
    selectedIndex = 0;
    countEl.textContent = `${currentResults.length} Result(s)`;

    if (currentResults.length === 0) {
      resultsContainer.innerHTML = `
        <div style="padding:2rem;text-align:center;color:var(--text-muted, #64748b);">
          <p style="font-size:1.5rem;margin-bottom:0.5rem;">🔍 No matching tools found</p>
          <p style="font-size:0.875rem;">Try searching for "PDF", "Calculator", "JSON", "B.Tech", or "Convert"</p>
        </div>
      `;
      return;
    }


    resultsContainer.innerHTML = currentResults.map((item, idx) => `
      <a href="${item.url}" class="search-result-item ${idx === selectedIndex ? 'selected' : ''}" style="display:flex;align-items:center;justify-content:space-between;padding:0.75rem 1rem;border-radius:10px;text-decoration:none;color:var(--text);background:${idx === selectedIndex ? 'var(--surface-2, #f1f5f9)' : 'transparent'};transition:background 0.15s ease;">
        <div>
          <div style="font-weight:600;font-size:0.95rem;color:var(--text, #0f172a);">${item.title}</div>
          <div style="font-size:0.8rem;color:var(--text-muted, #64748b);margin-top:2px;">${item.description.slice(0, 75)}...</div>
        </div>
        <span style="font-size:0.75rem;font-weight:600;padding:0.2rem 0.5rem;border-radius:6px;background:rgba(255,90,31,0.1);color:var(--accent, #FF5A1F);">${item.category}</span>
      </a>
    `).join('');

    // Bind Hover Selection
    const itemsEl = resultsContainer.querySelectorAll('.search-result-item');
    itemsEl.forEach((el, idx) => {
      el.addEventListener('mouseenter', () => {
        itemsEl.forEach(i => i.style.background = 'transparent');
        el.style.background = 'var(--surface-2, #f1f5f9)';
        selectedIndex = idx;
      });
    });
  }

  // Input Event
  input.addEventListener('input', (e) => renderResults(e.target.value));

  // Keyboard Arrow Navigation (Up, Down, Enter)
  input.addEventListener('keydown', (e) => {
    const items = resultsContainer.querySelectorAll('.search-result-item');
    if (items.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = (selectedIndex + 1) % items.length;
      updateSelection(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = (selectedIndex - 1 + items.length) % items.length;
      updateSelection(items);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (currentResults[selectedIndex]) {
        window.location.href = currentResults[selectedIndex].url;
      }
    }
  });

  function updateSelection(items) {
    items.forEach((item, idx) => {
      if (idx === selectedIndex) {
        item.style.background = 'var(--surface-2, #f1f5f9)';
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.style.background = 'transparent';
      }
    });
  }

  // Bind any existing header search buttons to trigger modal
  document.querySelectorAll('.search-input, .nav-search-btn, [data-action="open-search"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });
});
