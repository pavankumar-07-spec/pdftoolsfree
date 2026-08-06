const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

const acronymMap = [
  [/\bPdf\b/g, 'PDF'],
  [/\bGpa\b/g, 'GPA'],
  [/\bCgpa\b/g, 'CGPA'],
  [/\bEmi\b/g, 'EMI'],
  [/\bBjt\b/g, 'BJT'],
  [/\bCsv\b/g, 'CSV'],
  [/\bHtml\b/g, 'HTML'],
  [/\bCss\b/g, 'CSS'],
  [/\bJson\b/g, 'JSON'],
  [/\bQr\b/g, 'QR'],
  [/\bSvg\b/g, 'SVG'],
  [/\bIco\b/g, 'ICO'],
  [/\bGcd\b/g, 'GCD'],
  [/\bLcm\b/g, 'LCM'],
  [/\bFir\b/g, 'FIR'],
  [/\bRgb\b/g, 'RGB'],
  [/\bHex\b/g, 'HEX'],
  [/\bAscii\b/g, 'ASCII'],
  [/\bIp\b/g, 'IP'],
  [/\bUrl\b/g, 'URL'],
  [/\bHttp\b/g, 'HTTP'],
  [/\bHttps\b/g, 'HTTPS'],
  [/\bSeo\b/g, 'SEO']
];

function fixText(str) {
  if (!str) return str;
  let res = str;
  acronymMap.forEach(([regex, replacement]) => {
    res = res.replace(regex, replacement);
  });
  return res;
}

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
      const fixed = fixText(content);
      if (content !== fixed) {
        fs.writeFileSync(fullPath, fixed, 'utf8');
        count++;
      }
    }
  });

  return count;
}

const totalFixed = processDirectory(rootDir);
console.log(`✅ Fixed acronym casing across ${totalFixed} HTML files!`);
