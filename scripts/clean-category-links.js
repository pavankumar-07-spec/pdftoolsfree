const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, '../tools');
const categoriesDir = path.join(__dirname, '../categories');
const indexFile = path.join(__dirname, '../index.html');

// Set of existing tool slugs on disk
const existingToolSlugs = new Set(
  fs.readdirSync(toolsDir)
    .filter(f => f.endsWith('.html'))
    .map(f => f.replace(/\.html$/, ''))
);

console.log(`Total active tool HTML files existing on disk: ${existingToolSlugs.size}`);

let totalLinksRemoved = 0;

function cleanHtmlFile(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');

  // Match tool links in hrefs: href="../tools/slug.html" or href="/tools/slug.html" or href="tools/slug.html"
  const regex = /<a[^>]*href=["'](?:\.\.\/|\/)?tools\/([^"'\?#]+)\.html["'][^>]*>[\s\S]*?<\/a>/gi;

  let fileRemovedCount = 0;

  // Find all cards / links that point to missing tool HTML files
  html = html.replace(regex, (match, slug) => {
    const cleanSlug = path.basename(slug);
    if (!existingToolSlugs.has(cleanSlug)) {
      fileRemovedCount++;
      totalLinksRemoved++;
      return ''; // Remove link/card element
    }
    return match;
  });

  // Also clean up empty grid card wrapper divs if left behind
  html = html.replace(/<div class="[^"]*tool-card[^"]*"[^>]*>\s*<\/div>/gi, '');
  html = html.replace(/<li[^>]*>\s*<\/li>/gi, '');

  if (fileRemovedCount > 0) {
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`Cleaned ${fileRemovedCount} broken tool links from ${path.basename(filePath)}`);
  }
}

// Clean index.html
if (fs.existsSync(indexFile)) {
  cleanHtmlFile(indexFile);
}

// Clean category pages
const catFiles = fs.readdirSync(categoriesDir).filter(f => f.endsWith('.html'));
catFiles.forEach(f => cleanHtmlFile(path.join(categoriesDir, f)));

console.log(`\n🎉 Successfully removed ${totalLinksRemoved} broken links to deleted tools across index.html and category pages!`);
