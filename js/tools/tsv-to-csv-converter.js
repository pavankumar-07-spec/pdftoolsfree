/**
 * TSV to CSV Converter Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const ic = document.getElementById('tool-inputs-container');
  const out = document.getElementById('main-output');
  if (ic && !document.getElementById('tsv-input')) {
    ic.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label">TSV Input (Tab-Separated Values)</label>
        <textarea id="tsv-input" class="form-input" rows="5" placeholder="Name\tAge\tCity">Name\tAge\tCity\nJohn\t25\tMumbai\nJane\t30\tDelhi</textarea>
      </div>
      <button id="calc-tsv-btn" class="btn btn-primary" style="width:100%">🔄 Convert TSV → CSV</button>
    `;
  }
  function convert() {
    try {
      const input = document.getElementById('tsv-input')?.value || '';
      const lines = input.split('\n');
      const csv = lines.map(line => {
        return line.split('\t').map(cell => {
          if (cell.includes(',') || cell.includes('"')) return '"' + cell.replace(/"/g, '""') + '"';
          return cell;
        }).join(',');
      }).join('\n');
      const rowCount = lines.length;
      const colCount = lines[0] ? lines[0].split('\t').length : 0;
      if (out) out.value = csv;
      if (window.showToast) window.showToast('Converted ' + rowCount + ' rows × ' + colCount + ' cols to CSV!', 'success');
    } catch (e) { if (out) out.value = 'Error: ' + e.message; }
  }
  const b = document.getElementById('calc-tsv-btn') || document.getElementById('generate-btn');
  if (b) b.onclick = convert;
  convert();
});