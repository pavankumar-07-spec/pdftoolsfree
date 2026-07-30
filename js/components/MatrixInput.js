class MatrixInput {
  constructor(containerId, optionsOrLabel = {}) {
    this.container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (typeof optionsOrLabel === 'string') {
      this.label = optionsOrLabel;
      this.rows = 3;
      this.cols = 3;
    } else {
      this.label = optionsOrLabel.label || 'Matrix';
      this.rows = optionsOrLabel.defaultRows || 3;
      this.cols = optionsOrLabel.defaultCols || 3;
    }
    this.init();
  }


  init() {
    this.container.innerHTML = `
      <div class="matrix-input-container border border-border p-4 rounded-lg bg-surface" style="border: 1px solid var(--border); border-radius: var(--radius-md); padding: var(--space-4); background: var(--surface);">
        <div class="flex items-center justify-between mb-3 gap-3 flex-wrap" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-3); gap: var(--space-3); flex-wrap: wrap;">
          <span class="font-semibold matrix-label" style="font-weight: 600; font-family: var(--font-display);">${this.label}</span>
          <div class="flex items-center gap-2" style="display: flex; align-items: center; gap: var(--space-2);">
            <label style="font-size: var(--text-xs); color: var(--text-secondary);">Rows:</label>
            <select class="matrix-rows border border-border rounded px-2 py-1 bg-surface-2 text-sm" style="border: 1px solid var(--border); border-radius: var(--radius-sm); padding: var(--space-1) var(--space-2); background: var(--surface-2); font-size: var(--text-sm); color: var(--text);">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3" selected>3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
            <label style="font-size: var(--text-xs); color: var(--text-secondary);">Cols:</label>
            <select class="matrix-cols border border-border rounded px-2 py-1 bg-surface-2 text-sm" style="border: 1px solid var(--border); border-radius: var(--radius-sm); padding: var(--space-1) var(--space-2); background: var(--surface-2); font-size: var(--text-sm); color: var(--text);">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3" selected>3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
        </div>
        <div class="matrix-grid-wrapper py-2" style="overflow-x: auto; padding: var(--space-2) 0;">
          <div class="matrix-grid gap-2 grid justify-center" style="display: grid; gap: var(--space-2); justify-content: center; justify-items: center;">
            <!-- Generated inputs will go here -->
          </div>
        </div>
      </div>
    `;

    this.rowsSelect = this.container.querySelector('.matrix-rows');
    this.colsSelect = this.container.querySelector('.matrix-cols');
    this.grid = this.container.querySelector('.matrix-grid');

    this.rowsSelect.addEventListener('change', (e) => {
      this.rows = parseInt(e.target.value, 10);
      this.generateGrid();
    });

    this.colsSelect.addEventListener('change', (e) => {
      this.cols = parseInt(e.target.value, 10);
      this.generateGrid();
    });

    this.generateGrid();
  }

  generateGrid() {
    this.grid.innerHTML = '';
    this.grid.style.gridTemplateColumns = `repeat(${this.cols}, minmax(50px, 80px))`;

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const input = document.createElement('input');
        input.type = 'number';
        input.step = 'any';
        input.value = '0';
        input.className = 'matrix-cell-input text-center py-1 border border-border rounded';
        input.style.width = '100%';
        input.style.textAlign = 'center';
        input.style.border = '1px solid var(--border)';
        input.style.borderRadius = 'var(--radius-sm)';
        input.style.padding = 'var(--space-1) var(--space-2)';
        input.style.background = 'var(--surface-2)';
        input.style.color = 'var(--text)';
        input.dataset.row = r;
        input.dataset.col = c;
        this.grid.appendChild(input);
      }
    }
  }

  setDimensions(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.rowsSelect.value = rows;
    this.colsSelect.value = cols;
    this.generateGrid();
  }

  getData() {
    const data = Array.from({ length: this.rows }, () => Array(this.cols).fill(0));
    const inputs = this.grid.querySelectorAll('.matrix-cell-input');
    inputs.forEach(input => {
      const r = parseInt(input.dataset.row, 10);
      const c = parseInt(input.dataset.col, 10);
      data[r][c] = parseFloat(input.value) || 0;
    });
    return data;
  }

  setData(data) {
    if (!Array.isArray(data) || !data.length || !Array.isArray(data[0])) return;
    this.setDimensions(data.length, data[0].length);
    const inputs = this.grid.querySelectorAll('.matrix-cell-input');
    inputs.forEach(input => {
      const r = parseInt(input.dataset.row, 10);
      const c = parseInt(input.dataset.col, 10);
      if (data[r] !== undefined && data[r][c] !== undefined) {
        input.value = data[r][c];
      }
    });
  }
}

window.MatrixInput = MatrixInput;
