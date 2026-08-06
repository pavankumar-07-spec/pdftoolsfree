/**
 * S-Tier UI & Visual Output Dashboard Engine - Master Bespoke UX
 * Standardized framework for pdftoolsfree.in
 */

window.UIDashboardEngine = {
  /**
   * Render or update visual KPI dashboard card
   * @param {Object} opts
   * @param {string} [opts.containerId] - Element ID for results dashboard
   * @param {Array<{label: string, value: string|number, sub?: string, icon?: string}>} opts.kpis
   * @param {string} [opts.title]
   * @param {string} [opts.status]
   * @param {string} [opts.archetype] - 'pdf' | 'image' | 'math' | 'dev' | 'design' | 'security' | 'calc'
   * @param {Array<string>} [opts.steps]
   * @param {string} [opts.diagramSvg]
   * @param {Function} [opts.onCopy]
   * @param {Function} [opts.onDownload]
   */
  render: function (opts) {
    const container = document.getElementById(opts.containerId || 'gen-results-card');
    if (!container) return;

    const title = opts.title || '✨ Calculation Results & Visual Dashboard';
    const rawStatus = opts.status || 'Optimal Result';
    const archetype = opts.archetype || 'calc';
    
    // Status Badge Logic
    let statusBadgeClass = 'dashboard-status-tag';
    let statusText = `✅ ${rawStatus}`;
    if (rawStatus.toLowerCase().includes('precision') || rawStatus.toLowerCase().includes('fast')) {
      statusText = `⚡ ${rawStatus}`;
    } else if (rawStatus.toLowerCase().includes('computed') || rawStatus.toLowerCase().includes('data') || rawStatus.toLowerCase().includes('rendered')) {
      statusText = `📊 ${rawStatus}`;
    }

    let kpiHtml = '';
    if (opts.kpis && opts.kpis.length > 0) {
      kpiHtml = '<div class="kpi-grid">';
      opts.kpis.forEach((kpi, idx) => {
        const kpiId = `kpi-val-${idx}-${Math.random().toString(36).substr(2, 5)}`;
        kpiHtml += `
          <div class="kpi-card">
            <div class="kpi-label">${kpi.label}</div>
            <div class="kpi-value" id="${kpiId}" data-target-val="${kpi.value}">${kpi.value}</div>
            ${kpi.sub ? `<div class="kpi-sub">${kpi.sub}</div>` : ''}
          </div>
        `;
      });
      kpiHtml += '</div>';
    }

    // Select Bespoke SVG Diagram based on Archetype if custom not provided
    let diagramSvg = opts.diagramSvg;
    if (!diagramSvg) {
      if (archetype === 'pdf') diagramSvg = this.generatePDFFlowDiagram();
      else if (archetype === 'image') diagramSvg = this.generateImageProcessDiagram();
      else if (archetype === 'math') diagramSvg = this.generateMathPlotDiagram();
      else if (archetype === 'dev') diagramSvg = this.generateCodeDataFlowDiagram();
      else if (archetype === 'design') diagramSvg = this.generateDesignColorDiagram();
      else if (archetype === 'security') diagramSvg = this.generateSecurityHashDiagram();
      else diagramSvg = this.generateHDSvgDiagram();
    }

    let diagramHtml = `
      <div class="canvas-diagram-box">
        ${diagramSvg}
      </div>
    `;

    let stepHtml = '';
    if (opts.steps && opts.steps.length > 0) {
      stepHtml = `
        <div class="step-box-container">
          <div class="step-box-title">📝 Step-by-Step Solution Breakdown</div>
          <ol style="margin:0;padding-left:1.2rem">
            ${opts.steps.map(s => `<li>${s}</li>`).join('')}
          </ol>
        </div>
      `;
    }

    const html = `
      <div class="results-dashboard-card">
        <div class="dashboard-header">
          <div class="dashboard-title">${title}</div>
          <span class="${statusBadgeClass}">${statusText}</span>
        </div>

        ${kpiHtml}
        ${diagramHtml}
        ${stepHtml}

        <div class="action-toolbar">
          <button type="button" class="btn btn-secondary btn-sm" id="dashboard-copy-btn">📋 Copy Results</button>
          <button type="button" class="btn btn-secondary btn-sm" id="dashboard-download-btn">💾 Download Report</button>
          <button type="button" class="btn btn-secondary btn-sm" id="dashboard-reset-btn">🔄 Reset Inputs</button>
        </div>
      </div>
    `;

    container.innerHTML = html;

    // Trigger Smooth Count-Up Animations for Numeric KPI Values
    if (opts.kpis && opts.kpis.length > 0) {
      opts.kpis.forEach((kpi, idx) => {
        const val = typeof kpi.value === 'number' ? kpi.value : parseFloat(kpi.value);
        if (!isNaN(val) && isFinite(val)) {
          const cards = container.querySelectorAll('.kpi-value');
          if (cards[idx]) {
            this.animateValue(cards[idx], 0, val, 400);
          }
        }
      });
    }

    // Attach Action Buttons
    const copyBtn = container.querySelector('#dashboard-copy-btn');
    if (copyBtn) {
      copyBtn.onclick = () => {
        const textToCopy = opts.kpis ? opts.kpis.map(k => `${k.label}: ${k.value}`).join('\n') : '';
        navigator.clipboard.writeText(textToCopy).then(() => {
          this.showToast('Results copied to clipboard!', 'success');
        });
      };
    }

    const downloadBtn = container.querySelector('#dashboard-download-btn');
    if (downloadBtn) {
      downloadBtn.onclick = () => {
        const textToCopy = opts.kpis ? opts.kpis.map(k => `${k.label}: ${k.value}`).join('\n') : '';
        const blob = new Blob([textToCopy], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'calculation-report.txt'; a.click();
        setTimeout(() => URL.revokeObjectURL(url), 2000);
        this.showToast('Report downloaded successfully!', 'info');
      };
    }

    const resetBtn = container.querySelector('#dashboard-reset-btn');
    if (resetBtn) {
      resetBtn.onclick = () => {
        const inputs = container.parentElement ? container.parentElement.querySelectorAll('input, select, textarea') : [];
        inputs.forEach(inp => {
          if (inp.type === 'number' || inp.type === 'text' || inp.type === 'range') {
            if (inp.defaultValue !== undefined) inp.value = inp.defaultValue;
          }
        });
        this.showToast('Inputs reset to defaults', 'info');
      };
    }
  },

  /**
   * Smooth numeric count-up animation
   */
  animateValue: function (element, start, end, duration) {
    if (!element) return;
    const isInt = Number.isInteger(end);
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = start + (end - start) * easeProgress;
      element.innerText = isInt ? Math.round(currentVal) : parseFloat(currentVal.toFixed(4));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        element.innerText = end;
      }
    };
    window.requestAnimationFrame(step);
  },

  /* ── 8 Bespoke SVG Archetype Generators ── */

  // 1. PDF Archetype SVG
  generatePDFFlowDiagram: function () {
    const uid = Math.random().toString(36).substr(2, 6);
    return `
      <svg width="100%" height="90" viewBox="0 0 450 90" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="pdf_grad_${uid}" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#FF5A1F" />
            <stop offset="100%" stop-color="#DC2626" />
          </linearGradient>
        </defs>
        <rect x="20" y="15" width="410" height="60" rx="10" fill="url(#pdf_grad_${uid})" opacity="0.1" stroke="#FF5A1F" stroke-width="1.5"/>
        <!-- PDF Document Page Cards -->
        <rect x="50" y="25" width="30" height="40" rx="4" fill="#ffffff" stroke="#FF5A1F" stroke-width="1.5"/>
        <line x1="56" y1="33" x2="74" y2="33" stroke="#FF5A1F" stroke-width="2"/>
        <line x1="56" y1="41" x2="74" y2="41" stroke="#94a3b8" stroke-width="1.5"/>
        <line x1="56" y1="49" x2="68" y2="49" stroke="#94a3b8" stroke-width="1.5"/>
        
        <path d="M 95 45 L 175 45" stroke="#FF5A1F" stroke-width="2.5" stroke-dasharray="4,3"/>
        <circle cx="225" cy="45" r="18" fill="url(#pdf_grad_${uid})" class="pulse-node"/>
        <text x="225" y="50" fill="#ffffff" font-size="10" font-weight="900" text-anchor="middle">PDF</text>
        
        <path d="M 275 45 L 355 45" stroke="#10B981" stroke-width="2.5"/>
        <rect x="370" y="25" width="30" height="40" rx="4" fill="#10B981" opacity="0.9"/>
        <text x="385" y="49" fill="#ffffff" font-size="11" font-weight="800" text-anchor="middle">OK</text>
      </svg>
    `;
  },

  // 2. Image Archetype SVG
  generateImageProcessDiagram: function () {
    const uid = Math.random().toString(36).substr(2, 6);
    return `
      <svg width="100%" height="90" viewBox="0 0 450 90" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="img_grad_${uid}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#3B82F6" />
            <stop offset="100%" stop-color="#8B5CF6" />
          </linearGradient>
        </defs>
        <rect x="20" y="15" width="410" height="60" rx="10" fill="url(#img_grad_${uid})" opacity="0.1" stroke="#3B82F6" stroke-width="1.5"/>
        <!-- Raw Image Frame -->
        <rect x="45" y="25" width="45" height="40" rx="6" fill="#3B82F6" opacity="0.2" stroke="#3B82F6" stroke-width="1.5"/>
        <circle cx="60" cy="37" r="5" fill="#3B82F6"/>
        <polygon points="50,58 65,42 80,58" fill="#3B82F6" opacity="0.6"/>
        
        <path d="M 105 45 L 180 45" stroke="#8B5CF6" stroke-width="2.5" stroke-dasharray="5,3"/>
        <circle cx="225" cy="45" r="18" fill="url(#img_grad_${uid})" class="pulse-node"/>
        <text x="225" y="50" fill="#ffffff" font-size="10" font-weight="900" text-anchor="middle">IMG</text>
        
        <path d="M 270 45 L 345 45" stroke="#10B981" stroke-width="2.5"/>
        <!-- Processed Image Frame -->
        <rect x="360" y="25" width="45" height="40" rx="6" fill="#10B981" opacity="0.2" stroke="#10B981" stroke-width="1.5"/>
        <circle cx="375" cy="37" r="5" fill="#10B981"/>
        <polygon points="365,58 380,42 395,58" fill="#10B981" opacity="0.8"/>
      </svg>
    `;
  },

  // 3. Math & Solver Plot SVG
  generateMathPlotDiagram: function () {
    const uid = Math.random().toString(36).substr(2, 6);
    return `
      <svg width="100%" height="95" viewBox="0 0 450 95" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="math_grad_${uid}" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#FF5A1F" />
            <stop offset="100%" stop-color="#06B6D4" />
          </linearGradient>
        </defs>
        <!-- Axes -->
        <line x1="30" y1="50" x2="420" y2="50" stroke="#cbd5e1" stroke-width="1.5"/>
        <line x1="225" y1="10" x2="225" y2="85" stroke="#cbd5e1" stroke-width="1.5"/>
        
        <!-- Function Curve f(x) -->
        <path d="M 50 80 Q 140 10, 225 50 T 400 20" fill="none" stroke="url(#math_grad_${uid})" stroke-width="3"/>
        
        <!-- Root Marker (c, 0) -->
        <circle cx="225" cy="50" r="6" fill="#FF5A1F" class="pulse-node"/>
        <text x="225" y="70" fill="#FF5A1F" font-size="10" font-weight="800" text-anchor="middle">Root (x ≈ c)</text>
      </svg>
    `;
  },

  // 4. Code & Developer Data Flow SVG
  generateCodeDataFlowDiagram: function () {
    const uid = Math.random().toString(36).substr(2, 6);
    return `
      <svg width="100%" height="90" viewBox="0 0 450 90" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="15" width="410" height="60" rx="10" fill="#0f172a" opacity="0.95" stroke="#334155" stroke-width="1.5"/>
        <text x="40" y="49" fill="#38bdf8" font-family="monospace" font-size="12" font-weight="700">&lt;RAW_INPUT&gt;</text>
        <path d="M 160 45 L 250 45" stroke="#F59E0B" stroke-width="2.5" stroke-dasharray="5,3"/>
        <circle cx="225" cy="45" r="14" fill="#F59E0B" class="pulse-node"/>
        <text x="225" y="49" fill="#0f172a" font-size="9" font-weight="900" text-anchor="middle">DEV</text>
        <text x="310" y="49" fill="#4ade80" font-family="monospace" font-size="12" font-weight="700">{FORMATTED: OK}</text>
      </svg>
    `;
  },

  // 5. Design & Color SVG
  generateDesignColorDiagram: function () {
    const uid = Math.random().toString(36).substr(2, 6);
    return `
      <svg width="100%" height="90" viewBox="0 0 450 90" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="design_grad_${uid}" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#EC4899" />
            <stop offset="33%" stop-color="#8B5CF6" />
            <stop offset="66%" stop-color="#3B82F6" />
            <stop offset="100%" stop-color="#10B981" />
          </linearGradient>
        </defs>
        <rect x="30" y="25" width="390" height="40" rx="20" fill="url(#design_grad_${uid})" stroke="#ffffff" stroke-width="2" filter="drop-shadow(0 4px 12px rgba(236,72,153,0.3))"/>
        <circle cx="90" cy="45" r="12" fill="#EC4899" stroke="#ffffff" stroke-width="2"/>
        <circle cx="180" cy="45" r="12" fill="#8B5CF6" stroke="#ffffff" stroke-width="2"/>
        <circle cx="270" cy="45" r="12" fill="#3B82F6" stroke="#ffffff" stroke-width="2"/>
        <circle cx="360" cy="45" r="12" fill="#10B981" stroke="#ffffff" stroke-width="2"/>
      </svg>
    `;
  },

  // 6. Security & Hash SVG
  generateSecurityHashDiagram: function () {
    const uid = Math.random().toString(36).substr(2, 6);
    return `
      <svg width="100%" height="90" viewBox="0 0 450 90" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="15" width="410" height="60" rx="10" fill="#1e1b4b" stroke="#6366f1" stroke-width="1.5"/>
        <text x="45" y="49" fill="#a5b4fc" font-family="monospace" font-size="11" font-weight="700">🔒 PASS</text>
        <path d="M 120 45 L 210 45" stroke="#6366f1" stroke-width="2.5" stroke-dasharray="4,3"/>
        <circle cx="225" cy="45" r="16" fill="#6366f1" class="pulse-node"/>
        <text x="225" y="49" fill="#ffffff" font-size="9" font-weight="900" text-anchor="middle">HASH</text>
        <text x="280" y="49" fill="#34d399" font-family="monospace" font-size="10" font-weight="700">🔑 e3b0c44298fc1c149afbf4</text>
      </svg>
    `;
  },

  // 7. Default HD Waveform SVG
  generateHDSvgDiagram: function () {
    const uid = Math.random().toString(36).substr(2, 6);
    return `
      <svg width="100%" height="90" viewBox="0 0 450 90" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad_main_${uid}" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#FF5A1F" stop-opacity="0.8" />
            <stop offset="50%" stop-color="#FF8A00" stop-opacity="0.9" />
            <stop offset="100%" stop-color="#10B981" stop-opacity="0.8" />
          </linearGradient>
          <filter id="glow_${uid}" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <rect x="15" y="20" width="420" height="50" rx="12" fill="url(#grad_main_${uid})" opacity="0.12" stroke="#FF5A1F" stroke-width="1.5" stroke-dasharray="4,2"/>
        
        <circle cx="55" cy="45" r="16" fill="#FF5A1F" filter="url(#glow_${uid})" class="pulse-node"/>
        <text x="55" y="50" fill="#ffffff" font-size="11" font-weight="800" text-anchor="middle" font-family="sans-serif">IN</text>
        
        <path d="M 75 45 Q 165 20, 225 45 T 375 45" fill="none" stroke="url(#grad_main_${uid})" stroke-width="3" stroke-linecap="round"/>
        <circle cx="225" cy="45" r="7" fill="#FF8A00" filter="url(#glow_${uid})"/>
        
        <circle cx="395" cy="45" r="16" fill="#10B981" filter="url(#glow_${uid})" class="pulse-node"/>
        <text x="395" y="50" fill="#ffffff" font-size="11" font-weight="800" text-anchor="middle" font-family="sans-serif">OUT</text>
      </svg>
    `;
  },

  /**
   * Attach live event listeners to input fields & range sliders
   */
  attachLive: function (inputIds, callback) {
    if (!Array.isArray(inputIds)) return;
    inputIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        const handler = () => {
          if (el.type === 'range') {
            const badge = el.parentElement ? el.parentElement.querySelector('.slider-val-badge') : null;
            if (badge) badge.textContent = el.value;
          }
          if (typeof callback === 'function') callback();
        };
        el.addEventListener('input', handler);
        el.addEventListener('change', handler);
      }
    });
  },

  /**
   * Fluid Toast Notification Popup
   */
  showToast: function (msg, type = 'info') {
    if (window.showToast && window.showToast !== this.showToast) {
      window.showToast(msg, type);
      return;
    }
    let toast = document.getElementById('ui-fluid-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'ui-fluid-toast';
      toast.className = 'toast-notification';
      document.body.appendChild(toast);
    }
    const icon = type === 'success' ? '✅' : type === 'error' ? '⚠️' : 'ℹ️';
    toast.innerHTML = `<span>${icon}</span> <span>${msg}</span>`;
    toast.style.display = 'flex';
    toast.style.opacity = '1';
    
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => { toast.style.display = 'none'; }, 350);
    }, 2800);
  }
};

// Expose toast globally if not already present
if (!window.showToast) {
  window.showToast = function (msg, type) {
    if (window.UIDashboardEngine) window.UIDashboardEngine.showToast(msg, type);
  };
}
