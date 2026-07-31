const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        results = results.concat(getHtmlFiles(filePath));
      }
    } else if (file.endsWith('.html')) {
      results.push(filePath);
    }
  });
  return results;
}

const htmlFiles = getHtmlFiles(rootDir);
console.log(`Optimizing LCP head structure across ${htmlFiles.length} HTML files...`);

let modifiedCount = 0;

htmlFiles.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // 1. Move preconnect after font preloads & replace preconnect with dns-prefetch for third parties
  content = content.replace(
    /<link rel="preconnect" href="https:\/\/pagead2\.googlesyndication\.com">\s*<link rel="preconnect" href="https:\/\/www\.clarity\.ms">/g,
    '<link rel="dns-prefetch" href="https://pagead2.googlesyndication.com"><link rel="dns-prefetch" href="https://www.clarity.ms">'
  );

  // 2. Make non-critical CSS non-render-blocking
  content = content.replace(
    /<link rel="stylesheet" href="\/css\/dark-mode\.css">\s*<link rel="stylesheet" href="\/css\/mobile\.css">\s*<link rel="stylesheet" href="\/css\/category-themes\.css">/g,
    '<link rel="stylesheet" href="/css/dark-mode.css" media="print" onload="this.media=\'all\'"><link rel="stylesheet" href="/css/mobile.css" media="print" onload="this.media=\'all\'"><link rel="stylesheet" href="/css/category-themes.css" media="print" onload="this.media=\'all\'">'
  );

  // 3. Defer Clarity execution until window load event
  const oldClarityRegex = /<script defer>\s*\(function\(c,l,a,r,i,t,y\)\{[\s\S]*?"clarity",\s*"script",\s*"x8xlyl54pl"\);\s*<\/script>/g;
  const newClarityScript = `<script>
  window.addEventListener('load', function() {
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "x8xlyl54pl");
  });
</script>`;

  if (oldClarityRegex.test(content)) {
    content = content.replace(oldClarityRegex, newClarityScript);
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    modifiedCount++;
  }
});

console.log(`✅ LCP HEAD Optimization complete! Modified ${modifiedCount} HTML files.`);
