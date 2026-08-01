const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '../data/tools.json');
const sitemapFile = path.join(__dirname, '../sitemap.xml');

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

if (fs.existsSync(dataFile)) {
  const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  data.tools.forEach(t => {
    const rawLink = t.link || t.url || '';
    const cleanLink = rawLink.startsWith('/') ? rawLink : `/${rawLink}`;
    xml += `  <url>\n    <loc>${domain}${cleanLink}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
  });
}

xml += `</urlset>\n`;

fs.writeFileSync(sitemapFile, xml, 'utf8');
console.log(`✅ Successfully rebuilt sitemap.xml with active tools!`);
