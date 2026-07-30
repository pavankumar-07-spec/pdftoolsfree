/**
 * Invoice Generator Engine - Deep SEO Alignment
 */
document.addEventListener('DOMContentLoaded', () => {
  const compIn = document.getElementById('inv-company');
  const clientIn = document.getElementById('inv-client');
  const numIn = document.getElementById('inv-number');
  const dateIn = document.getElementById('inv-date');
  const itemIn = document.getElementById('inv-item');
  const rateIn = document.getElementById('inv-rate');
  const taxIn = document.getElementById('inv-tax');
  const btn = document.getElementById('generate-btn');
  const downloadBtn = document.getElementById('download-btn');
  const out = document.getElementById('main-output');

  function calculateInvoice() {
    const comp = compIn ? compIn.value : 'Apex Digital';
    const client = clientIn ? clientIn.value : 'Global Innovations';
    const num = numIn ? numIn.value : 'INV-2026-001';
    const date = dateIn ? dateIn.value : '2026-07-25';
    const item = itemIn ? itemIn.value : 'Web Development Services';
    const rate = parseFloat(rateIn ? rateIn.value : 1500);
    const taxPct = parseFloat(taxIn ? taxIn.value : 10);

    const taxAmount = (rate * taxPct) / 100;
    const totalAmount = rate + taxAmount;

    const invoiceText = `==================================================
                 OFFICIAL INVOICE
==================================================
Invoice #: ${num}
Date: ${date}
Billed From: ${comp}
Billed To: ${client}

--------------------------------------------------
Description                           Amount
--------------------------------------------------
${item.padEnd(36)} $${rate.toFixed(2)}

--------------------------------------------------
Subtotal:                             $${rate.toFixed(2)}
Tax (${taxPct}%):                           $${taxAmount.toFixed(2)}
==================================================
TOTAL DUE:                            $${totalAmount.toFixed(2)}
==================================================`;

    if (out) out.value = invoiceText;
    if (window.showToast) window.showToast('Invoice calculated!', 'success');
  }

  if (btn) btn.addEventListener('click', calculateInvoice);
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const blob = new Blob([out ? out.value : ''], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'invoice-generator-output.txt';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      if (a.parentNode) a.parentNode.removeChild(a);
      URL.revokeObjectURL(url);
    }, 2000);
    if (window.showToast) window.showToast('File downloaded successfully!', 'success');
    });
  }

  calculateInvoice();
});