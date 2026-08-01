/**
 * Upgraded GST Tax Calculator Engine with Visual Breakdown Cards
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('calc-amount')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:1rem;margin-bottom:1.5rem">
        <div>
          <label class="form-label">Base Amount ($)</label>
          <input type="number" id="calc-amount" class="form-input" value="1000" min="1" step="10">
        </div>
        <div>
          <label class="form-label">GST Tax Rate (%)</label>
          <select id="calc-rate" class="form-input">
            <option value="5">5% (Essential Goods)</option>
            <option value="12">12% (Standard)</option>
            <option value="18" selected>18% (Services & Standard Goods)</option>
            <option value="28">28% (Luxury Goods)</option>
          </select>
        </div>
        <div>
          <label class="form-label">GST Calculation Mode</label>
          <select id="calc-mode" class="form-input">
            <option value="add" selected>➕ Exclusive (Add GST to Base)</option>
            <option value="remove">➖ Inclusive (Extract GST from Gross)</option>
          </select>
        </div>
      </div>
      <div class="flex gap-3 mt-4">
        <button id="calc-gst-btn" type="button" class="btn btn-primary flex-1">🧾 Calculate GST Tax Invoice Breakdown</button>
      </div>
    `;
  }

  function computeGST() {
    const rawBase = parseFloat(document.getElementById('calc-amount')?.value || 1000);
    const rate = parseFloat(document.getElementById('calc-rate')?.value || 18);
    const mode = document.getElementById('calc-mode')?.value || 'add';

    let netAmount = rawBase;
    let gstAmount = 0;
    let grossAmount = rawBase;

    if (mode === 'add') {
      gstAmount = (rawBase * rate) / 100;
      grossAmount = rawBase + gstAmount;
    } else {
      grossAmount = rawBase;
      netAmount = rawBase / (1 + rate / 100);
      gstAmount = grossAmount - netAmount;
    }

    const cgst = gstAmount / 2;
    const sgst = gstAmount / 2;

    let res = `==========================================================
               GST TAX INVOICE BREAKDOWN
==========================================================
Calculation Mode:        ${mode === 'add' ? 'GST EXCLUSIVE (Added)' : 'GST INCLUSIVE (Extracted)'}
Applied GST Rate:        ${rate}%

FINANCIAL SUMMARY:
Net Base Price:          $${netAmount.toFixed(2)}
Central GST (CGST ${(rate/2).toFixed(1)}%): $${cgst.toFixed(2)}
State GST (SGST ${(rate/2).toFixed(1)}%):   $${sgst.toFixed(2)}
Total GST Tax:           $${gstAmount.toFixed(2)}
==========================================================
GROSS TOTAL PRICE:       $${grossAmount.toFixed(2)}
==========================================================`;

    if (out) out.value = res;

    // Render Visual Breakdown Card
    const resultsCard = document.getElementById('gen-results-card');
    if (resultsCard) {
      resultsCard.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(160px, 1fr));gap:1rem;text-align:center">
          <div style="background:var(--surface-2);padding:1rem;border-radius:var(--radius-sm);border:1px solid var(--border)">
            <div style="font-size:0.8rem;color:var(--text-secondary)">Net Base Amount</div>
            <div style="font-size:1.6rem;font-weight:700;color:var(--primary)">$${netAmount.toFixed(2)}</div>
            <div style="font-size:0.75rem;color:var(--text-secondary)">Pre-tax Value</div>
          </div>
          <div style="background:var(--surface-2);padding:1rem;border-radius:var(--radius-sm);border:1px solid var(--border)">
            <div style="font-size:0.8rem;color:var(--text-secondary)">Total GST (${rate}%)</div>
            <div style="font-size:1.6rem;font-weight:700;color:#ef4444">$${gstAmount.toFixed(2)}</div>
            <div style="font-size:0.75rem;color:var(--text-secondary)">CGST: $${cgst.toFixed(2)} | SGST: $${sgst.toFixed(2)}</div>
          </div>
          <div style="background:var(--surface-2);padding:1rem;border-radius:var(--radius-sm);border:1px solid var(--border)">
            <div style="font-size:0.8rem;color:var(--text-secondary)">Gross Total</div>
            <div style="font-size:1.8rem;font-weight:800;color:#22c55e">$${grossAmount.toFixed(2)}</div>
            <div style="font-size:0.75rem;color:var(--text-secondary)">Final Invoice Amount</div>
          </div>
        </div>
      `;
    }

    if (window.showToast) window.showToast(`Gross Total: $${grossAmount.toFixed(2)}`, 'success');
  }

  const activeBtn = document.getElementById('calc-gst-btn') || btn;
  if (activeBtn) activeBtn.onclick = () => computeGST();
  computeGST();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});