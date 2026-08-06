const fs = require('fs');
const path = require('path');

const dirs = ['tools', 'categories', '.'];
let count = 0;

dirs.forEach(d => {
  const dirPath = path.join(__dirname, '..', d);
  if (!fs.existsSync(dirPath)) return;
  const files = fs.readdirSync(dirPath);
  files.forEach(f => {
    if (f.endsWith('.html')) {
      const fp = path.join(dirPath, f);
      let content = fs.readFileSync(fp, 'utf8');
      if (content.includes('noindex')) {
        content = content.replace(/content=["']noindex,\s*follow["']/gi, 'content="index, follow"');
        content = content.replace(/content=["']noindex["']/gi, 'content="index, follow"');
        fs.writeFileSync(fp, content, 'utf8');
        count++;
      }
    }
  });
});

console.log(`Successfully fixed noindex meta tags in ${count} files.`);
