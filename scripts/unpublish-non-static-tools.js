const fs = require('fs');
const path = require('path');

const nonStaticSlugs = new Set([
  'pdf-to-word',
  'word-to-pdf'
]);

const dataFile = path.join(__dirname, '../data/tools.json');
const redirectsFile = path.join(__dirname, '../_redirects');

console.log('--- REMOVING NON-STATIC / PSEUDO CONVERTER TOOLS ---');

// 1. Update data/tools.json
if (fs.existsSync(dataFile)) {
  const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  const originalCount = data.tools.length;
  data.tools = data.tools.filter(t => {
    const rawLink = t.link || t.url || '';
    const filename = path.basename(rawLink);
    const slug = filename.replace(/\.html$/, '');
    return !nonStaticSlugs.has(slug);
  });
  const removedCount = originalCount - data.tools.length;
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf8');
  console.log(`✅ Removed ${removedCount} non-static tools from data/tools.json. Remaining active tools: ${data.tools.length}`);
}

// 2. Add 301 Redirects to _redirects
if (fs.existsSync(redirectsFile)) {
  let redirects = fs.readFileSync(redirectsFile, 'utf8');
  let addedRedirects = false;

  if (!redirects.includes('/tools/pdf-to-word.html')) {
    redirects += `\n/tools/pdf-to-word.html /tools/pdf-to-text.html 301\n/tools/pdf-to-word /tools/pdf-to-text.html 301`;
    addedRedirects = true;
  }
  if (!redirects.includes('/tools/word-to-pdf.html')) {
    redirects += `\n/tools/word-to-pdf.html /categories/pdf.html 301\n/tools/word-to-pdf /categories/pdf.html 301`;
    addedRedirects = true;
  }

  if (addedRedirects) {
    fs.writeFileSync(redirectsFile, redirects.trim() + '\n', 'utf8');
    console.log('✅ Added 301 permanent redirects to _redirects to preserve SEO rankings.');
  }
}

// 3. Remove non-static HTML & JS files
nonStaticSlugs.forEach(slug => {
  const htmlPath = path.join(__dirname, `../tools/${slug}.html`);
  const jsPath = path.join(__dirname, `../js/tools/${slug}.js`);

  if (fs.existsSync(htmlPath)) {
    fs.unlinkSync(htmlPath);
    console.log(`Deleted non-static HTML tool: tools/${slug}.html`);
  }
  if (fs.existsSync(jsPath)) {
    fs.unlinkSync(jsPath);
    console.log(`Deleted non-static JS script: js/tools/${slug}.js`);
  }
});

// 4. Rebuild Search Index
const searchIndexScript = path.join(__dirname, 'build-search-index.js');
if (fs.existsSync(searchIndexScript)) {
  require('./build-search-index.js');
  console.log('✅ Rebuilt search index without non-static tools.');
}
