/**
 * Upgraded Interactive Expense Tracker Engine with LocalStorage Persistence
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const out = document.getElementById('main-output');

  const defaultState = {
    monthlyIncome: 3500,
    items: [
      { id: 1, title: '🏠 Apartment Rent', amount: 1200, category: 'Housing' },
      { id: 2, title: '🛒 Groceries & Food', amount: 450, category: 'Food' },
      { id: 3, title: '⚡ Utilities & Internet', amount: 200, category: 'Bills' },
      { id: 4, title: '🚗 Fuel & Transport', amount: 150, category: 'Transport' }
    ]
  };

  let store = null;
  let currentState = JSON.parse(JSON.stringify(defaultState));

  if (window.initPlannerPersistence) {
    store = window.initPlannerPersistence('expense-tracker', defaultState, (newState) => {
      currentState = newState;
      renderApp();
    });
    currentState = store.loadState();
  }

  if (inputsContainer) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label">💵 Total Monthly Income ($)</label>
        <input type="number" id="exp-inc-input" class="form-input" value="${currentState.monthlyIncome}" min="0">
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label">➕ Add Expense Item</label>
        <div style="display:grid;grid-template-columns:2fr 1fr button;gap:0.5rem">
          <input type="text" id="new-item-title" class="form-input" placeholder="e.g. 🍿 Movie Night">
          <input type="number" id="new-item-amount" class="form-input" placeholder="Amount ($)" min="1">
          <button type="button" id="add-exp-btn" class="btn btn-primary" style="white-space:nowrap">+ Add</button>
        </div>
      </div>
      <div id="exp-items-container" style="margin-bottom:1rem"></div>
      <button type="button" id="exp-calc-btn" class="btn btn-primary w-full">📈 Audit Monthly Cash Flow & Save</button>
    `;
  }

  function renderApp() {
    const incInput = document.getElementById('exp-inc-input');
    if (incInput) incInput.value = currentState.monthlyIncome;

    const itemsContainer = document.getElementById('exp-items-container');
    if (itemsContainer) {
      let html = '<div style="display:flex;flex-direction:column;gap:0.5rem">';
      currentState.items.forEach((item, idx) => {
        html += `
          <div style="display:flex;align-items:center;justify-content:space-between;padding:0.75rem;background:var(--surface-2);border-radius:var(--radius-sm);border:1px solid var(--border)">
            <div>
              <span style="font-weight:600">${item.title}</span>
              <span style="font-size:0.75rem;color:var(--text-secondary);margin-left:0.5rem">(${item.category})</span>
            </div>
            <div style="display:flex;align-items:center;gap:0.75rem">
              <span style="font-weight:700;color:#ef4444">-$${item.amount.toFixed(2)}</span>
              <button type="button" data-idx="${idx}" class="exp-del-btn btn btn-secondary btn-sm" style="padding:0.2rem 0.5rem;color:var(--error);font-size:0.8rem">🗑️</button>
            </div>
          </div>
        `;
      });
      html += '</div>';
      itemsContainer.innerHTML = html;

      // Event listeners
      document.querySelectorAll('.exp-del-btn').forEach(btn => {
        btn.onclick = (e) => {
          const idx = parseInt(e.target.getAttribute('data-idx'));
          currentState.items.splice(idx, 1);
          if (store) store.saveState(currentState);
          renderApp();
        };
      });
    }

    generateReport();
  }

  function generateReport() {
    const incInput = document.getElementById('exp-inc-input');
    if (incInput) currentState.monthlyIncome = parseFloat(incInput.value || 0);

    const inc = currentState.monthlyIncome;
    const totalExp = currentState.items.reduce((sum, item) => sum + item.amount, 0);
    const netSavings = inc - totalExp;
    const expRatio = inc > 0 ? (totalExp / inc) * 100 : 0;

    let res = `==========================================================
             MONTHLY EXPENSE & CASH FLOW AUDIT
==========================================================
Monthly Income:         $${inc.toLocaleString('en-US', { minimumFractionDigits: 2 })}
Total Expenses:         $${totalExp.toLocaleString('en-US', { minimumFractionDigits: 2 })} (${expRatio.toFixed(1)}% of income)
Net Remaining Savings:  $${netSavings.toLocaleString('en-US', { minimumFractionDigits: 2 })}

EXPENSE ITEMIZATION:
`;

    currentState.items.forEach(item => {
      res += `• ${item.title.padEnd(25)} : -$${item.amount.toFixed(2)}\n`;
    });

    res += `\n==========================================================
Financial Health: ${netSavings >= 0 ? '🟢 HEALTHY POSITIVE CASH FLOW' : '🔴 DEFICIT! EXPENSES EXCEED INCOME'}
==========================================================`;

    if (out) out.value = res;

    // Render Visual Dashboard Card
    const resultsCard = document.getElementById('gen-results-card');
    if (resultsCard) {
      resultsCard.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:1rem;text-align:center">
          <div style="background:var(--surface-2);padding:1rem;border-radius:var(--radius-sm);border:1px solid var(--border)">
            <div style="font-size:0.8rem;color:var(--text-secondary)">Monthly Income</div>
            <div style="font-size:1.8rem;font-weight:800;color:var(--primary)">$${inc.toFixed(0)}</div>
          </div>
          <div style="background:var(--surface-2);padding:1rem;border-radius:var(--radius-sm);border:1px solid var(--border)">
            <div style="font-size:0.8rem;color:var(--text-secondary)">Total Expenses</div>
            <div style="font-size:1.8rem;font-weight:700;color:#ef4444">$${totalExp.toFixed(0)}</div>
            <div style="font-size:0.75rem;color:var(--text-secondary)">${expRatio.toFixed(0)}% of income</div>
          </div>
          <div style="background:var(--surface-2);padding:1rem;border-radius:var(--radius-sm);border:1px solid var(--border)">
            <div style="font-size:0.8rem;color:var(--text-secondary)">Net Savings</div>
            <div style="font-size:1.8rem;font-weight:800;color:${netSavings >= 0 ? '#22c55e' : '#ef4444'}">$${netSavings.toFixed(0)}</div>
            <div style="font-size:0.75rem;color:var(--text-secondary)">${netSavings >= 0 ? 'Surplus' : 'Deficit'}</div>
          </div>
        </div>
      `;
    }
  }

  const addBtn = document.getElementById('add-exp-btn');
  if (addBtn) {
    addBtn.onclick = () => {
      const titleIn = document.getElementById('new-item-title');
      const amtIn = document.getElementById('new-item-amount');
      const title = titleIn ? titleIn.value.trim() : '';
      const amount = amtIn ? parseFloat(amtIn.value || 0) : 0;

      if (title && amount > 0) {
        currentState.items.push({ id: Date.now(), title, amount, category: 'General' });
        titleIn.value = '';
        amtIn.value = '';
        if (store) store.saveState(currentState);
        renderApp();
      }
    };
  }

  const incInput = document.getElementById('exp-inc-input');
  if (incInput) {
    incInput.onchange = () => {
      currentState.monthlyIncome = parseFloat(incInput.value || 0);
      if (store) store.saveState(currentState);
      generateReport();
    };
  }

  const calcBtn = document.getElementById('exp-calc-btn');
  if (calcBtn) calcBtn.onclick = () => generateReport();

  renderApp();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});