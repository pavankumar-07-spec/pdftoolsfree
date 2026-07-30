class ResultCard {
  
  constructor(config = {}) {
    this.title        = config.title        || 'Result';
    this.data         = config.data         !== undefined ? config.data : '—';
    this.id           = config.id           || `result-${Math.random().toString(36).slice(2, 7)}`;
    this.unit         = config.unit         || '';
    this.status       = config.status       || 'success';
    this.note         = config.note         || '';
    this.showCopy     = config.showCopy     !== false;
    this.showDownload = config.showDownload || false;
    this.showShare    = config.showShare    || false;
    this.onCopy       = config.onCopy       || null;
    this.onDownload   = config.onDownload   || null;
    this.breakdown    = config.breakdown    || [];
    this._element     = null;
  }

  
  render() {
    const card = document.createElement('div');
    card.className = `result-card result-card--${this.status}`;
    card.id = this.id;
    card.setAttribute('role', 'region');
    card.setAttribute('aria-label', this.title);

    
    const titleEl = document.createElement('div');
    titleEl.className = 'result-title';
    titleEl.innerHTML = `${this._statusIcon()} ${this.title}`;
    card.appendChild(titleEl);

    
    const valueEl = document.createElement('div');
    valueEl.className = 'result-value';
    valueEl.id = `${this.id}-value`;
    valueEl.setAttribute('aria-live', 'polite');
    valueEl.textContent = this._formatValue() + (this.unit ? ` ${this.unit}` : '');
    card.appendChild(valueEl);

    
    if (this.note) {
      const noteEl = document.createElement('p');
      noteEl.className = 'result-note';
      noteEl.textContent = this.note;
      card.appendChild(noteEl);
    }

    
    if (this.breakdown && this.breakdown.length) {
      const breakdownEl = document.createElement('div');
      breakdownEl.className = 'result-breakdown';
      this.breakdown.forEach(row => {
        const rowEl = document.createElement('div');
        rowEl.className = 'result-breakdown-row';
        rowEl.innerHTML = `
          <span class="result-breakdown-label">${row.label}</span>
          <span class="result-breakdown-value">${row.value}</span>
        `;
        breakdownEl.appendChild(rowEl);
      });
      card.appendChild(breakdownEl);
    }

    
    const actions = document.createElement('div');
    actions.className = 'result-actions';

    if (this.showCopy) {
      const copyBtn = new Button({
        variant: 'copy',
        text: 'Copy',
        size: 'sm',
        onClick: (e, btn) => this.copyToClipboard(btn),
      });
      actions.appendChild(copyBtn.render());
    }

    if (this.showDownload) {
      const dlBtn = new Button({
        variant: 'download',
        text: 'Download',
        size: 'sm',
        onClick: () => { if (this.onDownload) this.onDownload(this._getTextContent()); },
      });
      actions.appendChild(dlBtn.render());
    }

    if (this.showShare) {
      const shareBtn = new Button({
        variant: 'share',
        text: 'Share',
        size: 'sm',
        onClick: () => this._share(),
      });
      actions.appendChild(shareBtn.render());
    }

    if (actions.children.length) {
      card.appendChild(actions);
    }

    this._element = card;
    return card;
  }

  
  _formatValue() {
    if (typeof this.data === 'object' && this.data !== null) {
      
      if (this.data.primary !== undefined) return this.data.primary;
      return JSON.stringify(this.data);
    }
    if (typeof this.data === 'number') {
      return Number.isInteger(this.data) ? this.data.toString() : this.data.toFixed(2);
    }
    return String(this.data);
  }

  
  _statusIcon() {
    const icons = {
      success: '✅',
      warning: '⚠️',
      error:   '❌',
      info:    'ℹ️',
    };
    return icons[this.status] || '';
  }

  
  _getTextContent() {
    let text = `${this.title}: ${this._formatValue()}${this.unit ? ' ' + this.unit : ''}`;
    if (this.note) text += `\n${this.note}`;
    if (this.breakdown && this.breakdown.length) {
      text += '\n' + this.breakdown.map(r => `${r.label}: ${r.value}`).join('\n');
    }
    text += '\n\n— FreeToolsPDF (pdftoolsfree.in)';
    return text;
  }

  
  async copyToClipboard(btn) {
    const text = this._getTextContent();
    try {
      await navigator.clipboard.writeText(text);
      if (btn) btn.setDone('✓ Copied!');
      if (this.onCopy) this.onCopy(text);
      showToast('Copied to clipboard!', 'success');
    } catch {
      
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      if (btn) btn.setDone('✓ Copied!');
      if (this.onCopy) this.onCopy(text);
      showToast('Copied to clipboard!', 'success');
    }
  }

  
  async _share() {
    const shareData = {
      title: `${this.title} — FreeToolsPDF`,
      text: this._getTextContent(),
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {  }
    }

    
    await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`).catch(() => {});
    showToast('Link copied for sharing!', 'info');
  }

  
  update(newData, newUnit, newNote, newBreakdown) {
    this.data = newData;
    if (newUnit !== undefined) this.unit = newUnit;
    if (newNote !== undefined) this.note = newNote;
    if (newBreakdown !== undefined) this.breakdown = newBreakdown;

    if (!this._element) return;

    const valueEl = this._element.querySelector(`#${this.id}-value`);
    if (valueEl) {
      valueEl.textContent = this._formatValue() + (this.unit ? ` ${this.unit}` : '');
    }

    const noteEl = this._element.querySelector('.result-note');
    if (noteEl && this.note) {
      noteEl.textContent = this.note;
    }

    
    this._element.classList.add('result-updated');
    setTimeout(() => this._element && this._element.classList.remove('result-updated'), 600);
  }
}


(function injectResultCardStyles() {
  if (document.getElementById('result-card-styles')) return;
  const style = document.createElement('style');
  style.id = 'result-card-styles';
  style.textContent = `
    .result-card--success { --result-color: var(--success); border-color: rgba(63,143,95,0.3); }
    .result-card--warning { --result-color: var(--warning); border-color: rgba(231,164,41,0.3); }
    .result-card--error   { --result-color: var(--error);   border-color: rgba(179,67,46,0.3); }
    .result-card--info    { --result-color: var(--info);    border-color: rgba(217,133,63,0.3); }

    .result-card--success .result-value { color: var(--success); }
    .result-card--warning .result-value { color: var(--warning); }
    .result-card--error   .result-value { color: var(--error);   }
    .result-card--info    .result-value  { color: var(--info);   }

    .result-note {
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin: 0.25rem 0 0.5rem;
      line-height: 1.5;
    }

    .result-breakdown {
      margin-top: 0.75rem;
      border-top: 1px solid var(--card-border);
      padding-top: 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .result-breakdown-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.875rem;
    }

    .result-breakdown-label {
      color: var(--text-secondary);
    }

    .result-breakdown-value {
      font-weight: 600;
      color: var(--text);
    }

    @keyframes resultPulse {
      0%   { transform: scale(1); }
      40%  { transform: scale(1.04); }
      100% { transform: scale(1); }
    }
    .result-updated {
      animation: resultPulse 0.5s ease;
    }
  `;
  document.head.appendChild(style);
})();