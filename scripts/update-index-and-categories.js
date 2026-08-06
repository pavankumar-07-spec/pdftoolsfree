const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '../data/tools.json');
const indexFile = path.join(__dirname, '../index.html');
const categoriesDir = path.join(__dirname, '../categories');

if (!fs.existsSync(dataFile)) {
  console.error('ERROR: data/tools.json does not exist');
  process.exit(1);
}

const { tools } = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
console.log(`Loaded ${tools.length} tools from tools.json.`);

const categorySlugMap = {
  'Calculators & Math': 'calculators',
  'Image Tools': 'images',
  'PDF Tools': 'pdf',
  'Developer & File Tools': 'developer-tools',
  'Converters': 'converters',
  'Generators': 'generators',
  'Text & String Tools': 'text-tools',
  'Planners & Productivity': 'planners',
  'Design & Color Tools': 'design-color',
  'Security & Encryption': 'security-encryption',
  'Web & SEO Tools': 'web-seo',
  'B.Tech Level Math Tools': 'math-tools'
};

const categoryShortSlugMap = {
  'Calculators & Math': 'calculators',
  'Image Tools': 'images',
  'PDF Tools': 'pdf',
  'Developer & File Tools': 'developer-tools',
  'Converters': 'converters',
  'Generators': 'generators',
  'Text & String Tools': 'text-tools',
  'Planners & Productivity': 'planners',
  'Design & Color Tools': 'design-color',
  'Security & Encryption': 'security-encryption',
  'Web & SEO Tools': 'web-seo',
  'B.Tech Level Math Tools': 'math-tools'
};

const iconMap = {
  'PDF Tools': '📄',
  'Calculators & Math': '📊',
  'Image Tools': '🖼️',
  'Planners & Productivity': '📅',
  'Generators': '✨',
  'Text & String Tools': '📝',
  'Developer & File Tools': '💻',
  'Converters': '🔄',
  'Design & Color Tools': '🎨',
  'Security & Encryption': '🔐',
  'Web & SEO Tools': '🌐',
  'B.Tech Level Math Tools': '📐'
};

// 1. Rebuild index.html marketplace grid
let indexHtml = fs.readFileSync(indexFile, 'utf8');

const gridStartMarker = '<div id="tools-grid" class="grid-tools" style="gap:var(--space-5)">';
const gridEndMarker = '</div><!-- End Tools Grid -->';

if (indexHtml.includes(gridStartMarker)) {
  let gridCards = '\n';
  tools.forEach(t => {
    const shortCat = (categoryShortSlugMap[t.category] || 'developer-tools').replace('-tools', '');
    const icon = iconMap[t.category] || '🛠️';
    const link = t.link.startsWith('/') ? t.link : `/${t.link}`;

    gridCards += `  <a href="${link}" class="category-card tool-marketplace-item animate-in" data-category="${shortCat}">
    <div class="category-card-accent" style="background:linear-gradient(135deg, var(--primary), var(--secondary))"></div>
    <div class="category-icon-wrap" style="background:var(--bg-secondary); display:flex; align-items:center; justify-content:center; width: 48px; height: 48px; font-size: 1.4rem;">${icon}</div>
    <div class="category-card-content" style="padding-top: var(--space-2)">
      <div class="category-card-title" style="font-size: var(--text-base); font-weight: 700;">${t.name}</div>
      <p class="category-card-desc" style="font-size: var(--text-xs); color: var(--text-secondary); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${t.description}</p>
    </div>
    <div class="category-card-cta" style="font-size: 11px; padding: 0.2rem 0.6rem;">Use Tool &rarr;</div>
  </a>\n`;
  });

  const gridRegex = new RegExp(`${gridStartMarker.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")}[\\s\\S]*?${gridEndMarker.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")}`);
  if (gridRegex.test(indexHtml)) {
    indexHtml = indexHtml.replace(gridRegex, `${gridStartMarker}${gridCards}${gridEndMarker}`);
    fs.writeFileSync(indexFile, indexHtml, 'utf8');
    console.log(`✅ Updated index.html tools-grid with all ${tools.length} tools!`);
  } else {
    // Replace until next section
    const startIdx = indexHtml.indexOf(gridStartMarker);
    const nextSectionIdx = indexHtml.indexOf('</section>', startIdx);
    if (startIdx !== -1 && nextSectionIdx !== -1) {
      indexHtml = indexHtml.substring(0, startIdx + gridStartMarker.length) + gridCards + indexHtml.substring(nextSectionIdx);
      fs.writeFileSync(indexFile, indexHtml, 'utf8');
      console.log(`✅ Updated index.html tools-grid with all ${tools.length} tools!`);
    }
  }
}

// Also update category count numbers on index.html
const countsByCategory = {};
tools.forEach(t => {
  countsByCategory[t.category] = (countsByCategory[t.category] || 0) + 1;
});
console.log('Tool counts per category:', countsByCategory);
