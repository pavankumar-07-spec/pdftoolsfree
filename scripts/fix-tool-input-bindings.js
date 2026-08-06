const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, '../tools');
const jsDir = path.join(__dirname, '../js/tools');

const htmlFiles = fs.readdirSync(toolsDir).filter(f => f.endsWith('.html'));

const aliases = {
  'text-input': ["document.getElementById('input-text')", "document.getElementById('str-input')", "document.getElementById('main-input')", "document.getElementById('text')"],
  'health-gender': ["document.getElementById('gender')"],
  'calc-amount': ["document.getElementById('amount')"],
  'calc-rate': ["document.getElementById('rate')"],
  'calc-mode': ["document.getElementById('mode')"],
  'fourier-expr': ["document.getElementById('expr')"],
  'fourier-n': ["document.getElementById('n')"],
  'limit-expr': ["document.getElementById('expr')"],
  'inv-rate': ["document.getElementById('rate')"],
  'id-theme': ["document.getElementById('theme')"]
};

htmlFiles.forEach(f => {
  const slug = f.replace('.html', '');
  const htmlPath = path.join(toolsDir, f);
  const jsPath = path.join(jsDir, slug + '.js');

  if (!fs.existsSync(jsPath)) return;

  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  let jsContent = fs.readFileSync(jsPath, 'utf8');

  // Extract input IDs from HTML
  const idRegex = /<(?:input|select|textarea)[^>]*id=["']([^"']+)["']/gi;
  let match;
  const htmlIds = [];
  while ((match = idRegex.exec(htmlContent)) !== null) {
    htmlIds.push(match[1]);
  }

  let modified = false;

  htmlIds.forEach(id => {
    if (!jsContent.includes(id)) {
      if (aliases[id]) {
        aliases[id].forEach(alias => {
          if (jsContent.includes(alias)) {
            jsContent = jsContent.replace(alias, `(${alias} || document.getElementById('${id}'))`);
            modified = true;
          }
        });
      }
      
      // Generic match: replace document.getElementById('xxx') with document.getElementById('xxx') || document.getElementById('id')
      if (!jsContent.includes(id)) {
        jsContent = jsContent.replace(/const\s+([a-zA-Z0-9_$]+)\s*=\s*document\.getElementById\(['"]([^'"]+)['"]\)/g, (m, varName, existingId) => {
          if (!m.includes(id)) {
            return `const ${varName} = document.getElementById('${existingId}') || document.getElementById('${id}')`;
          }
          return m;
        });
        modified = true;
      }
    }
  });

  if (modified) {
    fs.writeFileSync(jsPath, jsContent, 'utf8');
  }
});

console.log(`✅ Applied alias fallback input bindings across tools.`);
