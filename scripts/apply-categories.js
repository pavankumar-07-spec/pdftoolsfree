const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '../data/tools.json');
const toolsDir = path.join(__dirname, '../tools');

const categoryMap = {
  'Calculators & Math': 'calc',
  'Image Tools': 'image',
  'PDF Tools': 'pdf',
  'Developer & File Tools': 'dev',
  'Converters': 'converter',
  'Generators': 'generator',
  'Text & String Tools': 'text',
  'Planners & Productivity': 'planner',
  'Design & Color Tools': 'design',
  'B.Tech Level Math Tools': 'math'
};

const securitySlugs = new Set([
  'bcrypt-generator', 'bcrypt-validator', 'encrypt-decrypt-tool', 'file-hash-calculator',
  'hmac-generator', 'md2-generator', 'md4-generator', 'pbkdf2-generator',
  'rsa-key-generator', 'rsa-key-pair-generator', 'password-strength-checker',
  'secure-password-phrase-generator', 'uuid-generator', 'uuid-validator',
  'hash-checksum-generator', 'hash-verifier', 'checksum-generator'
]);

let urlToCategory = {};

if (fs.existsSync(dataFile)) {
  const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  const tools = data.tools || [];
  tools.forEach(t => {
    const rawUrl = t.url || '';
    const filename = path.basename(rawUrl);
    const slug = filename.replace(/\.html$/, '');
    
    let catSlug = categoryMap[t.category] || 'dev';
    if (securitySlugs.has(slug)) {
      catSlug = 'security';
    }
    urlToCategory[filename] = catSlug;
    urlToCategory[slug] = catSlug;
  });
}

const htmlFiles = fs.readdirSync(toolsDir).filter(f => f.endsWith('.html'));

let updatedCount = 0;

htmlFiles.forEach(file => {
  const filePath = path.join(toolsDir, file);
  let html = fs.readFileSync(filePath, 'utf8');

  const slug = file.replace(/\.html$/, '');
  let categorySlug = urlToCategory[file] || urlToCategory[slug] || 'dev';

  if (securitySlugs.has(slug)) {
    categorySlug = 'security';
  } else if (slug.includes('calculator') || slug.includes('interest')) {
    if (!urlToCategory[file]) categorySlug = 'calc';
  } else if (slug.includes('image') || slug.includes('png') || slug.includes('jpg')) {
    if (!urlToCategory[file]) categorySlug = 'image';
  } else if (slug.includes('pdf')) {
    if (!urlToCategory[file]) categorySlug = 'pdf';
  }

  let modified = false;

  // 1. Ensure category-themes.css link is included in head
  if (!html.includes('category-themes.css')) {
    if (html.includes('<link rel="stylesheet" href="/css/mobile.css">')) {
      html = html.replace('<link rel="stylesheet" href="/css/mobile.css">', '<link rel="stylesheet" href="/css/mobile.css"><link rel="stylesheet" href="/css/category-themes.css">');
      modified = true;
    } else if (html.includes('</head>')) {
      html = html.replace('</head>', '<link rel="stylesheet" href="/css/category-themes.css"></head>');
      modified = true;
    }
  }

  // 2. Add or update data-category attribute on <main>
  if (html.includes('<main')) {
    html = html.replace(/<main([^>]*)>/i, (match, p1) => {
      let attrs = p1;
      if (attrs.includes('data-category=')) {
        attrs = attrs.replace(/data-category="[^"]*"/, `data-category="${categorySlug}"`);
      } else {
        attrs = `${attrs} data-category="${categorySlug}"`;
      }
      return `<main${attrs}>`;
    });
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, html, 'utf8');
    updatedCount++;
  }
});

console.log(`Successfully updated category attributes and CSS links across ${updatedCount} tool HTML files!`);
