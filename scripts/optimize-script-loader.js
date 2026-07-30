const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, '../tools');
const files = fs.readdirSync(toolsDir).filter(f => f.endsWith('.html'));

let loaderOptimizedCount = 0;
let lucidePinnedCount = 0;

files.forEach(file => {
  const filePath = path.join(toolsDir, file);
  let html = fs.readFileSync(filePath, 'utf8');

  let modified = false;

  // 1. Upgrade sequential reduce chain to Promise.all parallel execution
  if (html.includes('chain.reduce((p, src) => p.then(() => loadScript(src)), Promise.resolve())')) {
    html = html.replace(
      'chain.reduce((p, src) => p.then(() => loadScript(src)), Promise.resolve())',
      'Promise.all(chain.map(src => loadScript(src)))'
    );
    modified = true;
    loaderOptimizedCount++;
  }

  // 2. Pin Lucide icon CDN version
  if (html.includes('https://unpkg.com/lucide@latest')) {
    html = html.replace('https://unpkg.com/lucide@latest', 'https://unpkg.com/lucide@0.294.0/dist/umd/lucide.min.js');
    modified = true;
    lucidePinnedCount++;
  }

  if (modified) {
    fs.writeFileSync(filePath, html, 'utf8');
  }
});

console.log(`Successfully upgraded parallel Promise.all script loader across ${loaderOptimizedCount} tool HTML files!`);
console.log(`Successfully pinned Lucide CDN version across ${lucidePinnedCount} tool HTML files!`);
