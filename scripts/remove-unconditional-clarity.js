const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

const clarityScriptRegex = /<script>\s*window\.addEventListener\('load',\s*function\(\)\s*\{\s*\(function\(c,l,a,r,i,t,y\)[\s\S]*?clarity\.ms[\s\S]*?\}\);\s*<\/script>/gi;

function processDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  let count = 0;

  entries.forEach(entry => {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git') {
        count += processDirectory(fullPath);
      }
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (clarityScriptRegex.test(content)) {
        content = content.replace(clarityScriptRegex, '');
        fs.writeFileSync(fullPath, content, 'utf8');
        count++;
      }
    }
  });

  return count;
}

const totalRemoved = processDirectory(rootDir);
console.log(`✅ Removed unconditional Clarity script tags across ${totalRemoved} HTML files! Privacy consent mode is now strictly enforced by js/consent-banner.js.`);
