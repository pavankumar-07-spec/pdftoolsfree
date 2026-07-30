
'use strict';

const SVG_PATHS = {
  calculator: '<rect width="16" height="20" x="4" y="2" rx="2" /><line x1="8" x2="16" y1="6" y2="6" /><line x1="16" x2="16" y1="14" y2="18" /><path d="M16 10h.01" /><path d="M12 10h.01" /><path d="M8 10h.01" /><path d="M12 14h.01" /><path d="M8 14h.01" /><path d="M8 18h.01" /><path d="M12 18h.01" />',
  file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" />',
  'file-text': '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" />',
  'file-pdf': '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M9 13v-3h2.5a1.5 1.5 0 0 1 0 3H9Z" /><path d="M14 10v3" /><path d="M17 10h-2v3" />',
  lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />',
  shield: '<path d="M20 13c0 5-3.5 7.5-7.66 9.7a1 1 0 0 1-.68 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 .76-.97l8-2a1 1 0 0 1 .48 0l8 2A1 1 0 0 1 20 6Z" fill="none" />',
  search: '<circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />',
  globe: '<circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" />',
  refresh: '<path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 16h5v5" />',
  image: '<rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />',
  camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" />',
  calendar: '<path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" />',
  clock: '<circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />',
  sparkles: '<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />',
  code: '<polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />',
  key: '<path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 1.5 1.5M15.5 7.5 14 6" />',
  palette: '<path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.7255 3.09032 17.1962 4.85857 19C5.35842 19.508 5.4856 20.2642 5.16853 20.8984C4.85147 21.5325 4.14856 21.932 3.43784 21.8432C3.12521 21.8041 2.81258 21.765 2.5 21.7259" /><circle cx="7.5" cy="10.5" r="1.5" /><circle cx="11.5" cy="7.5" r="1.5" /><circle cx="16.5" cy="9.5" r="1.5" /><circle cx="15.5" cy="14.5" r="1.5" />',
  crop: '<path d="M6 2v14a2 2 0 0 0 2 2h14" /><path d="M18 22V8a2 2 0 0 0-2-2H2" />',
  sliders: '<line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" /><line x1="2" y1="14" x2="6" y2="14" /><line x1="10" y1="8" x2="14" y2="8" /><line x1="18" y1="16" x2="22" y2="16" />',
  'check-square': '<polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />',
  'credit-card': '<rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" />',
  activity: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />',
  percent: '<line x1="19" y1="5" x2="5" y2="19" /><circle cx="6.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" />',
  database: '<ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />',
  trash: '<path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />',
  list: '<line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />',
  chart: '<line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />',
  terminal: '<polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" />'
};

function getIconHtml(name, className = 'w-5 h-5') {
  if (SVG_PATHS[name]) {
    return `<svg class="${className}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${SVG_PATHS[name]}</svg>`;
  }
  return name;
}
window.getIconHtml = getIconHtml;



let TOOLS_DATA = [];

async function loadToolsData() {
  // First check if inline app-data script has content (backward compat)
  const scriptEl = document.getElementById('app-data');
  if (scriptEl && scriptEl.textContent && scriptEl.textContent.trim().length > 10) {
    try {
      const parsed = JSON.parse(scriptEl.textContent);
      return parsed.tools || parsed || [];
    } catch (e) { /* fall through to fetch */ }
  }
  // Fetch from shared external JSON file
  try {
    const res = await fetch('/data/tools.json');
    const parsed = await res.json();
    return parsed.tools || parsed || [];
  } catch (e) {
    console.error('Failed to load tools data:', e);
    return [];
  }
}



