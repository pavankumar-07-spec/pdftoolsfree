/* WorkerLoader - simple manager for creating and communicating with WebWorkers
   Exposes global WorkerManager with createWorker(scriptUrl) -> { post, on, terminate }
*/
(function (global) {
  function createWorker(scriptUrl) {
    if (!window.Worker) {
      console.warn('WorkerLoader: Web Workers not supported');
      return null;
    }
    const worker = new Worker(scriptUrl);
    const handlers = new Map();
    worker.onmessage = function (e) {
      const msg = e.data || {};
      const id = msg.id || '__global__';
      const cb = handlers.get(id);
      if (cb) cb(msg);
      if (typeof WorkerManager.onmessage === 'function') WorkerManager.onmessage(msg);
    };

    // send task that returns a promise and supports progress + cancel
    function runTask(payload, onProgress) {
      const id = 't_' + Math.random().toString(36).slice(2, 9);
      let externalCancel;
      const p = new Promise((resolve, reject) => {
        const listener = function (msg) {
          if (!msg || msg.id !== id) return;
          if (msg.type === 'progress') {
            try { if (onProgress) onProgress(msg.progress); } catch (e) {}
            return;
          }
          if (msg.type === 'done') {
            handlers.delete(id);
            resolve(msg.result);
            return;
          }
          if (msg.type === 'error' || msg.type === 'failed') {
            handlers.delete(id);
            reject(new Error(msg.message || 'worker error'));
            return;
          }
        };
        handlers.set(id, listener);
        worker.postMessage(Object.assign({ id, cmd: 'process' }, payload));
        // expose cancel function
        externalCancel = () => {
          handlers.delete(id);
          try { worker.postMessage({ id, cmd: 'cancel' }); } catch (e) {}
          reject(new Error('cancelled'));
        };
      });
      p.cancel = externalCancel;
      return p;
    }

    return {
      post(data) { worker.postMessage(data); },
      on(id, cb) { handlers.set(id, cb); },
      runTask,
      terminate() { worker.terminate(); handlers.clear(); }
    };
  }

  const WorkerManager = {
    createWorker,
    onmessage: null,
  };

  global.WorkerManager = WorkerManager;
})(window);
