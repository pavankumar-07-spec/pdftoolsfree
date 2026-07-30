class CategoryCard {
  
  constructor(config = {}) {
    this.icon      = config.icon      || '🔧';
    this.title     = config.title     || 'Category';
    this.count     = config.count     || 0;
    this.link      = config.link      || '#';
    this.id        = config.id        || `cat-${Math.random().toString(36).slice(2, 7)}`;
    this.desc      = config.desc      || '';
    this.color     = config.color     || 'var(--primary-light)';
    this.gradient  = config.gradient  || 'linear-gradient(135deg, var(--primary) 0%, #0EA5E9 100%)';
    this.topTools  = config.topTools  || [];
    this._element  = null;
  }

  
  render() {
    const card = document.createElement('a');
    card.className = 'category-card';
    card.id = this.id;
    card.href = this.link;
    card.setAttribute('role', 'article');
    card.setAttribute('aria-label', `${this.title} - ${this.count} tools`);

    
    const accentBar = document.createElement('div');
    accentBar.className = 'category-card-accent';
    accentBar.style.background = this.gradient;
    card.appendChild(accentBar);

    
    const iconWrap = document.createElement('div');
    iconWrap.className = 'category-icon-wrap';
    iconWrap.style.background = this.color;
    iconWrap.setAttribute('aria-hidden', 'true');
    iconWrap.innerHTML = this.icon;
    card.appendChild(iconWrap);

    
    const content = document.createElement('div');
    content.className = 'category-card-content';

    const title = document.createElement('div');
    title.className = 'category-card-title';
    title.textContent = this.title;
    content.appendChild(title);

    const count = document.createElement('div');
    count.className = 'category-card-count';
    count.textContent = `${this.count} tool${this.count !== 1 ? 's' : ''}`;
    content.appendChild(count);

    if (this.desc) {
      const desc = document.createElement('p');
      desc.className = 'category-card-desc';
      desc.textContent = this.desc;
      content.appendChild(desc);
    }

    if (this.topTools && this.topTools.length) {
      const tags = document.createElement('div');
      tags.className = 'category-top-tools';
      this.topTools.slice(0, 3).forEach(tool => {
        const tag = document.createElement('span');
        tag.className = 'category-top-tool-tag';
        tag.textContent = tool;
        tags.appendChild(tag);
      });
      content.appendChild(tags);
    }

    card.appendChild(content);

    
    const cta = document.createElement('div');
    cta.className = 'category-card-cta';
    cta.setAttribute('aria-hidden', 'true');
    cta.innerHTML = 'View Tools →';
    card.appendChild(cta);

    this._element = card;

    
    this._observeEntrance();

    return card;
  }

  
  _observeEntrance() {
    if (!this._element || typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    obs.observe(this._element);
  }

  
  setCount(count) {
    this.count = count;
    if (this._element) {
      const countEl = this._element.querySelector('.category-card-count');
      if (countEl) countEl.textContent = `${count} tool${count !== 1 ? 's' : ''}`;
    }
  }

  
  static renderAll(categories, container) {
    if (!container) return;
    container.innerHTML = '';
    container.className = 'category-grid grid grid-4';

    categories.forEach((catConfig, i) => {
      const card = new CategoryCard(catConfig);
      const el = card.render();
      el.style.animationDelay = `${i * 0.08}s`;
      container.appendChild(el);
    });
  }
}


(function injectCategoryCardStyles() {
  if (document.getElementById('category-card-styles')) return;
  const style = document.createElement('style');
  style.id = 'category-card-styles';
  style.textContent = `
    .category-card-accent {
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 3px;
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.3s ease;
      border-radius: var(--radius-xl) var(--radius-xl) 0 0;
    }
    .category-card:hover .category-card-accent {
      transform: scaleX(1);
    }

    .category-card-desc {
      font-size: 0.8125rem;
      color: var(--text-muted);
      margin-top: 0.25rem;
      line-height: 1.5;
    }

    .category-top-tools {
      display: flex;
      flex-wrap: wrap;
      gap: 0.375rem;
      margin-top: 0.625rem;
    }

    .category-top-tool-tag {
      font-size: 0.7rem;
      font-weight: 600;
      color: var(--primary);
      background: var(--primary-light);
      padding: 2px 8px;
      border-radius: 999px;
      letter-spacing: 0.02em;
      transition: background 0.15s, color 0.15s;
    }
    .category-card:hover .category-top-tool-tag {
      background: rgba(181,101,46,0.15);
    }
  `;
  document.head.appendChild(style);
})();