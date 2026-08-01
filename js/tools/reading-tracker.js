/**
 * Upgraded Reading Tracker Engine with LocalStorage Persistence
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const out = document.getElementById('main-output');

  const defaultState = {
    books: [
      { id: 1, title: '📖 Atomic Habits', author: 'James Clear', currentPage: 215, totalPages: 320 },
      { id: 2, title: '📘 Deep Work', author: 'Cal Newport', currentPage: 180, totalPages: 300 },
      { id: 3, title: '📙 The Psychology of Money', author: 'Morgan Housel', currentPage: 240, totalPages: 240 }
    ]
  };

  let store = null;
  let currentState = JSON.parse(JSON.stringify(defaultState));

  if (window.initPlannerPersistence) {
    store = window.initPlannerPersistence('reading-tracker', defaultState, (newState) => {
      currentState = newState;
      renderApp();
    });
    currentState = store.loadState();
  }

  if (inputsContainer) {
    inputsContainer.innerHTML = `
      <div style="margin-bottom:1rem">
        <label class="form-label">➕ Add Book to Reading List</label>
        <div style="display:grid;grid-template-columns:2fr 1.5fr 1fr 1fr button;gap:0.5rem">
          <input type="text" id="new-book-title" class="form-input" placeholder="Book Title">
          <input type="text" id="new-book-author" class="form-input" placeholder="Author">
          <input type="number" id="new-book-cur" class="form-input" placeholder="Current Page" min="0">
          <input type="number" id="new-book-tot" class="form-input" placeholder="Total Pages" min="1">
          <button type="button" id="add-book-btn" class="btn btn-primary" style="white-space:nowrap">+ Add</button>
        </div>
      </div>
      <div id="books-items-container" style="margin-bottom:1rem"></div>
      <button type="button" id="read-calc-btn" class="btn btn-primary w-full">📊 Save & Generate Reading Progress Report</button>
    `;
  }

  function renderApp() {
    const itemsContainer = document.getElementById('books-items-container');
    if (itemsContainer) {
      let html = '<div style="display:flex;flex-direction:column;gap:0.75rem">';
      currentState.books.forEach((b, idx) => {
        const pct = Math.min(100, Math.round((b.currentPage / b.totalPages) * 100));
        const isDone = b.currentPage >= b.totalPages;

        html += `
          <div style="padding:0.75rem;background:var(--surface-2);border-radius:var(--radius-sm);border:1px solid var(--border)">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.5rem">
              <div>
                <span style="font-weight:700">${b.title}</span>
                <span style="font-size:0.75rem;color:var(--text-secondary);margin-left:0.5rem">by ${b.author}</span>
              </div>
              <div style="display:flex;align-items:center;gap:0.5rem">
                <span style="font-weight:700;color:${isDone ? '#22c55e' : 'var(--primary)'}">${pct}% Done</span>
                <button type="button" data-idx="${idx}" class="book-del-btn btn btn-secondary btn-sm" style="padding:0.2rem 0.5rem;color:var(--error);font-size:0.8rem">🗑️</button>
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:1rem">
              <div style="flex:1;background:var(--border);height:8px;border-radius:4px;overflow:hidden">
                <div style="width:${pct}%;background:${isDone ? '#22c55e' : 'var(--primary)'};height:100%"></div>
              </div>
              <div style="display:flex;align-items:center;gap:0.25rem;font-size:0.8rem">
                <input type="number" data-idx="${idx}" class="book-page-input form-input" value="${b.currentPage}" min="0" max="${b.totalPages}" style="width:70px;padding:0.2rem;text-align:center">
                <span>/ ${b.totalPages} pages</span>
              </div>
            </div>
          </div>
        `;
      });
      html += '</div>';
      itemsContainer.innerHTML = html;

      // Event Listeners
      document.querySelectorAll('.book-page-input').forEach(inp => {
        inp.onchange = (e) => {
          const idx = parseInt(e.target.getAttribute('data-idx'));
          currentState.books[idx].currentPage = parseInt(e.target.value || 0);
          if (store) store.saveState(currentState);
          renderApp();
        };
      });

      document.querySelectorAll('.book-del-btn').forEach(btn => {
        btn.onclick = (e) => {
          const idx = parseInt(e.target.getAttribute('data-idx'));
          currentState.books.splice(idx, 1);
          if (store) store.saveState(currentState);
          renderApp();
        };
      });
    }

    generateReport();
  }

  function generateReport() {
    const totalBooks = currentState.books.length;
    const completedBooks = currentState.books.filter(b => b.currentPage >= b.totalPages).length;
    const totalPagesRead = currentState.books.reduce((sum, b) => sum + Math.min(b.currentPage, b.totalPages), 0);
    const totalPagesTarget = currentState.books.reduce((sum, b) => sum + b.totalPages, 0);
    const overallPct = totalPagesTarget > 0 ? (totalPagesRead / totalPagesTarget) * 100 : 0;

    let res = `==========================================================
                 BOOK READING TRACKER REPORT
==========================================================
Total Books in Shelf:    ${totalBooks} Books
Finished Books:          ${completedBooks} Completed
Total Pages Read:        ${totalPagesRead} / ${totalPagesTarget} pages (${overallPct.toFixed(1)}%)

BOOK READING SHELF:
`;

    currentState.books.forEach(b => {
      const pct = Math.min(100, Math.round((b.currentPage / b.totalPages) * 100));
      const icon = pct >= 100 ? '✅' : '📖';
      res += `${icon} ${b.title.padEnd(25)} (${b.author}) | ${b.currentPage}/${b.totalPages} pgs [${pct}%]\n`;
    });

    res += `\n==========================================================
Summary: ${completedBooks === totalBooks ? '🎉 ALL BOOKS COMPLETED!' : `📚 Keep reading! ${totalBooks - completedBooks} books in progress.`}
==========================================================`;

    if (out) out.value = res;

    // Render Visual Breakdown Card
    const resultsCard = document.getElementById('gen-results-card');
    if (resultsCard) {
      resultsCard.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:1rem;text-align:center">
          <div style="background:var(--surface-2);padding:1rem;border-radius:var(--radius-sm);border:1px solid var(--border)">
            <div style="font-size:0.8rem;color:var(--text-secondary)">Total Pages Read</div>
            <div style="font-size:1.8rem;font-weight:800;color:var(--primary)">${totalPagesRead}</div>
            <div style="font-size:0.75rem;color:var(--text-secondary)">of ${totalPagesTarget} total pages</div>
          </div>
          <div style="background:var(--surface-2);padding:1rem;border-radius:var(--radius-sm);border:1px solid var(--border)">
            <div style="font-size:0.8rem;color:var(--text-secondary)">Finished Books</div>
            <div style="font-size:1.8rem;font-weight:700;color:#22c55e">🏆 ${completedBooks} / ${totalBooks}</div>
            <div style="font-size:0.75rem;color:var(--text-secondary)">${overallPct.toFixed(0)}% Reading Goal</div>
          </div>
        </div>
      `;
    }
  }

  const addBtn = document.getElementById('add-book-btn');
  if (addBtn) {
    addBtn.onclick = () => {
      const titleIn = document.getElementById('new-book-title');
      const authorIn = document.getElementById('new-book-author');
      const curIn = document.getElementById('new-book-cur');
      const totIn = document.getElementById('new-book-tot');

      const title = titleIn ? titleIn.value.trim() : '';
      const author = authorIn ? authorIn.value.trim() || 'Unknown' : 'Unknown';
      const currentPage = curIn ? parseInt(curIn.value || 0) : 0;
      const totalPages = totIn ? parseInt(totIn.value || 300) : 300;

      if (title) {
        currentState.books.push({ id: Date.now(), title, author, currentPage, totalPages });
        titleIn.value = '';
        if (authorIn) authorIn.value = '';
        if (store) store.saveState(currentState);
        renderApp();
      }
    };
  }

  const calcBtn = document.getElementById('read-calc-btn');
  if (calcBtn) calcBtn.onclick = () => generateReport();

  renderApp();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});