const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, '../tools');
const files = fs.readdirSync(toolsDir).filter(f => f.endsWith('.html'));

let injectedCount = 0;

files.forEach(file => {
  const filePath = path.join(toolsDir, file);
  let html = fs.readFileSync(filePath, 'utf8');

  if (!html.includes('/js/related-tools.js')) {
    if (html.includes('</body>')) {
      html = html.replace('</body>', '<script src="/js/related-tools.js" defer></script>\n</body>');
      fs.writeFileSync(filePath, html, 'utf8');
      injectedCount++;
    }
  }
});

console.log(`Successfully injected related-tools.js script into ${injectedCount} tool HTML files!`);
