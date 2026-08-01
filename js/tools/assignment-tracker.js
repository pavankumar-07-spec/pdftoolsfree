/**
 * Upgraded Assignment & Deadline Tracker Engine with LocalStorage Persistence
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const out = document.getElementById('main-output');

  const defaultState = {
    assignments: [
      { id: 1, title: '💻 Data Structures Lab 4', subject: 'CS201', due: '2026-08-05', status: 'In Progress' },
      { id: 2, title: '📄 Calculus Problem Set 3', subject: 'MATH102', due: '2026-08-08', status: 'Pending' },
      { id: 3, title: '🧪 Physics Lab Report 2', subject: 'PHYS101', due: '2026-08-02', status: 'Completed' }
    ]
  };

  let store = null;
  let currentState = JSON.parse(JSON.stringify(defaultState));

  if (window.initPlannerPersistence) {
    store = window.initPlannerPersistence('assignment-tracker', defaultState, (newState) => {
      currentState = newState;
      renderApp();
    });
    currentState = store.loadState();
  }

  if (inputsContainer) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label">➕ Add New Assignment</label>
        <div style="display:grid;grid-template-columns:2fr 1fr 1.2fr button;gap:0.5rem">
          <input type="text" id="new-asgn-title" class="form-input" placeholder="e.g. 📝 History Essay">
          <input type="text" id="new-asgn-subj" class="form-input" placeholder="Subject">
          <input type="date" id="new-asgn-due" class="form-input" value="2026-08-10">
          <button type="button" id="add-asgn-btn" class="btn btn-primary" style="white-space:nowrap">+ Add</button>
        </div>
      </div>
      <div id="asgn-items-container" style="margin-bottom:1rem"></div>
      <button type="button" id="asgn-calc-btn" class="btn btn-primary w-full">📊 Save & Generate Assignment Status Report</button>
    `;
  }

  function renderApp() {
    const itemsContainer = document.getElementById('asgn-items-container');
    if (itemsContainer) {
      let html = '<div style="display:flex;flex-direction:column;gap:0.5rem">';
      currentState.assignments.forEach((item, idx) => {
        let badgeColor = '#f59e0b';
        if (item.status === 'Completed') badgeColor = '#22c55e';
        if (item.status === 'Pending') badgeColor = '#ef4444';

        html += `
          <div style="display:flex;align-items:center;justify-content:space-between;padding:0.75rem;background:var(--surface-2);border-radius:var(--radius-sm);border:1px solid var(--border)">
            <div>
              <span style="font-weight:600">${item.title}</span>
              <span style="font-size:0.75rem;color:var(--text-secondary);margin-left:0.5rem">[${item.subject}] &bull; Due: ${item.due}</span>
            </div>
            <div style="display:flex;align-items:center;gap:0.5rem">
              <select data-idx="${idx}" class="asgn-status-select form-input" style="padding:0.25rem 0.5rem;font-size:0.8rem;width:auto">
                <option value="Pending" ${item.status === 'Pending' ? 'selected' : ''}>⏳ Pending</option>
                <option value="In Progress" ${item.status === 'In Progress' ? 'selected' : ''}>🛠️ In Progress</option>
                <option value="Completed" ${item.status === 'Completed' ? 'selected' : ''}>✅ Completed</option>
              </select>
              <button type="button" data-idx="${idx}" class="asgn-del-btn btn btn-secondary btn-sm" style="padding:0.2rem 0.5rem;color:var(--error);font-size:0.8rem">🗑️</button>
            </div>
          </div>
        `;
      });
      html += '</div>';
      itemsContainer.innerHTML = html;

      // Event listeners
      document.querySelectorAll('.asgn-status-select').forEach(sel => {
        sel.onchange = (e) => {
          const idx = parseInt(e.target.getAttribute('data-idx'));
          currentState.assignments[idx].status = e.target.value;
          if (store) store.saveState(currentState);
          generateReport();
        };
      });

      document.querySelectorAll('.asgn-del-btn').forEach(btn => {
        btn.onclick = (e) => {
          const idx = parseInt(e.target.getAttribute('data-idx'));
          currentState.assignments.splice(idx, 1);
          if (store) store.saveState(currentState);
          renderApp();
        };
      });
    }

    generateReport();
  }

  function generateReport() {
    const total = currentState.assignments.length;
    const completed = currentState.assignments.filter(a => a.status === 'Completed').length;
    const inProgress = currentState.assignments.filter(a => a.status === 'In Progress').length;
    const pending = currentState.assignments.filter(a => a.status === 'Pending').length;
    const pct = total > 0 ? (completed / total) * 100 : 0;

    let res = `==========================================================
             STUDENT ASSIGNMENT TRACKER REPORT
==========================================================
Total Tasks:         ${total} Assignments
Completed:           ${completed} (${pct.toFixed(1)}%)
In Progress:         ${inProgress}
Pending:             ${pending}

ASSIGNMENT STATUS BOARD:
`;

    currentState.assignments.forEach(a => {
      let icon = '⏳';
      if (a.status === 'Completed') icon = '✅';
      if (a.status === 'In Progress') icon = '🛠️';
      res += `${icon} [${a.status.padEnd(11)}] ${a.title.padEnd(25)} (${a.subject}) | Due: ${a.due}\n`;
    });

    res += `\n==========================================================
Summary: ${completed === total ? '🎉 ALL ASSIGNMENTS COMPLETED!' : `💪 ${pending + inProgress} pending assignments remaining.`}
==========================================================`;

    if (out) out.value = res;

    // Render Visual Breakdown Dashboard Card
    const resultsCard = document.getElementById('gen-results-card');
    if (resultsCard) {
      resultsCard.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(150px, 1fr));gap:1rem;text-align:center">
          <div style="background:var(--surface-2);padding:1rem;border-radius:var(--radius-sm);border:1px solid var(--border)">
            <div style="font-size:0.8rem;color:var(--text-secondary)">Completed</div>
            <div style="font-size:1.8rem;font-weight:800;color:#22c55e">${completed} / ${total}</div>
            <div style="font-size:0.75rem;color:var(--text-secondary)">${pct.toFixed(0)}% Completion</div>
          </div>
          <div style="background:var(--surface-2);padding:1rem;border-radius:var(--radius-sm);border:1px solid var(--border)">
            <div style="font-size:0.8rem;color:var(--text-secondary)">In Progress</div>
            <div style="font-size:1.8rem;font-weight:700;color:#f59e0b">${inProgress}</div>
            <div style="font-size:0.75rem;color:var(--text-secondary)">Active Work</div>
          </div>
          <div style="background:var(--surface-2);padding:1rem;border-radius:var(--radius-sm);border:1px solid var(--border)">
            <div style="font-size:0.8rem;color:var(--text-secondary)">Pending</div>
            <div style="font-size:1.8rem;font-weight:700;color:#ef4444">${pending}</div>
            <div style="font-size:0.75rem;color:var(--text-secondary)">Not Started</div>
          </div>
        </div>
      `;
    }
  }

  const addBtn = document.getElementById('add-asgn-btn');
  if (addBtn) {
    addBtn.onclick = () => {
      const titleIn = document.getElementById('new-asgn-title');
      const subjIn = document.getElementById('new-asgn-subj');
      const dueIn = document.getElementById('new-asgn-due');

      const title = titleIn ? titleIn.value.trim() : '';
      const subject = subjIn ? subjIn.value.trim() || 'General' : 'General';
      const due = dueIn ? dueIn.value || '2026-08-10' : '2026-08-10';

      if (title) {
        currentState.assignments.push({ id: Date.now(), title, subject, due, status: 'Pending' });
        titleIn.value = '';
        if (subjIn) subjIn.value = '';
        if (store) store.saveState(currentState);
        renderApp();
      }
    };
  }

  const calcBtn = document.getElementById('asgn-calc-btn');
  if (calcBtn) calcBtn.onclick = () => generateReport();

  renderApp();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});