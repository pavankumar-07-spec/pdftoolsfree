'use strict';

const ResultStorage = (() => {
  const DB_NAME    = 'ftpdf-results';
  const DB_VERSION = 1;
  const STORE      = 'results';
  const MAX_AGE_MS = 24 * 60 * 60 * 1000; 

  let _db = null;

  
  function open() {
    if (_db) return Promise.resolve(_db);

    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);

      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE)) {
          const store = db.createObjectStore(STORE, { keyPath: 'sessionId' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };

      req.onsuccess = (e) => {
        _db = e.target.result;

        
        _db.onversionchange = () => {
          _db.close();
          _db = null;
        };

        resolve(_db);
      };

      req.onerror = () => reject(new Error('[ResultStorage] Failed to open IndexedDB: ' + req.error));
      req.onblocked = () => console.warn('[ResultStorage] IndexedDB open blocked');
    });
  }

  
  async function save(sessionId, blob, meta = {}) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put({
        sessionId,
        blob,
        meta,
        timestamp: Date.now(),
      });
      tx.oncomplete = () => resolve();
      tx.onerror   = () => reject(new Error('[ResultStorage] Save failed: ' + tx.error));
    });
  }

  
  async function load(sessionId) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx  = db.transaction(STORE, 'readonly');
      const req = tx.objectStore(STORE).get(sessionId);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror   = () => reject(new Error('[ResultStorage] Load failed: ' + req.error));
    });
  }

  
  async function remove(sessionId) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).delete(sessionId);
      tx.oncomplete = () => resolve();
      tx.onerror   = () => reject(new Error('[ResultStorage] Delete failed: ' + tx.error));
    });
  }

  
  async function cleanup() {
    const db     = await open();
    const cutoff = Date.now() - MAX_AGE_MS;

    return new Promise((resolve, reject) => {
      const tx    = db.transaction(STORE, 'readwrite');
      const index = tx.objectStore(STORE).index('timestamp');
      
      const range = IDBKeyRange.upperBound(cutoff);
      const req   = index.openCursor(range);

      req.onsuccess = (e) => {
        const cursor = e.target.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      };

      tx.oncomplete = () => {
        console.log('[ResultStorage] Cleanup complete');
        resolve();
      };
      tx.onerror = () => reject(new Error('[ResultStorage] Cleanup failed: ' + tx.error));
    });
  }

  
  return { save, load, remove, cleanup };
})();

window.ResultStorage = ResultStorage;