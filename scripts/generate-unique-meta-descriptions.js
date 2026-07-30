const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, '../tools');
const files = fs.readdirSync(toolsDir).filter(f => f.endsWith('.html'));

let updatedDescriptionsCount = 0;

files.forEach(file => {
  const filePath = path.join(toolsDir, file);
  let html = fs.readFileSync(filePath, 'utf8');

  const slug = file.replace(/\.html$/, '');
  const toolName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  let categoryDesc = 'Perform fast, private data processing offline in your browser.';
  if (slug.includes('pdf')) {
    categoryDesc = 'Merge, split, extract, rotate, and edit PDF documents 100% locally in browser memory without server uploads.';
  } else if (slug.includes('calculator') || slug.includes('gpa') || slug.includes('interest')) {
    categoryDesc = 'Calculate exact mathematical, financial, and academic formulas instantly with zero data transmission.';
  } else if (slug.includes('image') || slug.includes('png') || slug.includes('jpg')) {
    categoryDesc = 'Crop, resize, compress, and edit graphics locally using client-side HTML5 Canvas API.';
  } else if (slug.includes('json') || slug.includes('xml') || slug.includes('sql') || slug.includes('code')) {
    categoryDesc = 'Format, validate, beautify, and inspect code payloads privately inside your browser.';
  }

  const customDesc = `Free online ${toolName} tool. ${categoryDesc} 100% private, no signup, no file limits.`;

  if (html.includes('<meta name="description" content="Free online')) {
    html = html.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${customDesc}">`);
    fs.writeFileSync(filePath, html, 'utf8');
    updatedDescriptionsCount++;
  }
});

console.log(`Successfully generated unique SEO meta descriptions across ${updatedDescriptionsCount} tool HTML files!`);
