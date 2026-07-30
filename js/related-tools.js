/**
 * FreeToolsPDF Related Tools Module
 * Renders dynamic 4-card "You Might Also Need" widget based on active tool category
 */
document.addEventListener('DOMContentLoaded', () => {
  const mainShell = document.querySelector('.tool-content-shell') || document.getElementById('main-content');
  if (!mainShell || document.getElementById('related-tools-widget')) return;

  const currentCategory = mainShell.getAttribute('data-category') || 'dev';
  const currentSlug = window.location.pathname.split('/').pop().replace(/\.html$/, '');

  const searchIndex = window.FREE_TOOLS_SEARCH_INDEX || [];
  if (searchIndex.length === 0) return;

  // Filter tools matching category excluding current tool
  let related = searchIndex.filter(item => item.categorySlug === currentCategory && item.slug !== currentSlug);
  
  if (related.length < 4) {
    related = searchIndex.filter(item => item.slug !== currentSlug);
  }

  // Shuffle & pick 4 related tools
  const randomFour = related.sort(() => 0.5 - Math.random()).slice(0, 4);

  const widgetHTML = `
    <div id="related-tools-widget" style="margin-top:4rem;padding-top:2rem;border-top:1px solid var(--border, #e2e8f0);">
      <h3 style="font-size:1.3rem;font-weight:700;margin-bottom:1.25rem;color:var(--text, #0f172a);display:flex;align-items:center;gap:0.5rem;">
        <span>💡</span> You Might Also Need
      </h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:1rem;">
        ${randomFour.map(item => `
          <a href="${item.url}" style="display:flex;flex-direction:column;padding:1.25rem;background:var(--surface-1, #ffffff);border:1px solid var(--border, #e2e8f0);border-radius:12px;text-decoration:none;transition:all 0.2s ease;box-shadow:0 4px 6px -1px rgba(0,0,0,0.05);" onmouseover="this.style.transform='translateY(-3px)';this.style.borderColor='var(--accent, #FF5A1F)';" onmouseout="this.style.transform='none';this.style.borderColor='var(--border, #e2e8f0)';">
            <div style="font-weight:700;font-size:1rem;color:var(--text, #0f172a);margin-bottom:0.4rem;">${item.title}</div>
            <div style="font-size:0.825rem;color:var(--text-muted, #64748b);line-height:1.4;">${item.description.slice(0, 70)}...</div>
            <div style="margin-top:auto;padding-top:0.75rem;font-size:0.75rem;font-weight:600;color:var(--accent, #FF5A1F);display:flex;align-items:center;gap:0.25rem;">
              Open Tool →
            </div>
          </a>
        `).join('')}
      </div>
    </div>
  `;

  mainShell.insertAdjacentHTML('beforeend', widgetHTML);
});
