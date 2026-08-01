/**
 * Upgraded Professional Multi-Currency Invoice Generator Engine (50 Template Presets)
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const out = document.getElementById('main-output');

  if (inputsContainer) {
    const catalog = window.TEMPLATE_CATALOG ? window.TEMPLATE_CATALOG.invoices : [];
    let optionsHtml = '';

    if (catalog && catalog.length > 0) {
      optionsHtml = catalog.map((t, idx) => `<option value="${t.id}" ${idx === 0 ? 'selected' : ''}>${t.name}</option>`).join('');
    } else {
      for (let i = 1; i <= 50; i++) {
        const num = i < 10 ? '0' + i : '' + i;
        optionsHtml += `<option value="invoice-${num}" ${i === 1 ? 'selected' : ''}>Invoice Template ${num}: Style #${i}</option>`;
      }
    }

    inputsContainer.innerHTML = `
      <div class="template-selector-wrap" style="margin-bottom:1.5rem">
        <span class="template-badge-chip">✨ Select Invoice Template (50 Presets Available)</span>
        <select id="inv-template-style" class="form-input" style="font-weight:700">
          ${optionsHtml}
        </select>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:1rem;margin-bottom:1.5rem">
        <div>
          <label class="form-label">Currency Symbol</label>
          <select id="inv-currency" class="form-input">
            <option value="₹">₹ (INR - Indian Rupee)</option>
            <option value="$" selected>$ (USD - US Dollar)</option>
            <option value="€">€ (EUR - Euro)</option>
            <option value="£">£ (GBP - British Pound)</option>
            <option value="AED">AED (UAE Dirham)</option>
          </select>
        </div>
        <div>
          <label class="form-label">Invoice Number</label>
          <input type="text" id="inv-number" class="form-input" value="INV-2026-001">
        </div>
        <div>
          <label class="form-label">Invoice Date</label>
          <input type="date" id="inv-date" class="form-input" value="${new Date().toISOString().split('T')[0]}">
        </div>
        <div>
          <label class="form-label">Due Date</label>
          <input type="date" id="inv-due-date" class="form-input" value="${new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]}">
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(240px, 1fr));gap:1rem;margin-bottom:1.5rem">
        <div style="background:var(--surface-2);padding:1rem;border-radius:var(--radius-sm);border:1px solid var(--border)">
          <h4 style="margin:0 0 0.5rem;font-size:0.95rem;color:var(--primary)">🏢 Billed From (Your Business)</h4>
          <input type="text" id="inv-company" class="form-input mb-2" placeholder="Your Business Name" value="Apex Digital Solutions">
          <input type="text" id="inv-comp-address" class="form-input" placeholder="Address, Email or Tax ID" value="Bangalore, KA, India &bull; GST: 29AAAAA0000A1Z5">
        </div>
        <div style="background:var(--surface-2);padding:1rem;border-radius:var(--radius-sm);border:1px solid var(--border)">
          <h4 style="margin:0 0 0.5rem;font-size:0.95rem;color:var(--primary)">👤 Billed To (Client Details)</h4>
          <input type="text" id="inv-client" class="form-input mb-2" placeholder="Client Name / Company" value="Global Innovations Inc.">
          <input type="text" id="inv-client-address" class="form-input" placeholder="Client Address or Email" value="San Francisco, CA, USA">
        </div>
      </div>

      <div style="margin-bottom:1.5rem">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem">
          <h4 style="margin:0;font-size:0.95rem">🛒 Invoice Line Items</h4>
          <button id="add-item-btn" type="button" class="btn btn-secondary btn-sm">+ Add Item</button>
        </div>
        <div id="inv-items-table" style="display:flex;flex-direction:column;gap:0.5rem">
          <div class="inv-item-row" style="display:grid;grid-template-columns:3fr 1fr 1.5fr auto;gap:0.5rem;align-items:center">
            <input type="text" class="form-input item-desc" placeholder="Item description" value="UI/UX Web Design & Development">
            <input type="number" class="form-input item-qty" placeholder="Qty" value="1" min="1">
            <input type="number" class="form-input item-price" placeholder="Price" value="1500" min="0">
            <button type="button" class="btn-remove-row" style="background:rgba(239,68,68,0.1);color:#ef4444;border:none;width:32px;height:32px;border-radius:6px;cursor:pointer">&times;</button>
          </div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:1rem;margin-bottom:1.5rem">
        <div>
          <label class="form-label">Tax Rate (%)</label>
          <input type="number" id="inv-tax" class="form-input" value="18" min="0" max="100">
        </div>
        <div>
          <label class="form-label">Discount (%)</label>
          <input type="number" id="inv-discount" class="form-input" value="5" min="0" max="100">
        </div>
      </div>

      <div class="flex gap-3 mt-4">
        <button id="generate-btn" type="button" class="btn btn-primary flex-1">⚡ Generate Invoice</button>
        <button id="print-inv-btn" type="button" class="btn btn-accent">🖨️ Print / Save PDF</button>
      </div>
    `;
  }

  function calculateInvoice() {
    const style = document.getElementById('inv-template-style') ? document.getElementById('inv-template-style').value : 'invoice-01';
    const curr = document.getElementById('inv-currency') ? document.getElementById('inv-currency').value : '$';
    const num = document.getElementById('inv-number') ? document.getElementById('inv-number').value : 'INV-2026-001';
    const date = document.getElementById('inv-date') ? document.getElementById('inv-date').value : '';
    const dueDate = document.getElementById('inv-due-date') ? document.getElementById('inv-due-date').value : '';

    const comp = document.getElementById('inv-company') ? document.getElementById('inv-company').value : 'My Business';
    const compAddr = document.getElementById('inv-comp-address') ? document.getElementById('inv-comp-address').value : '';

    const client = document.getElementById('inv-client') ? document.getElementById('inv-client').value : 'Client Name';
    const clientAddr = document.getElementById('inv-client-address') ? document.getElementById('inv-client-address').value : '';

    const taxPct = parseFloat(document.getElementById('inv-tax') ? document.getElementById('inv-tax').value : 0) || 0;
    const discountPct = parseFloat(document.getElementById('inv-discount') ? document.getElementById('inv-discount').value : 0) || 0;

    let subtotal = 0;
    const lineItems = [];

    const rows = document.querySelectorAll('.inv-item-row');
    rows.forEach(row => {
      const desc = row.querySelector('.item-desc') ? row.querySelector('.item-desc').value : 'Service';
      const qty = parseFloat(row.querySelector('.item-qty') ? row.querySelector('.item-qty').value : 1) || 1;
      const price = parseFloat(row.querySelector('.item-price') ? row.querySelector('.item-price').value : 0) || 0;
      const rowTotal = qty * price;

      subtotal += rowTotal;
      lineItems.push({ desc, qty, price, rowTotal });
    });

    const discountAmount = (subtotal * discountPct) / 100;
    const taxableSubtotal = subtotal - discountAmount;
    const taxAmount = (taxableSubtotal * taxPct) / 100;
    const grandTotal = taxableSubtotal + taxAmount;

    let statement = `====================================================================\n`;
    statement += `                      OFFICIAL INVOICE                              \n`;
    statement += `                 TEMPLATE PRESET: ${style.toUpperCase()}             \n`;
    statement += `====================================================================\n`;
    statement += `Invoice #: ${num}\n`;
    statement += `Date:      ${date}           Due Date: ${dueDate}\n\n`;
    statement += `FROM: ${comp}\n      ${compAddr}\n\n`;
    statement += `TO:   ${client}\n      ${clientAddr}\n`;
    statement += `--------------------------------------------------------------------\n`;
    statement += `Description                             Qty    Unit Price   Total (${curr})\n`;
    statement += `--------------------------------------------------------------------\n`;

    lineItems.forEach(item => {
      const descStr = item.desc.length > 38 ? item.desc.slice(0, 35) + '...' : item.desc.padEnd(38);
      const qtyStr = item.qty.toString().padStart(5);
      const priceStr = item.price.toFixed(2).padStart(12);
      const totalStr = item.rowTotal.toFixed(2).padStart(12);
      statement += `${descStr} ${qtyStr} ${priceStr} ${totalStr}\n`;
    });

    statement += `--------------------------------------------------------------------\n`;
    statement += `Subtotal:                                       ${curr} ${subtotal.toFixed(2)}\n`;
    if (discountPct > 0) {
      statement += `Discount (${discountPct}%):                                 -${curr} ${discountAmount.toFixed(2)}\n`;
    }
    if (taxPct > 0) {
      statement += `Tax (${taxPct}%):                                    +${curr} ${taxAmount.toFixed(2)}\n`;
    }
    statement += `====================================================================\n`;
    statement += `BALANCE DUE (${curr}):                             ${curr} ${grandTotal.toFixed(2)}\n`;
    statement += `====================================================================\n`;

    if (out) out.value = statement;
  }

  const btn = document.getElementById('generate-btn');
  if (btn) btn.addEventListener('click', calculateInvoice);
  const styleSelect = document.getElementById('inv-template-style');
  if (styleSelect) styleSelect.addEventListener('change', calculateInvoice);

  calculateInvoice();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});