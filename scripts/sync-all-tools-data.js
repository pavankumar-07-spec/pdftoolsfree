const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, '../tools');
const dataFile = path.join(__dirname, '../data/tools.json');
const searchIndexFile = path.join(__dirname, '../js/search-index.js');
const sitemapFile = path.join(__dirname, '../sitemap.xml');

// Category mapping helper
function determineCategory(htmlContent, filename) {
  const catMatch = htmlContent.match(/data-category=["']([^"']+)["']/i) ||
                   htmlContent.match(/categories\/([^"'\.]+)\.html/i);
  
  if (catMatch) {
    const rawCat = catMatch[1].toLowerCase();
    if (rawCat.includes('pdf')) return 'PDF Tools';
    if (rawCat.includes('calc')) return 'Calculators & Math';
    if (rawCat.includes('image')) return 'Image Tools';
    if (rawCat.includes('planner')) return 'Planners & Productivity';
    if (rawCat.includes('generator')) return 'Generators';
    if (rawCat.includes('text')) return 'Text & String Tools';
    if (rawCat.includes('dev')) return 'Developer & File Tools';
    if (rawCat.includes('converter')) return 'Converters';
    if (rawCat.includes('design') || rawCat.includes('color')) return 'Design & Color Tools';
    if (rawCat.includes('security') || rawCat.includes('encrypt')) return 'Security & Encryption';
    if (rawCat.includes('seo') || rawCat.includes('web')) return 'Web & SEO Tools';
    if (rawCat.includes('math')) return 'B.Tech Level Math Tools';
  }

  // Fallbacks based on filename
  if (filename.includes('pdf')) return 'PDF Tools';
  if (filename.includes('image') || filename.includes('photo') || filename.includes('color')) return 'Image Tools';
  if (filename.includes('calc') || filename.includes('matrix') || filename.includes('math') || filename.includes('equation')) return 'Calculators & Math';
  if (filename.includes('generator') || filename.includes('maker')) return 'Generators';
  if (filename.includes('text') || filename.includes('word') || filename.includes('string')) return 'Text & String Tools';
  if (filename.includes('convert')) return 'Converters';
  if (filename.includes('json') || filename.includes('html') || filename.includes('css') || filename.includes('code')) return 'Developer & File Tools';

  return 'Developer & File Tools';
}

function fixAcronyms(str) {
  if (!str) return '';
  return str
    .replace(/\bPdf\b/g, 'PDF')
    .replace(/\bGpa\b/g, 'GPA')
    .replace(/\bCgpa\b/g, 'CGPA')
    .replace(/\bEmi\b/g, 'EMI')
    .replace(/\bBjt\b/g, 'BJT')
    .replace(/\bCsv\b/g, 'CSV')
    .replace(/\bHtml\b/g, 'HTML')
    .replace(/\bCss\b/g, 'CSS')
    .replace(/\bJson\b/g, 'JSON')
    .replace(/\bQr\b/g, 'QR')
    .replace(/\bSvg\b/g, 'SVG')
    .replace(/\bIco\b/g, 'ICO')
    .replace(/\bGcd\b/g, 'GCD')
    .replace(/\bLcm\b/g, 'LCM')
    .replace(/\bFir\b/g, 'FIR')
    .replace(/\bRgb\b/g, 'RGB')
    .replace(/\bHex\b/g, 'HEX')
    .replace(/\bAscii\b/g, 'ASCII')
    .replace(/\bIp\b/g, 'IP')
    .replace(/\bUrl\b/g, 'URL')
    .replace(/\bHttp\b/g, 'HTTP')
    .replace(/\bHttps\b/g, 'HTTPS')
    .replace(/\bSeo\b/g, 'SEO');
}

const htmlFiles = fs.readdirSync(toolsDir).filter(f => f.endsWith('.html')).sort();

const tools = htmlFiles.map(file => {
  const content = fs.readFileSync(path.join(toolsDir, file), 'utf8');
  
  // Extract Title
  let title = '';
  const titleMatch = content.match(/<title>(.*?)<\/title>/i);
  if (titleMatch) {
    title = titleMatch[1].split('-')[0].split('|')[0].trim();
  } else {
    title = file.replace('.html', '').replace(/-/g, ' ');
  }
  title = fixAcronyms(title);

  // Extract Description
  let description = '';
  const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
  if (descMatch) {
    description = descMatch[1].trim();
  } else {
    description = `Free online ${title} tool. Fast, private, and processes data client-side in your browser.`;
  }
  description = fixAcronyms(description);

  const category = determineCategory(content, file);
  const slug = file.replace('.html', '');

  return {
    id: slug,
    name: title,
    title: title,
    category: category,
    description: description,
    link: `/tools/${file}`,
    url: `/tools/${file}`,
    keywords: [slug, category, ...title.toLowerCase().split(' ')]
  };
});

// 1. Write tools.json
const toolsJsonData = { tools };
fs.writeFileSync(dataFile, JSON.stringify(toolsJsonData, null, 2), 'utf8');
console.log(`✅ Synchronized data/tools.json with ALL ${tools.length} tool pages!`);

// 2. Build search-index.js
const categorySlugMap = {
  'Calculators & Math': 'calc',
  'Image Tools': 'image',
  'PDF Tools': 'pdf',
  'Developer & File Tools': 'dev',
  'Converters': 'converter',
  'Generators': 'generator',
  'Text & String Tools': 'text',
  'Planners & Productivity': 'planner',
  'Design & Color Tools': 'design',
  'Security & Encryption': 'security',
  'Web & SEO Tools': 'web-seo',
  'B.Tech Level Math Tools': 'math'
};

const searchIndex = tools.map(t => ({
  title: t.name,
  slug: t.id,
  category: t.category,
  categorySlug: categorySlugMap[t.category] || 'dev',
  description: t.description,
  keywords: t.keywords,
  url: t.link
}));

const searchIndexJs = `/**\n * FreeToolsPDF Search Index\n * Auto-generated search index covering all ${searchIndex.length} tools\n */\nwindow.FREE_TOOLS_SEARCH_INDEX = ${JSON.stringify(searchIndex, null, 2)};\n`;
fs.writeFileSync(searchIndexFile, searchIndexJs, 'utf8');
console.log(`✅ Synchronized js/search-index.js with ${searchIndex.length} tools!`);

// 3. Rebuild sitemap.xml
const domain = 'https://pdftoolsfree.in';
const today = new Date().toISOString().split('T')[0];

const staticPages = [
  { url: '/', priority: '1.0', changefreq: 'weekly' },
  { url: '/about.html', priority: '0.5', changefreq: 'weekly' },
  { url: '/contact.html', priority: '0.5', changefreq: 'weekly' },
  { url: '/terms.html', priority: '0.3', changefreq: 'weekly' },
  { url: '/privacy.html', priority: '0.3', changefreq: 'weekly' },
  { url: '/categories/calculators.html', priority: '0.8', changefreq: 'weekly' },
  { url: '/categories/pdf.html', priority: '0.8', changefreq: 'weekly' },
  { url: '/categories/images.html', priority: '0.8', changefreq: 'weekly' },
  { url: '/categories/planners.html', priority: '0.8', changefreq: 'weekly' },
  { url: '/categories/generators.html', priority: '0.8', changefreq: 'weekly' },
  { url: '/categories/text-tools.html', priority: '0.8', changefreq: 'weekly' },
  { url: '/categories/developer-tools.html', priority: '0.8', changefreq: 'weekly' },
  { url: '/categories/converters.html', priority: '0.8', changefreq: 'weekly' },
  { url: '/categories/design-color.html', priority: '0.8', changefreq: 'weekly' },
  { url: '/categories/security-encryption.html', priority: '0.8', changefreq: 'weekly' },
  { url: '/categories/web-seo.html', priority: '0.8', changefreq: 'weekly' },
  { url: '/categories/math-tools.html', priority: '0.8', changefreq: 'weekly' }
];

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

staticPages.forEach(p => {
  xml += `  <url>\n    <loc>${domain}${p.url}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>\n`;
});

tools.forEach(t => {
  xml += `  <url>\n    <loc>${domain}${t.link}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
});

xml += `</urlset>\n`;
fs.writeFileSync(sitemapFile, xml, 'utf8');
console.log(`✅ Successfully rebuilt sitemap.xml with ALL ${tools.length} tools!`);
