const ScriptLoader = {
  _loadedScripts: new Set(),
  _pendingPromises: new Map(),

  
  load(url, globalName) {
    
    if (this._loadedScripts.has(url) && window[globalName]) {
      return Promise.resolve(window[globalName]);
    }

    
    if (this._pendingPromises.has(url)) {
      return this._pendingPromises.get(url);
    }

    const promise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.crossOrigin = 'anonymous';
      
      script.onload = () => {
        this._loadedScripts.add(url);
        this._pendingPromises.delete(url);
        if (globalName && !window[globalName]) {
          console.warn(`[ScriptLoader] Script loaded but window.${globalName} is undefined`);
        }
        resolve(window[globalName] || true);
      };

      script.onerror = (err) => {
        this._pendingPromises.delete(url);
        reject(new Error(`Failed to load script: ${url}`));
      };

      document.body.appendChild(script);
    });

    this._pendingPromises.set(url, promise);
    return promise;
  }
};