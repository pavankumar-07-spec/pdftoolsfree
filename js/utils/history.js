/* HistoryManager - stores recent tool visits in window.localStorage
   Data structure per item:
   { tool_slug, title, url, last_accessed, click_count }

   Constraints enforced:
   - Max 10 items in storage (evict lowest-ranked when exceeding)
   - Deduplicate by tool_slug: increment click_count, update last_accessed
   - Sorting: primary by click_count desc, secondary by last_accessed desc
*/
(function (global) {
  const STORAGE_KEY = 'recent_tools_v1';
  const MAX_ITEMS = 10;

  function readRaw() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed;
    } catch (e) {
      console.error('HistoryManager: failed to read storage', e);
      return [];
    }
  }

  function writeRaw(list) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('HistoryManager: failed to write storage', e);
    }
  }

  function sortList(list) {
    return list.sort((a, b) => {
      if (b.click_count !== a.click_count) return b.click_count - a.click_count;
      return b.last_accessed - a.last_accessed;
    });
  }

  const HistoryManager = {
    saveTool({ tool_slug, title, url }) {
      if (!tool_slug) return; // require slug
      const now = Date.now();
      const list = readRaw();

      const existingIndex = list.findIndex((i) => i.tool_slug === tool_slug);
      if (existingIndex > -1) {
        // update existing
        const item = list[existingIndex];
        item.click_count = (Number(item.click_count) || 0) + 1;
        item.last_accessed = now;
        // allow title/url refresh
        if (title) item.title = title;
        if (url) item.url = url;
      } else {
        // add new
        list.push({
          tool_slug,
          title: title || '',
          url: url || '',
          last_accessed: now,
          click_count: 1,
        });
      }

      const sorted = sortList(list);

      // trim to MAX_ITEMS: remove lowest-ranked items
      while (sorted.length > MAX_ITEMS) {
        sorted.pop();
      }

      writeRaw(sorted);
    },

    getAll() {
      const list = readRaw();
      return sortList(list.slice());
    },

    getTop(n = 4) {
      const list = this.getAll();
      return list.slice(0, n);
    },

    clear() {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.error('HistoryManager: failed to clear storage', e);
      }
    },

    remove(tool_slug) {
      if (!tool_slug) return;
      const list = readRaw().filter((i) => i.tool_slug !== tool_slug);
      writeRaw(list);
    },

    _raw: readRaw,
  };

  // expose globally
  global.HistoryManager = HistoryManager;
})(window);
const History = {
  
  MAX_ENTRIES: 5,
  
  KEY_PREFIX: 'suh-history-',

  
  save(toolName, inputData, result) {
    try {
      const key = this.KEY_PREFIX + toolName;
      const existing = this._read(key);

      const entry = {
        id:        Date.now(),
        timestamp: new Date().toISOString(),
        inputData: this._sanitize(inputData),
        result:    this._sanitize(result),
      };

      
      const updated = [entry, ...existing].slice(0, this.MAX_ENTRIES);
      localStorage.setItem(key, JSON.stringify(updated));
      return entry;
    } catch (e) {
      
      console.warn('[History] Could not save:', e.message);
      return null;
    }
  },

  
  get(toolName) {
    try {
      return this._read(this.KEY_PREFIX + toolName);
    } catch {
      return [];
    }
  },

  
  getLast(toolName) {
    const entries = this.get(toolName);
    return entries.length ? entries[0] : null;
  },

  
  getAll() {
    const result = {};
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.KEY_PREFIX)) {
          const toolName = key.replace(this.KEY_PREFIX, '');
          result[toolName] = this._read(key);
        }
      }
    } catch {  }
    return result;
  },

  
  clear(toolName) {
    try {
      if (toolName) {
        localStorage.removeItem(this.KEY_PREFIX + toolName);
      }
    } catch {  }
  },

  
  clearAll() {
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.KEY_PREFIX)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch {  }
  },

  
  getTotalCount() {
    return Object.values(this.getAll()).reduce((sum, entries) => sum + entries.length, 0);
  },

  
  formatTime(isoString) {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1)   return 'Just now';
      if (diffMins < 60)  return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7)   return `${diffDays}d ago`;
      return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    } catch {
      return '';
    }
  },

  

  _read(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  _sanitize(data) {
    
    try {
      return JSON.parse(JSON.stringify(data, (key, val) => {
        if (val instanceof File) return `[File: ${val.name}]`;
        if (typeof val === 'function') return undefined;
        return val;
      }));
    } catch {
      return String(data);
    }
  },
};


const Store = {
  get(key, defaultVal = null) {
    try {
      const val = localStorage.getItem('suh-store-' + key);
      return val ? JSON.parse(val) : defaultVal;
    } catch {
      return defaultVal;
    }
  },
  set(key, data) {
    try {
      localStorage.setItem('suh-store-' + key, JSON.stringify(data));
    } catch {
      console.warn('[Store] Failed to save data for key:', key);
    }
  }
};


if (typeof module !== 'undefined' && module.exports) {
  module.exports = { History, Store };
}