const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, '../tools');
const indexFile = path.join(__dirname, '../index.html');

const scriptTags = `
<script src="/js/search-index.js" defer></script>
<script src="/js/search-modal.js" defer></script>
<script src="/js/pwa-register.js" defer></script>
`;

let totalUpdated = 0;

function processFile(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');

  let modified = false;

  if (!html.includes('/js/search-index.js')) {
    if (html.includes('</body>')) {
      html = html.replace('</body>', `${scriptTags}\n</body>`);
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, html, 'utf8');
    totalUpdated++;
  }
}

if (fs.existsSync(indexFile)) {
  processFile(indexFile);
}

const files = fs.readdirSync(toolsDir).filter(f => f.endsWith('.html'));
files.forEach(file => processFile(path.join(toolsDir, file)));

console.log(`Successfully injected search modal & PWA scripts into ${totalUpdated} HTML files!`);
