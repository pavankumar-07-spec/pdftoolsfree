/**
 * FreeToolsPDF — Local History & Favorites Presets Manager (100% Client-Side Private)
 * Uses LocalStorage / IndexedDB to persist recent tool uses & favorite tools.
 */
class LocalHistoryManager {
  static HISTORY_KEY = 'freetoolspdf_recent_history';
  static FAVORITES_KEY = 'freetoolspdf_favorite_tools';

  static addHistory(toolSlug, toolTitle, resultSnippet = '') {
    try {
      let history = this.getHistory();
      // Remove duplicate entry
      history = history.filter(h => h.slug !== toolSlug);
      // Add to front
      history.unshift({
        slug: toolSlug,
        title: toolTitle,
        snippet: resultSnippet.slice(0, 100),
        timestamp: new Date().toISOString()
      });
      // Limit to last 20 entries
      localStorage.setItem(this.HISTORY_KEY, JSON.stringify(history.slice(0, 20)));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }

  static getHistory() {
    try {
      return JSON.parse(localStorage.getItem(this.HISTORY_KEY) || '[]');
    } catch (e) {
      return [];
    }
  }

  static toggleFavorite(toolSlug) {
    try {
      let favorites = this.getFavorites();
      if (favorites.includes(toolSlug)) {
        favorites = favorites.filter(s => s !== toolSlug);
      } else {
        favorites.push(toolSlug);
      }
      localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(favorites));
      return favorites.includes(toolSlug);
    } catch (e) {
      return false;
    }
  }

  static isFavorite(toolSlug) {
    return this.getFavorites().includes(toolSlug);
  }

  static getFavorites() {
    try {
      return JSON.parse(localStorage.getItem(this.FAVORITES_KEY) || '[]');
    } catch (e) {
      return [];
    }
  }
}

if (typeof window !== 'undefined') {
  window.LocalHistoryManager = LocalHistoryManager;
}
