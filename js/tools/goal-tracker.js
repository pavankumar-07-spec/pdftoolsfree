/**
 * Upgraded Interactive Goal Progress Tracker Engine with LocalStorage Persistence
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  const defaultState = {
    goals: [
      { id: 1, title: '🎯 Run 100km Marathon Goal', current: 65, target: 100, unit: 'km' },
      { id: 2, title: '💰 Save $5,000 Emergency Fund', current: 3200, target: 5000, unit: '$' },
      { id: 3, title: '📚 Complete 12 Online Courses', current: 8, target: 12, unit: 'courses' }
    ]
  };

  let store = null;
  let currentState = JSON.parse(JSON.stringify(defaultState));

  if (window.initPlannerPersistence) {
    store = window.initPlannerPersistence('goal-tracker', defaultState, (newState) => {
      currentState = newState;
      renderApp();
    });
    currentState = store.loadState();
  }

  if (inputsContainer) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label">➕ Add New Milestone Goal</label>
        <div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr button;gap:0.5rem">
          <input type="text" id="new-goal-title" class="form-input" placeholder="Goal Title">
          <input type="number" id="new-goal-cur" class="form-input" placeholder="Current" min="0">
          <input type="number" id="new-goal-target" class="form-input" placeholder="Target" min="1">
          <input type="text" id="new-goal-unit" class="form-input" placeholder="Unit (e.g. km, $)">
          <button type="button" id="add-goal-btn" class="btn btn-primary" style="white-space:nowrap">+ Add Goal</button>
        </div>
      </div>
      <div id="goals-items-container" style="margin-bottom:1rem"></div>
      <button type="button" id="gt-calc-btn" class="btn btn-primary w-full">📊 Save & Generate Goal Progress Report</button>
    `;
  }

  function renderApp() {
    const itemsContainer = document.getElementById('goals-items-container');
    if (itemsContainer) {
      let html = '<div style="display:flex;flex-direction:column;gap:0.75rem">';
      currentState.goals.forEach((g, idx) => {
        const pct = Math.min(100, Math.round((g.current / g.target) * 100));
        const isDone = g.current >= g.target;

        html += `
          <div style="padding:0.75rem;background:var(--surface-2);border-radius:var(--radius-sm);border:1px solid var(--border)">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.5rem">
              <div>
                <span style="font-weight:700">${g.title}</span>
              </div>
              <div style="display:flex;align-items:center;gap:0.5rem">
                <span style="font-weight:700;color:${isDone ? '#22c55e' : 'var(--primary)'}">${pct}% Completed</span>
                <button type="button" data-idx="${idx}" class="goal-del-btn btn btn-secondary btn-sm" style="padding:0.2rem 0.5rem;color:var(--error);font-size:0.8rem">🗑️</button>
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:1rem">
              <div style="flex:1;background:var(--border);height:8px;border-radius:4px;overflow:hidden">
                <div style="width:${pct}%;background:${isDone ? '#22c55e' : 'var(--primary)'};height:100%"></div>
              </div>
              <div style="display:flex;align-items:center;gap:0.25rem;font-size:0.8rem">
                <input type="number" data-idx="${idx}" class="goal-cur-input form-input" value="${g.current}" min="0" style="width:80px;padding:0.2rem;text-align:center">
                <span>/ ${g.target} ${g.unit}</span>
              </div>
            </div>
          </div>
        `;
      });
      html += '</div>';
      itemsContainer.innerHTML = html;

      // Event Listeners
      document.querySelectorAll('.goal-cur-input').forEach(inp => {
        inp.onchange = (e) => {
          const idx = parseInt(e.target.getAttribute('data-idx'));
          currentState.goals[idx].current = parseFloat(e.target.value || 0);
          if (store) store.saveState(currentState);
          renderApp();
        };
      });

      document.querySelectorAll('.goal-del-btn').forEach(btn => {
        btn.onclick = (e) => {
          const idx = parseInt(e.target.getAttribute('data-idx'));
          currentState.goals.splice(idx, 1);
          if (store) store.saveState(currentState);
          renderApp();
        };
      });
    }

    generateReport();
  }

  function generateReport() {
    const totalGoals = currentState.goals.length;
    const completedGoals = currentState.goals.filter(g => g.current >= g.target).length;
    const avgPct = totalGoals > 0 ? currentState.goals.reduce((sum, g) => sum + Math.min(100, (g.current / g.target) * 100), 0) / totalGoals : 0;

    let res = `==========================================================
               MILESTONE GOAL TRACKER REPORT
==========================================================
Total Goals Tracked:     ${totalGoals} Goals
Completed Goals:         ${completedGoals} Accomplished
Average Progress:        ${avgPct.toFixed(1)}%

MILESTONE GOALS BREAKDOWN:
`;

    currentState.goals.forEach(g => {
      const pct = Math.min(100, Math.round((g.current / g.target) * 100));
      const filledBars = Math.round(pct / 5);
      const progressBar = '█'.repeat(filledBars) + '░'.repeat(20 - filledBars);
      const icon = pct >= 100 ? '✅' : '🎯';
      res += `${icon} ${g.title.padEnd(30)} | ${g.current}/${g.target} ${g.unit} [${progressBar}] ${pct}%\n`;
    });

    res += `\n==========================================================
Status: ${completedGoals === totalGoals ? '🎉 ALL GOALS ACCOMPLISHED!' : `💪 ${totalGoals - completedGoals} active goals in progress.`}
==========================================================`;

    if (out) out.value = res;

    // Render Visual Breakdown Card
    const resultsCard = document.getElementById('gen-results-card');
    if (resultsCard) {
      resultsCard.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:1rem;text-align:center">
          <div style="background:var(--surface-2);padding:1rem;border-radius:var(--radius-sm);border:1px solid var(--border)">
            <div style="font-size:0.8rem;color:var(--text-secondary)">Average Completion</div>
            <div style="font-size:2rem;font-weight:800;color:var(--primary)">${avgPct.toFixed(0)}%</div>
            <div style="font-size:0.75rem;color:var(--text-secondary)">Across all goals</div>
          </div>
          <div style="background:var(--surface-2);padding:1rem;border-radius:var(--radius-sm);border:1px solid var(--border)">
            <div style="font-size:0.8rem;color:var(--text-secondary)">Accomplished</div>
            <div style="font-size:1.8rem;font-weight:700;color:#22c55e">🏆 ${completedGoals} / ${totalGoals}</div>
            <div style="font-size:0.75rem;color:var(--text-secondary)">Goals 100% Completed</div>
          </div>
        </div>
      `;
    }
  }

  const addBtn = document.getElementById('add-goal-btn');
  if (addBtn) {
    addBtn.onclick = () => {
      const titleIn = document.getElementById('new-goal-title');
      const curIn = document.getElementById('new-goal-cur');
      const targetIn = document.getElementById('new-goal-target');
      const unitIn = document.getElementById('new-goal-unit');

      const title = titleIn ? titleIn.value.trim() : '';
      const current = curIn ? parseFloat(curIn.value || 0) : 0;
      const target = targetIn ? parseFloat(targetIn.value || 100) : 100;
      const unit = unitIn ? unitIn.value.trim() || 'units' : 'units';

      if (title) {
        currentState.goals.push({ id: Date.now(), title, current, target, unit });
        titleIn.value = '';
        if (curIn) curIn.value = '';
        if (store) store.saveState(currentState);
        renderApp();
      }
    };
  }

  const calcBtn = document.getElementById('gt-calc-btn') || btn;
  if (calcBtn) calcBtn.onclick = () => generateReport();

  renderApp();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});