const CATEGORIES = [
  {
    id: 'cat-calculators',
    icon: '📊',
    title: 'Calculators & Math',
    link: 'categories/calculators.html',
    desc: 'Attendance, CGPA, Marks & algebra calculators',
    color: 'var(--cat-calc-light)',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
    topTools: ['Attendance', 'CGPA', 'Percentage'],
  },
  {
    id: 'cat-pdf',
    icon: '📄',
    title: 'PDF Tools',
    link: 'categories/pdf.html',
    desc: 'Merge, compress, convert & edit PDFs',
    color: 'var(--cat-pdf-light)',
    gradient: 'linear-gradient(135deg, #DC2626 0%, #F87171 100%)',
    topTools: ['Merge PDF', 'Compress', 'PDF→Image'],
  },
  {
    id: 'cat-images',
    icon: '🖼️',
    title: 'Image Tools',
    link: 'categories/images.html',
    desc: 'Compress, resize, crop & convert images',
    color: 'var(--cat-image-light)',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
    topTools: ['Compress', 'Resize', 'Convert'],
  },
  {
    id: 'cat-planners',
    icon: '📅',
    title: 'Planners & Productivity',
    link: 'categories/planners.html',
    desc: 'Schedule, countdown, track tasks & student helpers',
    color: 'var(--cat-text-light)',
    gradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
    topTools: ['Timetable', 'Exam Countdown', 'Assignments'],
  },
  {
    id: 'cat-generators',
    icon: '✨',
    title: 'Generators',
    link: 'categories/generators.html',
    desc: 'Resume templates, cover letters & QR codes',
    color: 'var(--cat-dev-light)',
    gradient: 'linear-gradient(135deg, #06B6D4 0%, #22D3EE 100%)',
    topTools: ['Resume Builder', 'Cover Letter'],
  },
  {
    id: 'cat-text-tools',
    icon: '📝',
    title: 'Text & String Tools',
    link: 'categories/text-tools.html',
    desc: 'Format, modify, analyze & manipulate text strings',
    color: 'var(--cat-text-light)',
    gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    topTools: ['Case Converter', 'Word Counter'],
  },
  {
    id: 'cat-developer-tools',
    icon: '💻',
    title: 'Developer & File Tools',
    link: 'categories/developer-tools.html',
    desc: 'Formatters, minifiers, JSON/CSV tools & checksums',
    color: 'var(--cat-dev-light)',
    gradient: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
    topTools: ['JSON Formatter', 'Base64', 'CSV Viewer'],
  },
  {
    id: 'cat-converters',
    icon: '🔄',
    title: 'Converters',
    link: 'categories/converters.html',
    desc: 'Unit, timezone, data size & number conversions',
    color: 'var(--cat-calc-light)',
    gradient: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
    topTools: ['Time Zone', 'Data Size'],
  },
  {
    id: 'cat-design-tools',
    icon: '🎨',
    title: 'Design & Color Tools',
    link: 'categories/design-color.html',
    desc: 'Color pickers, gradient/palette makers & CSS generators',
    color: 'var(--cat-image-light)',
    gradient: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
    topTools: ['Color Picker', 'Gradient Generator'],
  },
  {
    id: 'cat-security-tools',
    icon: '🔐',
    title: 'Security & Encryption',
    link: 'categories/security-encryption.html',
    desc: 'Passwords, string hashes, key generators & local encryption',
    color: 'var(--cat-dev-light)',
    gradient: 'linear-gradient(135deg, #0891B2 0%, #0E7490 100%)',
    topTools: ['Password Strength', 'RSA Generator'],
  },
  {
    id: 'cat-seo-tools',
    icon: '🌐',
    title: 'Web & SEO Tools',
    link: 'categories/web-seo.html',
    desc: 'Meta tags, robots.txt, sitemaps & SEO simulators',
    color: 'var(--cat-dev-light)',
    gradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
    topTools: ['Meta Tag Generator', 'Keyword Density', 'Robots.txt'],
  }
];


function initHeroParticles() {
  const container = document.querySelector('.hero-particles');
  if (!container || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const count = window.innerWidth < 768 ? 8 : 16;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'hero-particle';
    const size = Math.random() * 40 + 10;
    p.style.cssText = [
      `width:${size}px`,
      `height:${size}px`,
      `left:${Math.random() * 100}%`,
      `animation-duration:${Math.random() * 12 + 8}s`,
      `animation-delay:${Math.random() * 10}s`,
      `opacity:${Math.random() * 0.15 + 0.03}`,
    ].join(';');
    container.appendChild(p);
  }
}


