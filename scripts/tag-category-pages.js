const fs = require('fs');
const path = require('path');

const catDir = path.join(__dirname, '../categories');

const categoryFileMap = {
  'calculators.html': 'calc',
  'converters.html': 'converter',
  'design-color.html': 'design',
  'developer-tools.html': 'dev',
  'generators.html': 'generator',
  'images.html': 'image',
  'math-tools.html': 'math',
  'pdf.html': 'pdf',
  'planners.html': 'planner',
  'security-encryption.html': 'security',
  'text-tools.html': 'text',
  'web-seo.html': 'dev'
};

const scriptTags = `
<script src="/js/search-index.js" defer></script>
<script src="/js/search-modal.js" defer></script>
<script src="/js/pwa-register.js" defer></script>
`;

let updated = 0;

Object.entries(categoryFileMap).forEach(([file, catSlug]) => {
  const filePath = path.join(catDir, file);
  if (!fs.existsSync(filePath)) return;

  let html = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Add category-themes.css link
  if (!html.includes('category-themes.css')) {
    if (html.includes('<link rel="stylesheet" href="/css/mobile.css">')) {
      html = html.replace('<link rel="stylesheet" href="/css/mobile.css">', '<link rel="stylesheet" href="/css/mobile.css"><link rel="stylesheet" href="/css/category-themes.css">');
      modified = true;
    } else if (html.includes('</head>')) {
      html = html.replace('</head>', '<link rel="stylesheet" href="/css/category-themes.css"></head>');
      modified = true;
    }
  }

  // Tag <main>
  if (html.includes('<main')) {
    html = html.replace(/<main([^>]*)>/i, (match, p1) => {
      let attrs = p1;
      if (attrs.includes('data-category=')) {
        attrs = attrs.replace(/data-category="[^"]*"/, `data-category="${catSlug}"`);
      } else {
        attrs = `${attrs} data-category="${catSlug}"`;
      }
      return `<main${attrs}>`;
    });
    modified = true;
  }

  // Inject search and PWA scripts
  if (!html.includes('/js/search-index.js') && html.includes('</body>')) {
    html = html.replace('</body>', `${scriptTags}\n</body>`);
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, html, 'utf8');
    updated++;
  }
});

console.log(`Successfully updated ${updated} category landing pages!`);
