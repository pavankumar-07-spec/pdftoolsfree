/**
 * FreeToolsPDF — Smart Command Palette (Ctrl + K) & Workflow Assistant
 * Advanced fuzzy search, quick actions, category filtering & keyboard navigation.
 */
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('global-command-palette')) return;

  const paletteHTML = `
    <div id="global-command-palette" class="cmd-palette-backdrop" aria-hidden="true" style="display:none;position:fixed;inset:0;z-index:9999;background:rgba(15,23,42,0.65);backdrop-filter:blur(12px);align-items:flex-start;justify-content:center;padding:4rem 1rem 1rem;">
      <div class="cmd-palette-card" style="width:100%;max-width:680px;background:var(--surface-1, #0F172A);border:1px solid rgba(255,255,255,0.12);border-radius:18px;box-shadow:0 30px 60px -15px rgba(0,0,0,0.5);overflow:hidden;display:flex;flex-direction:column;max-height:82vh;color:var(--text, #F8FAFC);">
        
        <!-- Command Header & Input -->
        <div style="display:flex;align-items:center;padding:1.1rem 1.35rem;border-bottom:1px solid rgba(255,255,255,0.08);gap:0.85rem;background:rgba(255,255,255,0.02);">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF5A1F" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" id="cmd-palette-input" placeholder="Type a command or tool name... (e.g., 'compress pdf', 'b.tech', 'json')" autocomplete="off" style="width:100%;border:none;background:transparent;font-size:1.15rem;color:#F8FAFC;outline:none;">
          <kbd style="font-family:monospace;font-size:0.75rem;padding:0.25rem 0.55rem;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);border-radius:6px;color:#94A3B8;">ESC</kbd>
        </div>

        <!-- Quick Action & Filter Bar -->
        <div style="display:flex;gap:0.4rem;padding:0.65rem 1.25rem;overflow-x:auto;border-bottom:1px solid rgba(255,255,255,0.06);background:rgba(0,0,0,0.15);">
          <button class="cmd-chip active" data-cat="all" style="padding:0.25rem 0.8rem;border-radius:20px;font-size:0.78rem;font-weight:600;border:1px solid transparent;background:#FF5A1F;color:#FFF;cursor:pointer;">All Tools</button>
          <button class="cmd-chip" data-cat="pdf" style="padding:0.25rem 0.8rem;border-radius:20px;font-size:0.78rem;font-weight:600;border:1px solid rgba(255,255,255,0.1);background:transparent;color:#94A3B8;cursor:pointer;">📄 PDF</button>
          <button class="cmd-chip" data-cat="calc" style="padding:0.25rem 0.8rem;border-radius:20px;font-size:0.78rem;font-weight:600;border:1px solid rgba(255,255,255,0.1);background:transparent;color:#94A3B8;cursor:pointer;">🧮 Math & Calc</button>
          <button class="cmd-chip" data-cat="image" style="padding:0.25rem 0.8rem;border-radius:20px;font-size:0.78rem;font-weight:600;border:1px solid rgba(255,255,255,0.1);background:transparent;color:#94A3B8;cursor:pointer;">🖼️ Image</button>
          <button class="cmd-chip" data-cat="dev" style="padding:0.25rem 0.8rem;border-radius:20px;font-size:0.78rem;font-weight:600;border:1px solid rgba(255,255,255,0.1);background:transparent;color:#94A3B8;cursor:pointer;">💻 Dev Tools</button>
          <button class="cmd-chip" data-cat="text" style="padding:0.25rem 0.8rem;border-radius:20px;font-size:0.78rem;font-weight:600;border:1px solid rgba(255,255,255,0.1);background:transparent;color:#94A3B8;cursor:pointer;">📝 Text</button>
        </div>

        <!-- Results List -->
        <div id="cmd-palette-results" style="overflow-y:auto;padding:0.6rem;display:flex;flex-direction:column;gap:0.3rem;min-height:220px;">
        </div>

        <!-- Palette Footer -->
        <div style="display:flex;justify-content:space-between;align-items:center;padding:0.75rem 1.25rem;border-top:1px solid rgba(255,255,255,0.08);font-size:0.75rem;color:#94A3B8;background:rgba(0,0,0,0.2);">
          <div style="display:flex;gap:1rem;align-items:center;">
            <span><kbd style="padding:0.15rem 0.35rem;background:rgba(255,255,255,0.1);border-radius:4px;">↑</kbd> <kbd style="padding:0.15rem 0.35rem;background:rgba(255,255,255,0.1);border-radius:4px;">↓</kbd> Navigate</span>
            <span><kbd style="padding:0.15rem 0.35rem;background:rgba(255,255,255,0.1);border-radius:4px;">↵</kbd> Open</span>
          </div>
          <span style="display:flex;align-items:center;gap:0.35rem;color:#10B981;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            100% In-Browser Private
          </span>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', paletteHTML);

  const palette = document.getElementById('global-command-palette');
  const input = document.getElementById('cmd-palette-input');
  const resultsContainer = document.getElementById('cmd-palette-results');
  const chips = document.querySelectorAll('.cmd-chip');

  let activeCategory = 'all';
  let selectedIndex = 0;
  let currentResults = [];

  function getSearchIndex() {
    return window.FREE_TOOLS_SEARCH_INDEX || [];
  }

  function openPalette() {
    if (!palette) return;
    palette.style.display = 'flex';
    palette.setAttribute('aria-hidden', 'false');
    if (input) {
      input.value = '';
      input.focus();
    }
    renderResults('');
  }

  function closePalette() {
    if (!palette) return;
    palette.style.display = 'none';
    palette.setAttribute('aria-hidden', 'true');
  }

  // Key Listener for Ctrl+K / Cmd+K / ESC
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      if (palette.style.display === 'flex') closePalette();
      else openPalette();
    } else if (e.key === 'Escape' && palette.style.display === 'flex') {
      closePalette();
    }
  });

  palette.addEventListener('click', (e) => {
    if (e.target === palette) closePalette();
  });

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => {
        c.style.background = 'transparent';
        c.style.color = '#94A3B8';
        c.style.borderColor = 'rgba(255,255,255,0.1)';
        c.classList.remove('active');
      });
      chip.style.background = '#FF5A1F';
      chip.style.color = '#FFF';
      chip.style.borderColor = 'transparent';
      chip.classList.add('active');
      activeCategory = chip.getAttribute('data-cat');
      renderResults(input.value);
    });
  });

  function renderResults(query) {
    const index = getSearchIndex();
    const q = query.toLowerCase().trim();

    currentResults = index.filter(item => {
      const matchCat = activeCategory === 'all' || item.categorySlug === activeCategory;
      if (!matchCat) return false;
      if (!q) return true;
      return item.title.toLowerCase().includes(q) ||
             item.slug.toLowerCase().includes(q) ||
             item.description.toLowerCase().includes(q);
    }).slice(0, 25);

    selectedIndex = 0;

    if (currentResults.length === 0) {
      resultsContainer.innerHTML = `
        <div style="padding:2.5rem;text-align:center;color:#94A3B8;">
          <p style="font-size:1.5rem;margin-bottom:0.4rem;">🔍 No tools found for "${query}"</p>
          <p style="font-size:0.85rem;">Try searching for terms like "PDF", "BMI", "JSON", "Matrix", or "Word Count"</p>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = currentResults.map((item, idx) => `
      <a href="${item.url}" class="cmd-result-item ${idx === selectedIndex ? 'selected' : ''}" style="display:flex;align-items:center;justify-content:space-between;padding:0.75rem 1rem;border-radius:10px;text-decoration:none;color:#F8FAFC;background:${idx === selectedIndex ? 'rgba(255,90,31,0.15)' : 'transparent'};border:1px solid ${idx === selectedIndex ? 'rgba(255,90,31,0.3)' : 'transparent'};transition:all 0.15s ease;">
        <div style="display:flex;align-items:center;gap:0.75rem;">
          <div style="width:36px;height:36px;border-radius:8px;background:rgba(255,255,255,0.05);display:flex;align-items:center;justify-content:center;font-size:1.1rem;">
            🛠️
          </div>
          <div>
            <div style="font-weight:600;font-size:0.95rem;color:#F8FAFC;">${item.title}</div>
            <div style="font-size:0.78rem;color:#94A3B8;margin-top:2px;">${item.description.slice(0, 80)}...</div>
          </div>
        </div>
        <span style="font-size:0.72rem;font-weight:600;padding:0.25rem 0.6rem;border-radius:6px;background:rgba(255,90,31,0.12);color:#FF5A1F;border:1px solid rgba(255,90,31,0.2);">${item.category}</span>
      </a>
    `).join('');

    const itemsEl = resultsContainer.querySelectorAll('.cmd-result-item');
    itemsEl.forEach((el, idx) => {
      el.addEventListener('mouseenter', () => {
        itemsEl.forEach(i => {
          i.style.background = 'transparent';
          i.style.borderColor = 'transparent';
        });
        el.style.background = 'rgba(255,90,31,0.15)';
        el.style.borderColor = 'rgba(255,90,31,0.3)';
        selectedIndex = idx;
      });
    });
  }

  input.addEventListener('input', (e) => renderResults(e.target.value));

  input.addEventListener('keydown', (e) => {
    const items = resultsContainer.querySelectorAll('.cmd-result-item');
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
        item.style.background = 'rgba(255,90,31,0.15)';
        item.style.borderColor = 'rgba(255,90,31,0.3)';
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.style.background = 'transparent';
        item.style.borderColor = 'transparent';
      }
    });
  }

  // Bind any open search triggers
  document.querySelectorAll('.search-input, .nav-search-btn, [data-action="open-search"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openPalette();
    });
  });
});
