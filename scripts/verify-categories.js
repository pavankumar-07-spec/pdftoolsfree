const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '../tools');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const catCounts = {};
let taggedCount = 0;
let missingTag = 0;
let cssLinkCount = 0;

files.forEach(f => {
  const c = fs.readFileSync(path.join(dir, f), 'utf8');
  if (c.includes('category-themes.css')) cssLinkCount++;
  const m = c.match(/<main[^>]*data-category="([^"]+)"/);
  if (m) {
    taggedCount++;
    catCounts[m[1]] = (catCounts[m[1]] || 0) + 1;
  } else {
    missingTag++;
  }
});

console.log('Total HTML tool files:', files.length);
console.log('Files with category-themes.css linked:', cssLinkCount);
console.log('Files with data-category tag:', taggedCount);
console.log('Missing category tag:', missingTag);
console.log('Category distribution:', catCounts);
