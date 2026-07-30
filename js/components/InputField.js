class InputField {
  
  constructor(config = {}) {
    this.type         = config.type || 'text';
    this.label        = config.label || '';
    this.id           = config.id || `input-${Math.random().toString(36).slice(2, 7)}`;
    this.required     = config.required || false;
    this.placeholder  = config.placeholder || '';
    this.helpText     = config.helpText || '';
    this.min          = config.min !== undefined ? config.min : null;
    this.max          = config.max !== undefined ? config.max : null;
    this.step         = config.step !== undefined ? config.step : null;
    this.defaultValue = config.defaultValue !== undefined ? config.defaultValue : '';
    this.options      = config.options || [];
    this.accept       = config.accept || '';
    this.onChange     = config.onChange || null;
    this._element     = null;
    this._errorEl     = null;
  }

  
  render() {
    const group = document.createElement('div');
    group.className = 'form-group';
    group.dataset.inputId = this.id;

    
    if (this.label) {
      const label = document.createElement('label');
      label.className = 'form-label';
      label.htmlFor = this.id;
      label.innerHTML = this.label + (this.required ? '<span class="required" aria-hidden="true">*</span>' : '');
      group.appendChild(label);
    }

    
    const inputWrap = document.createElement('div');
    inputWrap.className = 'input-wrap';
    group.appendChild(inputWrap);

    
    let inputEl;

    switch (this.type) {
      case 'dropdown':
        inputEl = this._buildSelect();
        break;
      case 'range':
        inputEl = this._buildRange(inputWrap);
        break;
      case 'file':
        inputEl = this._buildFile(inputWrap);
        break;
      default:
        inputEl = this._buildTextLike();
    }

    this._element = inputEl;
    inputWrap.appendChild(inputEl);

    
    const errorEl = document.createElement('div');
    errorEl.className = 'form-error';
    errorEl.id = `${this.id}-error`;
    errorEl.setAttribute('aria-live', 'polite');
    errorEl.style.display = 'none';
    this._errorEl = errorEl;
    group.appendChild(errorEl);

    
    if (this.helpText) {
      const help = document.createElement('div');
      help.className = 'form-help';
      help.id = `${this.id}-help`;
      help.textContent = this.helpText;
      group.appendChild(help);
      inputEl.setAttribute('aria-describedby', `${this.id}-help`);
    }

    
    if (this.onChange) {
      inputEl.addEventListener('input', (e) => {
        this.clearError();
        this.onChange(this.getValue(), e);
      });
    }

    this._group = group;
    return group;
  }

  
  _buildTextLike() {
    const input = document.createElement('input');
    input.type = this.type;
    input.id = this.id;
    input.name = this.id;
    input.className = 'form-input';
    input.placeholder = this.placeholder;
    if (this.required) input.required = true;
    if (this.defaultValue !== '') input.value = this.defaultValue;
    if (this.min !== null) input.min = this.min;
    if (this.max !== null) input.max = this.max;
    if (this.step !== null) input.step = this.step;
    input.setAttribute('aria-required', this.required ? 'true' : 'false');
    input.addEventListener('blur', () => this.validate());
    return input;
  }

  
  _buildSelect() {
    const select = document.createElement('select');
    select.id = this.id;
    select.name = this.id;
    select.className = 'form-input form-select';
    if (this.required) select.required = true;

    
    if (this.placeholder) {
      const placeholder = document.createElement('option');
      placeholder.value = '';
      placeholder.disabled = true;
      placeholder.selected = true;
      placeholder.textContent = this.placeholder;
      select.appendChild(placeholder);
    }

    this.options.forEach(opt => {
      const option = document.createElement('option');
      option.value = opt.value !== undefined ? opt.value : opt;
      option.textContent = opt.label !== undefined ? opt.label : opt;
      if (opt.value === this.defaultValue || opt === this.defaultValue) {
        option.selected = true;
      }
      select.appendChild(option);
    });

    select.addEventListener('blur', () => this.validate());
    return select;
  }

  
  _buildRange(wrap) {
    wrap.classList.add('range-wrap');

    const input = document.createElement('input');
    input.type = 'range';
    input.id = this.id;
    input.name = this.id;
    input.className = 'form-range';
    if (this.min !== null) input.min = this.min;
    if (this.max !== null) input.max = this.max;
    if (this.step !== null) input.step = this.step;
    if (this.defaultValue !== '') input.value = this.defaultValue;

    const rangeRow = document.createElement('div');
    rangeRow.className = 'range-row';

    const valueDisplay = document.createElement('span');
    valueDisplay.className = 'range-value';
    valueDisplay.id = `${this.id}-display`;
    valueDisplay.textContent = input.value;
    input.setAttribute('aria-valuetext', input.value);

    input.addEventListener('input', () => {
      valueDisplay.textContent = input.value;
      input.setAttribute('aria-valuetext', input.value);
    });

    rangeRow.appendChild(document.createElement('span')); 
    rangeRow.appendChild(valueDisplay);
    rangeRow.appendChild(document.createElement('span')); 

    if (this.min !== null) rangeRow.firstChild.textContent = this.min;
    if (this.max !== null) rangeRow.lastChild.textContent = this.max;

    wrap.appendChild(input);
    wrap.appendChild(rangeRow);

    return input;
  }

  
  _buildFile(wrap) {
    wrap.classList.add('file-wrap');

    const fileLabel = document.createElement('label');
    fileLabel.htmlFor = this.id;
    fileLabel.className = 'file-upload-area';
    fileLabel.setAttribute('role', 'button');
    fileLabel.setAttribute('tabindex', '0');
    fileLabel.innerHTML = `
      <div class="file-upload-icon">📁</div>
      <div class="file-upload-text">
        <span class="file-upload-cta">Click to upload</span> or drag &amp; drop
      </div>
      <div class="file-upload-hint">${this.placeholder || 'Select a file'}</div>
      <div class="file-upload-name" id="${this.id}-name" style="display:none"></div>
    `;

    const input = document.createElement('input');
    input.type = 'file';
    input.id = this.id;
    input.name = this.id;
    input.className = 'file-input-hidden';
    if (this.accept) input.accept = this.accept;
    if (this.required) input.required = true;

    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const nameEl = wrap.querySelector(`#${this.id}-name`);
        if (nameEl) {
          nameEl.textContent = `📎 ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
          nameEl.style.display = 'block';
        }
        fileLabel.classList.add('has-file');
      }
    });

    
    ['dragover', 'dragenter'].forEach(ev => {
      fileLabel.addEventListener(ev, (e) => {
        e.preventDefault();
        fileLabel.classList.add('drag-over');
      });
    });

    ['dragleave', 'dragend'].forEach(ev => {
      fileLabel.addEventListener(ev, () => {
        fileLabel.classList.remove('drag-over');
      });
    });

    fileLabel.addEventListener('drop', (e) => {
      e.preventDefault();
      fileLabel.classList.remove('drag-over');
      if (e.dataTransfer.files.length) {
        input.files = e.dataTransfer.files;
        input.dispatchEvent(new Event('change'));
      }
    });

    wrap.appendChild(fileLabel);
    return input;
  }

  
  getValue() {
    if (!this._element) return null;

    switch (this.type) {
      case 'number':
        return this._element.value === '' ? null : parseFloat(this._element.value);
      case 'range':
        return parseFloat(this._element.value);
      case 'file':
        return this._element.files && this._element.files.length > 0
          ? this._element.files[0]
          : null;
      default:
        return this._element.value;
    }
  }

  
  setValue(value) {
    if (!this._element) return;
    this._element.value = value;
    if (this.type === 'range') {
      const display = document.getElementById(`${this.id}-display`);
      if (display) display.textContent = value;
    }
  }

  
  validate() {
    if (!this._element) return true;

    const value = this.getValue();
    let errorMsg = '';

    
    if (this.required) {
      if (value === null || value === '' || (this.type === 'file' && !value)) {
        errorMsg = `${this.label || 'This field'} is required.`;
      }
    }

    
    if (!errorMsg && this.type === 'number' && value !== null) {
      if (this.min !== null && value < this.min) {
        errorMsg = `Minimum value is ${this.min}.`;
      }
      if (this.max !== null && value > this.max) {
        errorMsg = `Maximum value is ${this.max}.`;
      }
    }

    
    if (!errorMsg && this._element.validity && !this._element.validity.valid) {
      errorMsg = this._element.validationMessage;
    }

    if (errorMsg) {
      this.showError(errorMsg);
      return false;
    }

    this.clearError();
    return true;
  }

  
  showError(msg) {
    if (!this._errorEl) return;
    this._errorEl.textContent = msg;
    this._errorEl.style.display = 'block';
    if (this._element) {
      this._element.classList.add('input-error');
      this._element.setAttribute('aria-invalid', 'true');
    }
  }

  
  clearError() {
    if (!this._errorEl) return;
    this._errorEl.style.display = 'none';
    this._errorEl.textContent = '';
    if (this._element) {
      this._element.classList.remove('input-error');
      this._element.setAttribute('aria-invalid', 'false');
    }
  }

  
  focus() {
    if (this._element) this._element.focus();
  }

  
  reset() {
    this.setValue(this.defaultValue);
    this.clearError();
  }

  
  setDisabled(disabled) {
    if (this._element) this._element.disabled = disabled;
  }
}


(function injectInputFieldStyles() {
  if (document.getElementById('input-field-styles')) return;
  const style = document.createElement('style');
  style.id = 'input-field-styles';
  style.textContent = `
    .form-error {
      font-size: 0.8125rem;
      color: var(--error);
      font-weight: 500;
      margin-top: 0.25rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
    .form-error::before { content: '⚠'; }

    .form-help {
      font-size: 0.8125rem;
      color: var(--text-muted);
      margin-top: 0.25rem;
    }

    .form-input.input-error {
      border-color: var(--error) !important;
      box-shadow: 0 0 0 3px rgba(179,67,46,0.12) !important;
    }

    .input-wrap { position: relative; width: 100%; }

    
    .form-range {
      width: 100%;
      height: 6px;
      -webkit-appearance: none;
      appearance: none;
      background: linear-gradient(to right, var(--primary) 0%, var(--primary) var(--range-pct, 50%), var(--bg-tertiary) var(--range-pct, 50%));
      border-radius: 999px;
      outline: none;
      cursor: pointer;
    }
    .form-range::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 20px; height: 20px;
      border-radius: 50%;
      background: white;
      border: 3px solid var(--primary);
      box-shadow: 0 2px 6px rgba(0,0,0,0.15);
      cursor: pointer;
      transition: box-shadow 0.15s;
    }
    .form-range::-webkit-slider-thumb:hover {
      box-shadow: 0 0 0 6px rgba(181,101,46,0.15);
    }
    .range-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-top: 0.375rem;
    }
    .range-value {
      font-weight: 700;
      color: var(--primary);
      font-size: 0.9375rem;
    }

    
    .file-input-hidden {
      position: absolute;
      width: 1px; height: 1px;
      opacity: 0; overflow: hidden;
    }
    .file-upload-area {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 2rem;
      border: 2px dashed var(--input-border);
      border-radius: var(--radius-lg);
      background: var(--input-bg);
      cursor: pointer;
      transition: all 0.2s;
      text-align: center;
      min-height: 120px;
    }
    .file-upload-area:hover,
    .file-upload-area:focus,
    .file-upload-area.drag-over {
      border-color: var(--primary);
      background: var(--primary-light);
    }
    .file-upload-area.has-file { border-color: var(--success); border-style: solid; }
    .file-upload-icon { font-size: 2rem; }
    .file-upload-text { font-size: 0.9375rem; color: var(--text-secondary); }
    .file-upload-cta { color: var(--primary); font-weight: 600; }
    .file-upload-hint { font-size: 0.8125rem; color: var(--text-muted); }
    .file-upload-name {
      font-size: 0.875rem;
      color: var(--success);
      font-weight: 500;
      background: var(--success-light);
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      margin-top: 0.25rem;
    }
  `;
  document.head.appendChild(style);
})();