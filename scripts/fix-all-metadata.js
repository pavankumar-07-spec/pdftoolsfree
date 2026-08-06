const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, '../tools');
const toolFiles = fs.readdirSync(toolsDir).filter(f => f.endsWith('.html'));

function fixAcronyms(str) {
  if (!str) return '';
  return str
    .replace(/\bPdf\b/g, 'PDF')
    .replace(/\bGpa\b/g, 'GPA')
    .replace(/\bCgpa\b/g, 'CGPA')
    .replace(/\bEmi\b/g, 'EMI')
    .replace(/\bBjt\b/g, 'BJT')
    .replace(/\bCsv\b/g, 'CSV')
    .replace(/\bHtml\b/g, 'HTML')
    .replace(/\bCss\b/g, 'CSS')
    .replace(/\bJson\b/g, 'JSON')
    .replace(/\bQr\b/g, 'QR')
    .replace(/\bSvg\b/g, 'SVG')
    .replace(/\bIco\b/g, 'ICO')
    .replace(/\bGcd\b/g, 'GCD')
    .replace(/\bLcm\b/g, 'LCM')
    .replace(/\bFir\b/g, 'FIR')
    .replace(/\bRgb\b/g, 'RGB')
    .replace(/\bHex\b/g, 'HEX')
    .replace(/\bAscii\b/g, 'ASCII')
    .replace(/\bIp\b/g, 'IP')
    .replace(/\bUrl\b/g, 'URL')
    .replace(/\bHttp\b/g, 'HTTP')
    .replace(/\bHttps\b/g, 'HTTPS')
    .replace(/\bSeo\b/g, 'SEO');
}

console.log(`Processing metadata for ${toolFiles.length} tools...`);

let updatedCount = 0;

toolFiles.forEach(file => {
  const filePath = path.join(toolsDir, file);
  let html = fs.readFileSync(filePath, 'utf8');
  const slug = file.replace('.html', '');

  // Generate clean tool name
  const rawTitle = slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
  const toolName = fixAcronyms(rawTitle);

  // Craft concise title (< 60 chars)
  let title = `${toolName} | FreeToolsPDF`;
  if (title.length > 60) {
    title = `${toolName}`;
  }
  if (title.length > 60) {
    title = title.substring(0, 57) + '...';
  }

  // Craft unique, concise meta description (< 155 chars)
  let description = `Free online ${toolName}. Calculate results, analyze data, or process files instantly with privacy in your browser.`;
  description = fixAcronyms(description);
  if (description.length > 155) {
    description = description.substring(0, 152) + '...';
  }

  // Update <title>
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);

  // Update <meta name="description">
  html = html.replace(/<meta\s+name=["']description["']\s+content=["'][\s\S]*?["']/i, `<meta name="description" content="${description}"`);

  // Update og:title
  html = html.replace(/<meta\s+property=["']og:title["']\s+content=["'][\s\S]*?["']/i, `<meta property="og:title" content="${title}"`);

  // Update og:description
  html = html.replace(/<meta\s+property=["']og:description["']\s+content=["'][\s\S]*?["']/i, `<meta property="og:description" content="${description}"`);

  // Update twitter:title
  html = html.replace(/<meta\s+name=["']twitter:title["']\s+content=["'][\s\S]*?["']/i, `<meta name="twitter:title" content="${title}"`);

  // Update twitter:description
  html = html.replace(/<meta\s+name=["']twitter:description["']\s+content=["'][\s\S]*?["']/i, `<meta name="twitter:description" content="${description}"`);

  fs.writeFileSync(filePath, html, 'utf8');
  updatedCount++;
});

console.log(`✅ Successfully updated metadata across ${updatedCount} tool HTML files!`);
