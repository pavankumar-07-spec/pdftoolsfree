const fs = require('fs');
const path = require('path');

// Rebuilt tools ready for publication
const rebuiltSlugs = [
  'merge-pdf', 'split-pdf', 'rotate-pdf', 'extract-pdf-pages', 'delete-pdf-pages',
  'image-to-pdf', 'text-to-pdf', 'pdf-add-blank-page', 'pdf-flatten-forms', 'pdf-form-filler',
  'pdf-metadata-viewer', 'pdf-page-counter', 'pdf-page-size-converter-a4-letter', 'pdf-compare',
  'pdf-grayscale-converter', 'pdf-page-cropper', 'pdf-password-protect', 'pdf-password-remove',
  'pdf-qr-code-inserter', 'pdf-to-image', 'pdf-unlock-checker', 'word-to-pdf', 'qr-code-generator'
];

const toolsDir = path.join(__dirname, '../tools');
const dataFile = path.join(__dirname, '../data/tools.json');

// Re-index HTML meta robots tags to "index, follow"
rebuiltSlugs.forEach(slug => {
  const htmlPath = path.join(toolsDir, `${slug}.html`);
  if (fs.existsSync(htmlPath)) {
    let html = fs.readFileSync(htmlPath, 'utf8');
    if (html.includes('<meta name="robots" content="noindex, nofollow">')) {
      html = html.replace('<meta name="robots" content="noindex, nofollow">', '<meta name="robots" content="index, follow">');
      fs.writeFileSync(htmlPath, html, 'utf8');
    }
  }
});

// Re-add to data/tools.json if missing
if (fs.existsSync(dataFile)) {
  const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  const existingLinks = new Set(data.tools.map(t => path.basename(t.link || t.url || '').replace(/\.html$/, '')));

  rebuiltSlugs.forEach(slug => {
    if (!existingLinks.has(slug)) {
      data.tools.push({
        id: slug,
        name: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        desc: `100% client-side ${slug.replace(/-/g, ' ')} tool. Process data securely and privately offline in your browser.`,
        category: slug.includes('pdf') ? 'PDF Tools' : 'Generators',
        icon: 'tool',
        color: 'var(--cat-pdf-light)',
        tags: [slug],
        link: `tools/${slug}.html`
      });
    }
  });

  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf8');
}

// Regenerate search index
require('./build-search-index.js');
console.log(`Successfully re-indexed and published ${rebuiltSlugs.length} rebuilt tools!`);
