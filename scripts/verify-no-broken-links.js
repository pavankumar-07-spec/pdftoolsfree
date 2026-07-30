const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const toolsDir = path.join(rootDir, 'tools');
const categoriesDir = path.join(rootDir, 'categories');

const existingTools = new Set(
  fs.readdirSync(toolsDir)
    .filter(f => f.endsWith('.html'))
    .map(f => f.replace(/\.html$/, ''))
);

let totalLinksChecked = 0;
let brokenLinksFound = [];

function scanLinksInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relPath = path.relative(rootDir, filePath);

  const regex = /href=["'](?:\.\.\/|\/)?tools\/([^"'\?#]+)\.html["']/gi;
  let match;
  while ((match = regex.exec(content)) !== null) {
    totalLinksChecked++;
    const slug = path.basename(match[1]);
    if (!existingTools.has(slug)) {
      brokenLinksFound.push({ file: relPath, slug: slug });
    }
  }
}

// Scan index.html
if (fs.existsSync(path.join(rootDir, 'index.html'))) scanLinksInFile(path.join(rootDir, 'index.html'));

// Scan categories
fs.readdirSync(categoriesDir).filter(f => f.endsWith('.html')).forEach(f => scanLinksInFile(path.join(categoriesDir, f)));

// Scan tools
fs.readdirSync(toolsDir).filter(f => f.endsWith('.html')).forEach(f => scanLinksInFile(path.join(toolsDir, f)));

console.log('--- INTERNAL LINK INTEGRITY REPORT ---');
console.log('Total Internal Tool Links Checked:', totalLinksChecked);
console.log('Total Broken Links Found:          ', brokenLinksFound.length);

if (brokenLinksFound.length === 0) {
  console.log('\n🎉 SUCCESS! ZERO BROKEN TOOL LINKS REMAIN ACROSS THE ENTIRE PLATFORM!');
} else {
  console.log('\nRemaining Broken Links:', brokenLinksFound);
}
