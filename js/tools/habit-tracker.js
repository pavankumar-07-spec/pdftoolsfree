/**
 * Upgraded Interactive Habit Tracker Engine with LocalStorage Persistence
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const out = document.getElementById('main-output');

  const defaultState = {
    habits: [
      { id: 1, name: '💧 Drink 2.5L Water', done: true },
      { id: 2, name: '📖 Read 15 Pages', done: true },
      { id: 3, name: '🏃 30 Min Exercise', done: false },
      { id: 4, name: '🧘 10 Min Meditation', done: false }
    ],
    streak: 5
  };

  let store = null;
  let currentState = JSON.parse(JSON.stringify(defaultState));

  if (window.initPlannerPersistence) {
    store = window.initPlannerPersistence('habit-tracker', defaultState, (newState) => {
      currentState = newState;
      renderApp();
    });
    currentState = store.loadState();
  }

  if (inputsContainer) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label">➕ Add New Daily Habit</label>
        <div style="display:flex;gap:0.5rem">
          <input type="text" id="new-habit-input" class="form-input" placeholder="e.g. 🥦 Eat Healthy Meal">
          <button type="button" id="add-habit-btn" class="btn btn-primary" style="white-space:nowrap">+ Add Habit</button>
        </div>
      </div>
      <div id="habits-list-container" style="margin-bottom:1rem"></div>
      <button type="button" id="habit-calc-btn" class="btn btn-primary w-full">📊 Save & Generate Habit Summary Report</button>
    `;
  }

  function renderApp() {
    const listContainer = document.getElementById('habits-list-container');
    if (listContainer) {
      let html = '<div style="display:flex;flex-direction:column;gap:0.5rem">';
      currentState.habits.forEach((h, idx) => {
        html += `
          <div style="display:flex;align-items:center;justify-content:space-between;padding:0.75rem;background:var(--surface-2);border-radius:var(--radius-sm);border:1px solid var(--border)">
            <label style="display:flex;align-items:center;gap:0.75rem;cursor:pointer;font-weight:600;text-decoration:${h.done ? 'line-through' : 'none'};color:${h.done ? 'var(--text-secondary)' : 'var(--text)'}">
              <input type="checkbox" data-idx="${idx}" class="habit-check" ${h.done ? 'checked' : ''} style="width:1.2rem;height:1.2rem;cursor:pointer">
              ${h.name}
            </label>
            <button type="button" data-idx="${idx}" class="habit-del-btn btn btn-secondary btn-sm" style="padding:0.2rem 0.5rem;color:var(--error);font-size:0.8rem">🗑️</button>
          </div>
        `;
      });
      html += '</div>';
      listContainer.innerHTML = html;

      // Attach Event Listeners
      document.querySelectorAll('.habit-check').forEach(chk => {
        chk.onchange = (e) => {
          const idx = parseInt(e.target.getAttribute('data-idx'));
          currentState.habits[idx].done = e.target.checked;
          if (store) store.saveState(currentState);
          generateReport();
        };
      });

      document.querySelectorAll('.habit-del-btn').forEach(btn => {
        btn.onclick = (e) => {
          const idx = parseInt(e.target.getAttribute('data-idx'));
          currentState.habits.splice(idx, 1);
          if (store) store.saveState(currentState);
          renderApp();
          generateReport();
        };
      });
    }

    generateReport();
  }

  function generateReport() {
    const total = currentState.habits.length;
    const completed = currentState.habits.filter(h => h.done).length;
    const pct = total > 0 ? (completed / total) * 100 : 0;

    let res = `==========================================================
                 DAILY HABIT TRACKER REPORT
==========================================================
Active Streak:       🔥 ${currentState.streak} Days
Completion Rate:     ${pct.toFixed(1)}% (${completed} / ${total} Habits Completed)

HABIT CHECKLIST STATUS:
`;

    currentState.habits.forEach(h => {
      res += `${h.done ? '[x] ✅' : '[ ] ⏳'} ${h.name}\n`;
    });

    res += `\n==========================================================
Status: ${pct === 100 ? '🎉 PERFECT DAY! ALL HABITS COMPLETED!' : '💪 Keep going! Complete remaining habits today.'}
==========================================================`;

    if (out) out.value = res;

    // Render Visual Breakdown Card
    const resultsCard = document.getElementById('gen-results-card');
    if (resultsCard) {
      resultsCard.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:1rem;text-align:center">
          <div style="background:var(--surface-2);padding:1rem;border-radius:var(--radius-sm);border:1px solid var(--border)">
            <div style="font-size:0.8rem;color:var(--text-secondary)">Daily Progress</div>
            <div style="font-size:2rem;font-weight:800;color:${pct === 100 ? '#22c55e' : 'var(--primary)'}">${pct.toFixed(0)}%</div>
            <div style="font-size:0.85rem;color:var(--text-secondary)">${completed} of ${total} Done</div>
          </div>
          <div style="background:var(--surface-2);padding:1rem;border-radius:var(--radius-sm);border:1px solid var(--border)">
            <div style="font-size:0.8rem;color:var(--text-secondary)">Active Streak</div>
            <div style="font-size:1.8rem;font-weight:700;color:#f59e0b">🔥 ${currentState.streak} Days</div>
            <div style="font-size:0.75rem;color:var(--text-secondary)">Auto-Saved to LocalStorage</div>
          </div>
        </div>
      `;
    }
  }

  // Add Habit Listener
  const addBtn = document.getElementById('add-habit-btn');
  if (addBtn) {
    addBtn.onclick = () => {
      const input = document.getElementById('new-habit-input');
      const name = input ? input.value.trim() : '';
      if (name) {
        currentState.habits.push({ id: Date.now(), name, done: false });
        input.value = '';
        if (store) store.saveState(currentState);
        renderApp();
      }
    };
  }

  const calcBtn = document.getElementById('habit-calc-btn');
  if (calcBtn) calcBtn.onclick = () => generateReport();

  renderApp();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});