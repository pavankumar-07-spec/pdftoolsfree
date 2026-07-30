class VectorInput {
  constructor(containerId, optionsOrLabel = {}) {
    this.container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (typeof optionsOrLabel === 'string') {
      this.label = optionsOrLabel;
      this.dimension = 3;
    } else {
      this.label = optionsOrLabel.label || 'Vector';
      this.dimension = optionsOrLabel.defaultDimension || 3;
    }
    this.init();
  }

  init() {
    this.container.innerHTML = `
      <div class="vector-input-container border border-border p-4 rounded-lg bg-surface" style="border: 1px solid var(--border); border-radius: var(--radius-md); padding: var(--space-4); background: var(--surface);">
        <div class="flex items-center justify-between mb-3" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-3);">
          <span class="font-semibold vector-label" style="font-weight: 600; font-family: var(--font-display);">${this.label}</span>
          <span class="text-xs text-secondary vector-dimension-label" style="font-size: var(--text-xs); color: var(--text-secondary);">${this.dimension}D Vector</span>
        </div>
        <div class="vector-fields flex gap-3" style="display: flex; gap: var(--space-3); align-items: center;">
          <div class="flex-1" style="flex: 1;">
            <label class="text-xs block text-secondary mb-1" style="font-size: var(--text-xs); color: var(--text-secondary); margin-bottom: var(--space-1); display: block;">X:</label>
            <input type="number" step="any" value="0" class="vector-val-x text-center py-1 border border-border rounded" style="width: 100%; text-align: center; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: var(--space-1) var(--space-2); background: var(--surface-2); color: var(--text);" />
          </div>
          <div class="flex-1" style="flex: 1;">
            <label class="text-xs block text-secondary mb-1" style="font-size: var(--text-xs); color: var(--text-secondary); margin-bottom: var(--space-1); display: block;">Y:</label>
            <input type="number" step="any" value="0" class="vector-val-y text-center py-1 border border-border rounded" style="width: 100%; text-align: center; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: var(--space-1) var(--space-2); background: var(--surface-2); color: var(--text);" />
          </div>
          <div class="flex-1 vector-field-z" style="flex: 1;">
            <label class="text-xs block text-secondary mb-1" style="font-size: var(--text-xs); color: var(--text-secondary); margin-bottom: var(--space-1); display: block;">Z:</label>
            <input type="number" step="any" value="0" class="vector-val-z text-center py-1 border border-border rounded" style="width: 100%; text-align: center; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: var(--space-1) var(--space-2); background: var(--surface-2); color: var(--text);" />
          </div>
        </div>
      </div>
    `;

    this.valX = this.container.querySelector('.vector-val-x');
    this.valY = this.container.querySelector('.vector-val-y');
    this.valZ = this.container.querySelector('.vector-val-z');
    this.fieldZ = this.container.querySelector('.vector-field-z');
    this.dimLabel = this.container.querySelector('.vector-dimension-label');

    this.setDimension(this.dimension);
  }

  setDimension(dim) {
    this.dimension = dim;
    if (this.dimLabel) {
      this.dimLabel.textContent = `${this.dimension}D Vector`;
    }
    if (dim === 2) {
      if (this.fieldZ) this.fieldZ.style.display = 'none';
      if (this.valZ) this.valZ.value = '0';
    } else {
      if (this.fieldZ) this.fieldZ.style.display = 'block';
    }
  }

  getData() {
    const x = parseFloat(this.valX.value) || 0;
    const y = parseFloat(this.valY.value) || 0;
    if (this.dimension === 2) {
      return [x, y];
    }
    const z = parseFloat(this.valZ.value) || 0;
    return [x, y, z];
  }

  setData(arr) {
    if (!Array.isArray(arr)) return;
    this.setDimension(arr.length);
    if (arr[0] !== undefined) this.valX.value = arr[0];
    if (arr[1] !== undefined) this.valY.value = arr[1];
    if (this.dimension === 3 && arr[2] !== undefined) {
      this.valZ.value = arr[2];
    }
  }
}

window.VectorInput = VectorInput;
