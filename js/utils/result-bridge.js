'use strict';


const FtpdfAnalytics = (() => {
  const STORE_KEY  = 'ftpdf-events';
  const MAX_EVENTS = 200;

  
  function track(event, props = {}) {
    
    try {
      const stored = JSON.parse(localStorage.getItem(STORE_KEY) || '[]');
      stored.push({ event, props, ts: Date.now() });
      
      if (stored.length > MAX_EVENTS) stored.splice(0, stored.length - MAX_EVENTS);
      localStorage.setItem(STORE_KEY, JSON.stringify(stored));
    } catch (e) {
      console.warn('[Analytics] localStorage write failed:', e);
    }

    
    if (typeof window.clarity === 'function') {
      try {
        window.clarity('event', event);
        
        if (props.toolId) window.clarity('set', 'toolId', props.toolId);
      } catch (e) {  }
    }

    if (typeof console !== 'undefined') {
      console.log('[FtpdfAnalytics]', event, props);
    }
  }

  
  function getAll() {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEY) || '[]');
    } catch {
      return [];
    }
  }

  return { track, getAll };
})();

window.FtpdfAnalytics = FtpdfAnalytics;



const ResultBridge = (() => {
  const SESSION_KEY = 'ftpdf-session-meta';
  const FALLBACK_SESSION_KEY = 'ftpdf-session-meta-fallback';

  
  function generateId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  
  function buildResultUrl(pageName, sessionId) {
    const baseUrl = window.location.href;
    const url = new URL(pageName, baseUrl);
    if (sessionId) url.searchParams.set('sessionId', sessionId);
    return url.toString();
  }

  function getReviewUrl(sessionId) {
    const path = window.location.pathname;
    if (path.includes('/results/')) return buildResultUrl('review.html', sessionId);
    if (path.includes('/tools/')) return buildResultUrl('../results/review.html', sessionId);
    return buildResultUrl('results/review.html', sessionId);
  }

  function getDownloadUrl(sessionId) {
    const path = window.location.pathname;
    if (path.includes('/results/')) return buildResultUrl('download.html', sessionId);
    if (path.includes('/tools/')) return buildResultUrl('../results/download.html', sessionId);
    return buildResultUrl('results/download.html', sessionId);
  }

  function persistSession(sessionData) {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    } catch (err) {
      console.warn('[ResultBridge] sessionStorage write failed:', err);
    }

    try {
      localStorage.setItem(FALLBACK_SESSION_KEY, JSON.stringify(sessionData));
    } catch (err) {
      console.warn('[ResultBridge] localStorage write failed:', err);
    }
  }

  
  async function save(...args) {
    let opts = {};

    if (args.length === 1 && args[0] && typeof args[0] === 'object' && !(args[0] instanceof Blob)) {
      opts = args[0];
    } else {
      const [blob, fileName, mimeType] = args;
      opts = {
        blob,
        fileName,
        mimeType: mimeType || blob?.type || 'application/octet-stream',
      };
    }

    const {
      toolId, toolName, fileName,
      mimeType = 'application/octet-stream',
      blob,
      meta = {},
    } = opts;

    if (!blob || !(blob instanceof Blob)) {
      console.error('[ResultBridge] save() called without a valid Blob');
      return;
    }

    const sessionId = generateId();

    FtpdfAnalytics.track('upload_completed', {
      toolId,
      fileName,
      fileSize: blob.size,
      pageCount: meta.pageCount,
    });

    try {
      
      await ResultStorage.save(sessionId, blob, meta);
    } catch (err) {
      console.error('[ResultBridge] IndexedDB save failed:', err);
      
      _directDownload(blob, fileName);
      return;
    }

    
    const sessionData = {
      sessionId,
      toolId,
      toolName,
      fileName,
      mimeType,
      fileSize: blob.size,
      meta,
      timestamp: Date.now(),
    };

    persistSession(sessionData);

    
    ResultStorage.cleanup().catch(() => {});

    
    window.location.href = getReviewUrl(sessionId);
  }

  
  function getSession() {
    try {
      const fromStorage = sessionStorage.getItem(SESSION_KEY);
      if (fromStorage) return JSON.parse(fromStorage);
    } catch {}

    try {
      const fromFallback = localStorage.getItem(FALLBACK_SESSION_KEY);
      if (fromFallback) return JSON.parse(fromFallback);
    } catch {}

    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('sessionId');
    if (sessionId) {
      return { sessionId };
    }

    return null;
  }

  
  function clearSession() {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(FALLBACK_SESSION_KEY);
    const url = new URL(window.location.href);
    url.searchParams.delete('sessionId');
    window.history.replaceState({}, '', url.toString());
  }

  
  async function triggerDownload(sessionId, fileName, mimeType) {
    FtpdfAnalytics.track('download_started', { sessionId, fileName });

    let entry;
    try {
      entry = await ResultStorage.load(sessionId);
    } catch (err) {
      console.error('[ResultBridge] IndexedDB load failed:', err);
      return false;
    }

    if (!entry || !entry.blob) {
      console.warn('[ResultBridge] No blob found for session:', sessionId);
      return false;
    }

    _directDownload(entry.blob, fileName, mimeType);
    FtpdfAnalytics.track('download_completed', { sessionId, fileName });
    return true;
  }

  
  async function cleanup(sessionId) {
    try {
      await ResultStorage.remove(sessionId);
    } catch (err) {
      console.warn('[ResultBridge] Cleanup failed:', err);
    }
    clearSession();
  }

  
  function _directDownload(blob, fileName) {
    const url = URL.createObjectURL(blob);
    const a   = Object.assign(document.createElement('a'), {
      href: url,
      download: fileName,
    });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  }

  
  async function exportElementToPDF(elementId, fileName, toolId, toolName) {
    const el = document.getElementById(elementId);
    if (!el) {
      console.error('[ResultBridge] exportElementToPDF: Element not found', elementId);
      if (window.showToast) window.showToast('Error: Could not generate report', 'error');
      return;
    }

    if (window.showToast) window.showToast('Generating report...', 'info');

    
    const loadScript = (url, id) => {
      if (window.ScriptLoader) return window.ScriptLoader.load(url, id);
      return new Promise((resolve, reject) => {
        if (document.getElementById(id)) return resolve();
        const s = document.createElement('script');
        s.src = url; s.id = id; s.crossOrigin = 'anonymous';
        s.onload = resolve; s.onerror = reject;
        document.head.appendChild(s);
      });
    };

    try {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js', 'html2canvas-js');
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', 'jspdf-js');

      const { jsPDF } = window.jspdf;

      
      const exportBtn = el.querySelector('#export-report-btn') || document.getElementById('export-report-btn');
      const oldDisplay = exportBtn ? exportBtn.style.display : '';
      if (exportBtn) exportBtn.style.display = 'none';

      const canvas = await window.html2canvas(el, { scale: 2, useCORS: true, logging: false });
      
      if (exportBtn) exportBtn.style.display = oldDisplay;

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);

      const pdfBlob = pdf.output('blob');

      await save({
        toolId,
        toolName,
        fileName,
        mimeType: 'application/pdf',
        blob: pdfBlob
      });
    } catch (err) {
      console.error('[ResultBridge] Error exporting to PDF:', err);
      if (window.showToast) window.showToast('Failed to generate report.', 'error');
    }
  }

  return {
    save,
    getSession,
    clearSession,
    triggerDownload,
    cleanup,
    getDownloadUrl,
    getReviewUrl,
    _directDownload,
    exportElementToPDF,
  };
})();

window.ResultBridge = ResultBridge;