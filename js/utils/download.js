const loadBridgeScripts = () => {
  return new Promise((resolve) => {
    if (window.ResultBridge) {
      resolve();
      return;
    }
    const pathPrefix = window.location.pathname.includes('/tools/') ? '../js/' : 'js/';
    
    const s1 = document.createElement('script');
    s1.src = `${pathPrefix}utils/result-storage.js`;
    
    s1.onload = () => {
      const s2 = document.createElement('script');
      s2.src = `${pathPrefix}utils/result-bridge.js`;
      s2.onload = () => {
        const s3 = document.createElement('script');
        s3.src = `${pathPrefix}utils/related-tools.js`;
        s3.onload = () => resolve();
        document.body.appendChild(s3);
      };
      document.body.appendChild(s2);
    };
    document.body.appendChild(s1);
  });
};




const openPreviewModal = (url, filename, type, downloadCallback) => {
  
  const existing = document.getElementById('suh-preview-modal');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'suh-preview-modal';
  overlay.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.8); z-index: 99999;
    display: flex; align-items: center; justify-content: center;
    backdrop-filter: blur(4px); padding: var(--space-4);
  `;

  const container = document.createElement('div');
  container.className = 'card';
  container.style.cssText = `
    width: 100%; max-width: 800px; max-height: 90vh;
    display: flex; flex-direction: column; overflow: hidden;
    position: relative; padding: 0;
  `;

  
  const header = document.createElement('div');
  header.style.cssText = `
    padding: var(--space-4); border-bottom: 1px solid var(--card-border);
    display: flex; justify-content: space-between; align-items: center;
    background: var(--bg-secondary);
  `;
  header.innerHTML = `
    <h3 style="font-size:var(--text-lg);margin:0">Preview: ${filename}</h3>
    <button class="btn btn-ghost btn-sm" id="close-preview" style="min-height:32px;padding:4px 8px">âœ•</button>
  `;

  
  const body = document.createElement('div');
  body.style.cssText = `
    flex: 1; overflow: auto; padding: var(--space-4);
    background: var(--bg-tertiary); display: flex; align-items: center; justify-content: center;
    min-height: 300px;
  `;

  if (type === 'application/pdf') {
    body.innerHTML = `<iframe src="${url}#toolbar=0" style="width:100%;height:60vh;border:none;border-radius:var(--radius-sm)"></iframe>`;
  } else if (type.startsWith('image/')) {
    body.innerHTML = `<img src="${url}" style="max-width:100%;max-height:60vh;object-fit:contain;border-radius:var(--radius-sm)">`;
  }

  
  const footer = document.createElement('div');
  footer.style.cssText = `
    padding: var(--space-4); border-top: 1px solid var(--card-border);
    display: flex; justify-content: flex-end; gap: var(--space-3);
    background: var(--bg-secondary);
  `;
  
  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'btn btn-secondary';
  cancelBtn.textContent = 'Cancel';
  
  const downloadBtn = document.createElement('button');
  downloadBtn.className = 'btn btn-primary';
  downloadBtn.innerHTML = 'â¬‡ï¸ Download File';

  footer.appendChild(cancelBtn);
  footer.appendChild(downloadBtn);

  container.appendChild(header);
  container.appendChild(body);
  container.appendChild(footer);
  overlay.appendChild(container);
  document.body.appendChild(overlay);

  const closeModal = () => document.body.removeChild(overlay);

  overlay.querySelector('#close-preview').onclick = closeModal;
  cancelBtn.onclick = closeModal;
  
  downloadBtn.onclick = () => {
    downloadCallback();
    closeModal();
    if (typeof showToast === 'function') {
      showToast(`âœ“ Downloaded ${filename}`, 'success');
    }
  };
};


const downloadAsFile = (content, filename, type) => {
  if (!filename) {
    console.error('[Download] filename is required');
    return;
  }

  const mimeType = type || downloadAsFile.getMimeType(filename);

  let blob;
  if (content instanceof Blob) {
    blob = content;
  } else if (content instanceof ArrayBuffer || ArrayBuffer.isView(content)) {
    blob = new Blob([content], { type: mimeType });
  } else {
    blob = new Blob([String(content)], { type: mimeType });
  }

  const isBypass = window.location.pathname.includes('/results/') || 
                   window.location.hash.includes('#direct-download') || 
                   window.name === 'direct-download';

  if (isBypass) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    requestAnimationFrame(() => {
      document.body.removeChild(anchor);
      setTimeout(() => URL.revokeObjectURL(url), 30000);
    });
    return;
  }

  loadBridgeScripts().then(async () => {
    const toolId = window.location.pathname.split('/').pop().replace('.html', '');
    const toolInfo = window.RelatedTools ? window.RelatedTools.info(toolId) : null;
    const toolName = toolInfo ? toolInfo.name : toolId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    await window.ResultBridge.save({
      toolId: toolId,
      toolName: toolName,
      fileName: filename,
      mimeType: mimeType,
      blob: blob,
      meta: {
        outputSize: blob.size,
        outputType: mimeType.includes('pdf') ? 'pdf' : (mimeType.includes('zip') ? 'zip' : 'image')
      }
    });
  });
};


downloadAsFile.getMimeType = (filename) => {
  const ext = filename.split('.').pop().toLowerCase();
  const mimeMap = {
    txt:  'text/plain;charset=utf-8',
    csv:  'text/csv;charset=utf-8',
    json: 'application/json',
    pdf:  'application/pdf',
    png:  'image/png',
    jpg:  'image/jpeg',
    jpeg: 'image/jpeg',
    svg:  'image/svg+xml',
    html: 'text/html;charset=utf-8',
    htm:  'text/html;charset=utf-8',
    md:   'text/markdown;charset=utf-8',
    xml:  'application/xml',
    zip:  'application/zip',
    doc:  'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls:  'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  };
  return mimeMap[ext] || 'application/octet-stream';
};


const downloadText = (text, filename = 'result.txt') => {
  downloadAsFile(text, filename, 'text/plain;charset=utf-8');
};


const downloadJSON = (data, filename = 'data.json', indent = 2) => {
  const json = JSON.stringify(data, null, indent);
  downloadAsFile(json, filename, 'application/json');
};


const downloadCSV = (rows, filename = 'data.csv', headers = null) => {
  const escape = (val) => {
    const str = String(val == null ? '' : val);
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };
  const lines = [];
  if (headers) lines.push(headers.map(escape).join(','));
  rows.forEach(row => lines.push(row.map(escape).join(',')));
  const csv = '\uFEFF' + lines.join('\r\n'); 
  downloadAsFile(csv, filename, 'text/csv;charset=utf-8');
};


const downloadCanvas = (canvas, filename = 'image.png', quality = 0.95) => {
  const isJpeg = filename.endsWith('.jpg') || filename.endsWith('.jpeg');
  const mimeType = isJpeg ? 'image/jpeg' : 'image/png';
  canvas.toBlob((blob) => {
    downloadAsFile(blob, filename, mimeType);
  }, mimeType, quality);
};




const downloadWithToast = (content, filename, type) => {
  try {
    downloadAsFile(content, filename, type);
    
  } catch (e) {
    if (typeof showToast === 'function') {
      showToast('Download failed. Please try again.', 'error');
    }
    console.error('[Download] Error:', e);
  }
};


if (typeof module !== 'undefined' && module.exports) {
  module.exports = { downloadAsFile, downloadText, downloadJSON, downloadCSV, downloadCanvas, downloadWithToast, openPreviewModal };
}
/**
 * Guaranteed Direct Browser Download Trigger
 */
window.triggerDirectDownload = function(content, filename, mimeType) {
  if (!content) {
    if (typeof showToast === 'function') showToast('No content to download.', 'warning');
    return;
  }

  let blob;
  if (content instanceof Blob) {
    blob = content;
  } else if (content instanceof ArrayBuffer || ArrayBuffer.isView(content)) {
    blob = new Blob([content], { type: mimeType || 'application/octet-stream' });
  } else {
    blob = new Blob([String(content)], { type: mimeType || 'text/plain;charset=utf-8' });
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || 'download.txt';
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();

  setTimeout(() => {
    if (a.parentNode) a.parentNode.removeChild(a);
    URL.revokeObjectURL(url);
  }, 2000);

  if (typeof showToast === 'function') {
    showToast(`✓ Downloaded ${filename || 'file'}!`, 'success');
  }
};
