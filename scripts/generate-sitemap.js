/**
 * Dynamic Sitemap Generator
 */
const fs = require('fs');
const path = require('path');

const tools = JSON.parse(fs.readFileSync('./data/tools.json', 'utf8')).tools.filter(t => t.published !== false);
const base = 'https://pdftoolsfree.in';
const today = new Date().toISOString().split('T')[0];

let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
xml += `  <url><loc>${base}/</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>\n`;

const cats = fs.readdirSync('./categories').filter(f => f.endsWith('.html'));
cats.forEach(c => {
  xml += `  <url><loc>${base}/categories/${c}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>\n`;
});

tools.forEach(t => {
  xml += `  <url><loc>${base}/tools/${t.id}.html</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>\n`;
});

xml += '</urlset>';

fs.writeFileSync('./sitemap.xml', xml, 'utf8');
console.log(`✅ Sitemap successfully regenerated with ${tools.length + cats.length + 1} URLs!`);
