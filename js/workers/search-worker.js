/**
 * FreeToolsPDF Search Worker
 * Executes search index filtering off the main thread for 0ms UI lag
 */
let searchIndex = null;

self.addEventListener('message', async (e) => {
  const { type, query, activeCategory, pathPrefix } = e.data;

  if (type === 'INIT') {
    if (!searchIndex) {
      try {
        const prefix = pathPrefix || '';
        importScripts(`${prefix}js/search-index.js`);
        searchIndex = self.FREE_TOOLS_SEARCH_INDEX || [];
        self.postMessage({ type: 'INIT_DONE', count: searchIndex.length });
      } catch (err) {
        console.error('[SearchWorker] Error loading search index:', err);
        self.postMessage({ type: 'INIT_ERROR', error: err.message });
      }
    } else {
      self.postMessage({ type: 'INIT_DONE', count: searchIndex.length });
    }
    return;
  }

  if (type === 'SEARCH') {
    if (!searchIndex) {
      self.postMessage({ type: 'SEARCH_RESULTS', query, results: [] });
      return;
    }

    const q = (query || '').toLowerCase().trim();
    const cat = activeCategory || 'all';

    const filtered = searchIndex.filter(item => {
      const matchCat = cat === 'all' || item.categorySlug === cat;
      if (!matchCat) return false;

      if (!q) return true;
      return item.title.toLowerCase().includes(q) ||
             item.slug.toLowerCase().includes(q) ||
             item.description.toLowerCase().includes(q);
    }).slice(0, 30);

    self.postMessage({ type: 'SEARCH_RESULTS', query, results: filtered });
  }
});
