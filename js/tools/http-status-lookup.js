/**
 * HTTP Status Code Lookup Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('hsl-code')) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">HTTP Status Code or Keyword (e.g. 404, 200, 500, Unauthorized):</label>
        <input type="text" id="hsl-code" class="form-input" value="404" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-hsl-btn" class="btn btn-primary flex-1">🔍 Lookup HTTP Code</button>
      </div>
    `;
  }

  const httpCodes = {
    '200': { title: 'OK', cat: '2xx Success', desc: 'Standard response for successful HTTP requests.' },
    '201': { title: 'Created', cat: '2xx Success', desc: 'Request fulfilled and a new resource has been created.' },
    '204': { title: 'No Content', cat: '2xx Success', desc: 'Server successfully processed request but returns no content body.' },
    '301': { title: 'Moved Permanently', cat: '3xx Redirection', desc: 'Target resource has been assigned a new permanent URI.' },
    '302': { title: 'Found (Temporary Redirect)', cat: '3xx Redirection', desc: 'Target resource resides temporarily under a different URI.' },
    '304': { title: 'Not Modified', cat: '3xx Redirection', desc: 'Resource has not been modified since last requested (caching).' },
    '400': { title: 'Bad Request', cat: '4xx Client Error', desc: 'Server cannot process request due to client syntax error.' },
    '401': { title: 'Unauthorized', cat: '4xx Client Error', desc: 'Authentication is required and has failed or not been provided.' },
    '403': { title: 'Forbidden', cat: '4xx Client Error', desc: 'Server understood request but refuses to authorize it.' },
    '404': { title: 'Not Found', cat: '4xx Client Error', desc: 'Requested resource could not be found on server.' },
    '405': { title: 'Method Not Allowed', cat: '4xx Client Error', desc: 'Request method (GET, POST, etc.) is not supported for requested resource.' },
    '429': { title: 'Too Many Requests', cat: '4xx Client Error', desc: 'User has sent too many requests in a given amount of time (rate limiting).' },
    '500': { title: 'Internal Server Error', cat: '5xx Server Error', desc: 'Generic error message when server encounters an unexpected condition.' },
    '502': { title: 'Bad Gateway', cat: '5xx Server Error', desc: 'Server acting as gateway/proxy received an invalid response from upstream.' },
    '503': { title: 'Service Unavailable', cat: '5xx Server Error', desc: 'Server is currently unable to handle request due to temporary overload or maintenance.' },
    '504': { title: 'Gateway Timeout', cat: '5xx Server Error', desc: 'Server acting as gateway did not receive timely response from upstream.' }
  };

  function calculate() {
    const query = document.getElementById('hsl-code') ? document.getElementById('hsl-code').value.trim().toLowerCase() : '';

    let res = `--- HTTP STATUS CODE LOOKUP ---nn`;

    const keys = Object.keys(httpCodes).filter(k => k.includes(query) || httpCodes[k].title.toLowerCase().includes(query));

    if (keys.length === 0) {
      res += `No HTTP status code matching "${query}". Available: ${Object.keys(httpCodes).join(', ')}`;
    } else {
      keys.forEach(code => {
        const item = httpCodes[code];
        res += `=== HTTP ${code} ${item.title.toUpperCase()} ===n`;
        res += `Category:    ${item.cat}n`;
        res += `Description: ${item.desc}nn`;
      });
    }

    if (out) out.value = res;
    if (window.showToast) window.showToast('HTTP code details retrieved!', 'success');
  }

  const activeBtn = document.getElementById('calc-hsl-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
