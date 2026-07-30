const fs = require('fs');
const path = require('path');

const targetReindexSlugs = [
  'barcode-generator',
  'box-shadow-generator',
  'image-to-pdf',
  'merge-pdf',
  'pdf-page-size-converter-a4-letter',
  'pdf-to-image',
  'qr-code-generator',
  'word-to-pdf'
];

const toolsDir = path.join(__dirname, '../tools');
const dataFile = path.join(__dirname, '../data/tools.json');
const sitemapFile = path.join(__dirname, '../sitemap.xml');

// 1. Tag HTML files with <meta name="robots" content="index, follow">
targetReindexSlugs.forEach(slug => {
  const htmlPath = path.join(toolsDir, `${slug}.html`);
  if (fs.existsSync(htmlPath)) {
    let html = fs.readFileSync(htmlPath, 'utf8');
    if (html.includes('<meta name="robots" content="noindex, nofollow">')) {
      html = html.replace('<meta name="robots" content="noindex, nofollow">', '<meta name="robots" content="index, follow">');
      fs.writeFileSync(htmlPath, html, 'utf8');
    }
  }
});

// 2. Add to data/tools.json if not present
if (fs.existsSync(dataFile)) {
  const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  const existingLinks = new Set(data.tools.map(t => path.basename(t.link || t.url || '').replace(/\.html$/, '')));

  targetReindexSlugs.forEach(slug => {
    if (!existingLinks.has(slug)) {
      data.tools.push({
        id: slug,
        name: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        desc: `100% free client-side ${slug.replace(/-/g, ' ')} tool. Process data securely and privately offline in your browser.`,
        category: slug.includes('pdf') ? 'PDF Tools' : (slug.includes('generator') ? 'Generators' : 'Developer & File Tools'),
        icon: 'tool',
        color: 'var(--cat-pdf-light)',
        tags: [slug],
        link: `tools/${slug}.html`
      });
    }
  });

  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf8');
}

// 3. Add to sitemap.xml if not present
if (fs.existsSync(sitemapFile)) {
  let xml = fs.readFileSync(sitemapFile, 'utf8');
  targetReindexSlugs.forEach(slug => {
    const loc = `https://pdftoolsfree.in/tools/${slug}.html`;
    if (!xml.includes(loc)) {
      const urlEntry = `\n  <url>\n    <loc>${loc}</loc>\n    <lastmod>2026-07-30</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.9</priority>\n  </url>`;
      xml = xml.replace('</urlset>', `${urlEntry}\n</urlset>`);
    }
  });
  fs.writeFileSync(sitemapFile, xml, 'utf8');
}

// 4. Regenerate search index
require('./build-search-index.js');

console.log(`Successfully re-indexed all ${targetReindexSlugs.length} high-value tools into sitemap.xml and search system!`);
