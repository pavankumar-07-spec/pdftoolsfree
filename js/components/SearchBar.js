class SearchBar {
  
  constructor(config = {}) {
    this.onSearch    = config.onSearch    || null;
    this.id          = config.id          || 'search-bar';
    this.placeholder = config.placeholder || 'Search 57+ free tools...';
    this.data        = config.data        || (typeof TOOLS_DATA !== 'undefined' ? TOOLS_DATA : []);
    this._element    = null;
    this._inputEl    = null;
    this._dropdown   = null;
    this._clearBtn   = null;
    this._highlighted = -1;
    this._debounceTimer = null;
    this._lastQuery   = '';
  }

  
  render() {
    const wrap = document.createElement('div');
    wrap.className = 'search-wrap';
    wrap.setAttribute('role', 'combobox');
    wrap.setAttribute('aria-expanded', 'false');
    wrap.setAttribute('aria-owns', `${this.id}-suggestions`);
    wrap.setAttribute('aria-haspopup', 'listbox');

    
    const icon = document.createElement('span');
    icon.className = 'search-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = '🔍';
    wrap.appendChild(icon);

    
    const input = document.createElement('input');
    input.type = 'search';
    input.id = this.id;
    input.name = this.id;
    input.className = 'search-input';
    input.placeholder = this.placeholder;
    input.autocomplete = 'off';
    input.autocorrect = 'off';
    input.spellcheck = false;
    input.setAttribute('aria-label', 'Search tools');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-controls', `${this.id}-suggestions`);
    this._inputEl = input;
    wrap.appendChild(input);

    
    const clearBtn = document.createElement('button');
    clearBtn.className = 'search-clear';
    clearBtn.type = 'button';
    clearBtn.setAttribute('aria-label', 'Clear search');
    clearBtn.innerHTML = '✕';
    this._clearBtn = clearBtn;
    wrap.appendChild(clearBtn);

    
    const dropdown = document.createElement('div');
    dropdown.className = 'search-suggestions';
    dropdown.id = `${this.id}-suggestions`;
    dropdown.setAttribute('role', 'listbox');
    dropdown.setAttribute('aria-label', 'Search suggestions');
    this._dropdown = dropdown;
    wrap.appendChild(dropdown);

    this._element = wrap;

    
    this._bindEvents();
    return wrap;
  }

  
  _bindEvents() {
    const input = this._inputEl;
    const clearBtn = this._clearBtn;

    
    input.addEventListener('input', () => {
      const query = input.value.trim();
      this._toggleClearBtn(query.length > 0);

      clearTimeout(this._debounceTimer);
      this._debounceTimer = setTimeout(() => {
        if (query.length >= 1) {
          this._showSuggestions(query);
        } else {
          this._hideSuggestions();
        }
      }, 180);
    });

    
    input.addEventListener('keydown', (e) => {
      const items = this._dropdown.querySelectorAll('.suggestion-item');
      if (!items.length) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          this._highlighted = Math.min(this._highlighted + 1, items.length - 1);
          this._updateHighlight(items);
          break;
        case 'ArrowUp':
          e.preventDefault();
          this._highlighted = Math.max(this._highlighted - 1, -1);
          this._updateHighlight(items);
          break;
        case 'Enter':
          e.preventDefault();
          if (this._highlighted >= 0 && items[this._highlighted]) {
            items[this._highlighted].click();
          } else {
            this._doSearch(input.value.trim());
          }
          break;
        case 'Escape':
          this._hideSuggestions();
          input.blur();
          break;
      }
    });

    
    clearBtn.addEventListener('click', () => {
      input.value = '';
      this._hideSuggestions();
      this._toggleClearBtn(false);
      input.focus();
    });

    
    document.addEventListener('click', (e) => {
      if (!this._element.contains(e.target)) {
        this._hideSuggestions();
      }
    });

    
    input.addEventListener('focus', () => {
      const query = input.value.trim();
      if (query.length >= 1) this._showSuggestions(query);
    });
  }

  
  getSuggestions(query) {
    if (!this.data || !this.data.length) return [];
    const q = query.toLowerCase().trim();
    if (!q) return [];

    return this.data
      .filter(tool =>
        tool.name.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q) ||
        (tool.tags && tool.tags.some(tag => tag.toLowerCase().includes(q))) ||
        (tool.desc && tool.desc.toLowerCase().includes(q))
      );
  }

  
  _showSuggestions(query) {
    if (query === this._lastQuery) return;
    this._lastQuery = query;

    const allMatches = this.getSuggestions(query);
    const MAX_SUGGESTIONS = 15;
    const suggestions = allMatches.slice(0, MAX_SUGGESTIONS);
    const hasMore = allMatches.length > MAX_SUGGESTIONS;

    this._dropdown.innerHTML = '';
    this._highlighted = -1;

    if (!suggestions.length) {
      this._dropdown.innerHTML = `
        <div class="search-empty">
          <div style="font-size:1.5rem;margin-bottom:0.5rem">🔍</div>
          No tools found for "<strong>${this._escHtml(query)}</strong>"<br>
          <small>Try: attendance, cgpa, pdf, marks...</small>
        </div>
      `;
      this._dropdown.classList.add('visible');
      this._element.setAttribute('aria-expanded', 'true');
      return;
    }

    
    const grouped = {};
    suggestions.forEach(tool => {
      if (!grouped[tool.category]) grouped[tool.category] = [];
      grouped[tool.category].push(tool);
    });

    Object.entries(grouped).forEach(([cat, tools]) => {
      const groupTitle = document.createElement('div');
      groupTitle.className = 'suggestion-group-title';
      groupTitle.textContent = cat;
      this._dropdown.appendChild(groupTitle);

      tools.forEach(tool => {
        const item = document.createElement('a');
        item.className = 'suggestion-item';
        item.href = tool.link || '#';
        item.setAttribute('role', 'option');
        item.setAttribute('aria-selected', 'false');
        item.innerHTML = `
          <span class="suggestion-icon" style="background:${tool.color || 'var(--primary-light)'}">${typeof getIconHtml !== 'undefined' ? getIconHtml(tool.icon) : (tool.icon || '🔧')}</span>
          <span class="suggestion-text">
            <span class="suggestion-title">${this._highlight(tool.name, query)}</span>
            <span class="suggestion-cat">${tool.category}</span>
          </span>
          <span class="suggestion-arrow">›</span>
        `;

        item.addEventListener('click', (e) => {
          if (tool.link) {
            
            window.location.href = tool.link;
          } else {
            e.preventDefault();
            this._doSearch(tool.name);
          }
        });

        this._dropdown.appendChild(item);
      });
    });

    if (hasMore) {
      const viewAllDiv = document.createElement('div');
      viewAllDiv.className = 'suggestion-view-all';
      viewAllDiv.style.cssText = 'padding: var(--space-3) var(--space-4); text-align: center; border-top: 1px solid var(--card-border); background: var(--bg-secondary); font-weight: 600; font-size: var(--text-xs);';
      viewAllDiv.innerHTML = `
        <span style="color: var(--primary)">View all ${allMatches.length} matching tools &darr;</span>
      `;
      this._dropdown.appendChild(viewAllDiv);
    }

    this._dropdown.classList.add('visible');
    this._element.setAttribute('aria-expanded', 'true');
  }

  
  _highlight(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${this._escRegex(query)})`, 'gi');
    return text.replace(regex, '<mark style="background:var(--accent-light);color:var(--text);border-radius:2px;padding:0 1px">$1</mark>');
  }

  
  _escHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  
  _escRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  
  _hideSuggestions() {
    this._dropdown.classList.remove('visible');
    this._element.setAttribute('aria-expanded', 'false');
    this._highlighted = -1;
    this._lastQuery = '';
  }

  
  _updateHighlight(items) {
    items.forEach((item, i) => {
      item.classList.toggle('highlighted', i === this._highlighted);
      if (i === this._highlighted) {
        item.setAttribute('aria-selected', 'true');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.setAttribute('aria-selected', 'false');
      }
    });
  }

  
  _toggleClearBtn(show) {
    this._clearBtn.classList.toggle('visible', show);
  }

  
  _doSearch(query) {
    this._hideSuggestions();
    if (this.onSearch) this.onSearch(query);
  }

  
  setData(data) {
    this.data = data;
  }

  
  getValue() {
    return this._inputEl ? this._inputEl.value : '';
  }

  
  focus() {
    if (this._inputEl) this._inputEl.focus();
  }
}