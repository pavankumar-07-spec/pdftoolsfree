const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '../data/tools.json');
const categoriesDir = path.join(__dirname, '../categories');

const { tools } = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

const categoryFileMap = {
  'Calculators & Math': 'calculators.html',
  'Image Tools': 'images.html',
  'PDF Tools': 'pdf.html',
  'Developer & File Tools': 'developer-tools.html',
  'Converters': 'converters.html',
  'Generators': 'generators.html',
  'Text & String Tools': 'text-tools.html',
  'Planners & Productivity': 'planners.html',
  'Design & Color Tools': 'design-color.html',
  'Security & Encryption': 'security-encryption.html',
  'Web & SEO Tools': 'web-seo.html',
  'B.Tech Level Math Tools': 'math-tools.html'
};

// Group tools by target category file
const toolsByCatFile = {};
Object.values(categoryFileMap).forEach(f => { toolsByCatFile[f] = []; });

tools.forEach(t => {
  const catFile = categoryFileMap[t.category] || 'developer-tools.html';
  if (!toolsByCatFile[catFile]) toolsByCatFile[catFile] = [];
  toolsByCatFile[catFile].push(t);
});

Object.keys(toolsByCatFile).forEach(catFile => {
  const filePath = path.join(categoriesDir, catFile);
  if (!fs.existsSync(filePath)) return;

  let html = fs.readFileSync(filePath, 'utf8');
  const catTools = toolsByCatFile[catFile];

  let cardsHtml = '';
  catTools.forEach(t => {
    const slug = t.id;
    cardsHtml += `<a href="/tools/${slug}.html" class="category-card tool-marketplace-item">
      <div class="category-card-content">
        <div class="category-card-title">${t.name}</div>
        <p class="category-card-desc">${t.description}</p>
      </div>
      <div class="category-card-cta">Use Tool &rarr;</div>
    </a>\n`;
  });

  // Check if category grid container exists
  if (html.includes('id="category-tools-grid"') || html.includes('class="grid-tools"')) {
    const regex = /(<(div|section)[^>]*(?:id="category-tools-grid"|class="[^"]*grid-tools[^"]*")[^>]*>)[\s\S]*?(<\/(div|section)>)/i;
    if (regex.test(html)) {
      html = html.replace(regex, `$1\n${cardsHtml}\n$3`);
    } else {
      // Append cards near main container
      const idx = html.indexOf('</main>');
      if (idx !== -1) {
        html = html.substring(0, idx) + `<div class="grid-tools" style="gap:1rem">\n${cardsHtml}</div>\n` + html.substring(idx);
      }
    }
  } else {
    const idx = html.indexOf('</main>');
    if (idx !== -1) {
      html = html.substring(0, idx) + `<div class="grid-tools" style="gap:1rem">\n${cardsHtml}</div>\n` + html.substring(idx);
    }
  }

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`✅ Updated ${catFile} with ${catTools.length} tools.`);
});

console.log('✅ All category HTML pages re-linked!');
