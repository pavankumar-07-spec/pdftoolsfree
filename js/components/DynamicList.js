class DynamicList {
  
  constructor(config = {}) {
    this.id = config.id || `dynlist-${Math.random().toString(36).slice(2, 7)}`;
    this.items = config.initialItems || [];
    this.renderRow = config.renderRow;
    this.onAdd = config.onAdd || (() => ({}));
    this.onChange = config.onChange || null;
    this.addButtonText = config.addButtonText || 'Add Row';
    this.maxItems = config.maxItems || 20;
    
    this._element = null;
    this._listContainer = null;
    this._addBtn = null;
  }

  
  render() {
    const wrapper = document.createElement('div');
    wrapper.className = 'dynamic-list-wrapper';
    wrapper.id = this.id;

    
    this._listContainer = document.createElement('div');
    this._listContainer.className = 'dynamic-list-container';
    this._listContainer.style.display = 'flex';
    this._listContainer.style.flexDirection = 'column';
    this._listContainer.style.gap = 'var(--space-4)';
    wrapper.appendChild(this._listContainer);

    
    const btnWrap = document.createElement('div');
    btnWrap.style.marginTop = 'var(--space-4)';
    
    this._addBtn = new Button({
      variant: 'outline',
      text: this.addButtonText,
      icon: '➕',
      size: 'sm',
      onClick: () => this.addItem()
    });
    
    btnWrap.appendChild(this._addBtn.render());
    wrapper.appendChild(btnWrap);

    this._element = wrapper;
    this._renderItems();

    return wrapper;
  }

  
  _renderItems() {
    if (!this._listContainer) return;
    this._listContainer.innerHTML = '';

    this.items.forEach((item, index) => {
      const rowWrap = document.createElement('div');
      rowWrap.className = 'dynamic-list-row';
      rowWrap.style.display = 'flex';
      rowWrap.style.gap = 'var(--space-3)';
      rowWrap.style.alignItems = 'flex-start';
      rowWrap.style.animation = 'fadeIn 0.3s ease';

      
      const userRow = this.renderRow(item, index);
      userRow.style.flex = '1';
      rowWrap.appendChild(userRow);

      
      if (this.items.length > 1) {
        const removeBtn = document.createElement('button');
        removeBtn.className = 'btn btn-ghost btn-sm';
        removeBtn.innerHTML = '🗑️';
        removeBtn.setAttribute('aria-label', 'Remove row');
        removeBtn.style.padding = '0.5rem';
        removeBtn.onclick = () => this.removeItem(index);
        rowWrap.appendChild(removeBtn);
      } else {
        
        const placeholder = document.createElement('div');
        placeholder.style.width = '36px';
        rowWrap.appendChild(placeholder);
      }

      this._listContainer.appendChild(rowWrap);
    });

    this._updateAddButton();
  }

  
  addItem() {
    if (this.items.length >= this.maxItems) {
      if (typeof showToast !== 'undefined') showToast(`Maximum ${this.maxItems} items allowed.`, 'warning');
      return;
    }
    
    const newItem = this.onAdd(this.items.length);
    this.items.push(newItem);
    this._renderItems();
    this._triggerChange();
  }

  
  removeItem(index) {
    if (this.items.length <= 1) return;
    this.items.splice(index, 1);
    this._renderItems();
    this._triggerChange();
  }

  
  _updateAddButton() {
    if (this._addBtn) {
      this._addBtn.setDisabled(this.items.length >= this.maxItems);
    }
  }

  
  _triggerChange() {
    if (this.onChange) this.onChange(this.items);
  }

  
  getItems() {
    return this.items;
  }
}