function initCountUp() {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length || typeof IntersectionObserver === 'undefined') return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1200;
      const start = performance.now();

      const step = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(ease * target) + suffix;
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  els.forEach(el => obs.observe(el));
}


function initSearch() {
  const container = document.getElementById('search-container');
  if (!container || typeof SearchBar === 'undefined') return;

  const searchBar = new SearchBar({
    id: 'main-search',
    placeholder: 'Search 50+ student tools... (e.g., attendance, CGPA, PDF)',
    data: TOOLS_DATA,
    onSearch: (query) => {
      const results = TOOLS_DATA.filter(t =>
        t.name.toLowerCase().includes(query.toLowerCase()) ||
        t.category.toLowerCase().includes(query.toLowerCase()) ||
        t.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
      if (results.length > 0) {
        window.location.href = results[0].link;
      } else {
        showToast(`No tools found for "${query}"`, 'warning');
      }
    },
  });

  container.appendChild(searchBar.render());

  
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      searchBar.focus();
    }
  });
}


function initScrollAnimations() {
  if (typeof IntersectionObserver === 'undefined') return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('animate-in'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('[data-animate]').forEach(el => obs.observe(el));
}


function initRecentTools() {
  const STORE_KEY = 'suh-recent-tools';
  const MAX_RECENT = 4;
  
  
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.category-card');
    if (!card) return;
    
    
    const href = card.getAttribute('href');
    if (!href || !href.includes('tools/')) return;
    
    
    const iconWrap = card.querySelector('.category-icon-wrap');
    const titleEl = card.querySelector('.category-card-title');
    const descEl = card.querySelector('.category-card-desc');
    const accentEl = card.querySelector('.category-card-accent');
    
    if (!titleEl || !descEl || !iconWrap) return;
    
    const toolData = {
      href: href,
      icon: iconWrap.textContent.trim() || iconWrap.innerHTML,
      title: titleEl.textContent.trim(),
      desc: descEl.textContent.trim(),
      accentBg: accentEl ? accentEl.style.background : '',
      iconBg: iconWrap.style.background || ''
    };
    
    let recent = JSON.parse(localStorage.getItem(STORE_KEY) || '[]');
    
    recent = recent.filter(t => !t.href.endsWith(href.split('/').pop()));
    recent.unshift(toolData);
    if (recent.length > MAX_RECENT) recent.pop();
    
    localStorage.setItem(STORE_KEY, JSON.stringify(recent));
  });

  
  const section = document.getElementById('recent-tools-section');
  const grid = document.getElementById('recent-tools-grid');
  const clearBtn = document.getElementById('clear-recent-btn');
  
  if (section && grid) {
    const recent = JSON.parse(localStorage.getItem(STORE_KEY) || '[]');
    if (recent.length > 0) {
      section.style.display = 'block';
      grid.innerHTML = recent.map(t => `
        <a href="${t.href}" class="category-card animate-in">
          <div class="category-card-accent" style="background:${t.accentBg}"></div>
          <div class="category-icon-wrap" style="background:${t.iconBg}">${t.icon}</div>
          <div class="category-card-content">
            <div class="category-card-title">${t.title}</div>
            <p class="category-card-desc">${t.desc}</p>
          </div>
          <div class="category-card-cta">Use Tool →</div>
        </a>
      `).join('');
    }
    
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        localStorage.removeItem(STORE_KEY);
        section.style.display = 'none';
        grid.innerHTML = '';
      });
    }
  }
}


document.addEventListener('DOMContentLoaded', async () => {
  // Load tools data from /data/tools.json before initializing search
  TOOLS_DATA = await loadToolsData();
  
  initSearch();
  initHeroParticles();
  initCountUp();
  initScrollAnimations();
  initRecentTools();

  
  console.log(
    '%c🎓 FreeToolsPDF %cv1.0.0 ',
    'background:#2563EB;color:#fff;padding:4px 8px;border-radius:4px 0 0 4px;font-weight:bold',
    'background:#0EA5E9;color:#fff;padding:4px 8px;border-radius:0 4px 4px 0'
  );
});